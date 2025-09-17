"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import { AIDevtools } from "@ai-sdk-tools/devtools";
import { useChat } from "@ai-sdk-tools/store";
import { DefaultChatTransport } from "ai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BurnRateArtifact,
  WhoopRecoveryArtifact,
  WhoopSleepArtifact,
  WhoopStrainArtifact,
  WhoopWorkoutArtifact,
} from "@/lib/ai";
import { BurnRateChart } from "./tools/burn-rate-chart";
import { WhoopRecoveryChart } from "./tools/whoop-recovery-chart";
import { WhoopSleepChart } from "./tools/whoop-sleep-chart";
import { WhoopStrainChart } from "./tools/whoop-strain-chart";
import { WhoopWorkoutChart } from "./tools/whoop-workout-chart";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { ChatAnalysisPanel } from "./chat-analysis-panel";
import { cn } from "@/lib/utils";
import { getWhoopAnalysisDataAction } from "@/actions/whoop-analysis-action";

export default function Chat() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const [input, setInput] = useState("");
  const [showBurnRateChart, setShowBurnRateChart] = useState(false);
  const [showWhoopChart, setShowWhoopChart] = useState<{
    type: "recovery" | "sleep" | "strain" | "workout";
    isOpen: boolean;
  }>({ type: "recovery", isOpen: false });
  const [hasData, setHasData] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [whoopData, setWhoopData] = useState<{
    recovery?: any[];
    sleep?: any[];
    strain?: any[];
    workout?: any[];
  }>({});

  // Use artifacts with event listeners
  const burnRateData = useArtifact(BurnRateArtifact, {
    onStatusChange: (newStatus, oldStatus) => {
      if (newStatus === "loading" && oldStatus === "idle") {
        toast.loading("Starting health analysis...", {
          id: "health-analysis",
        });
      } else if (newStatus === "complete" && oldStatus === "streaming") {
        const alerts = burnRateData?.data?.summary?.alerts?.length || 0;
        const recommendations =
          burnRateData?.data?.summary?.recommendations?.length || 0;
        toast.success(
          `Analysis complete! Found ${alerts} insights and ${recommendations} recommendations.`,
          { id: "health-analysis" }
        );
        setShowAnalysisPanel(true);
      }
    },
    onUpdate: (newData, oldData) => {
      // Show different toasts based on stage changes
      if (newData.stage === "processing" && oldData?.stage === "loading") {
        toast.loading("Processing health data...", {
          id: "health-analysis",
        });
      } else if (
        newData.stage === "analyzing" &&
        oldData?.stage === "processing"
      ) {
        toast.loading("Analyzing trends and generating insights...", {
          id: "health-analysis",
        });
      }
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error}`, {
        id: "health-analysis",
      });
    },
  });

  // Use WHOOP artifacts with event listeners
  const whoopRecoveryData = useArtifact(WhoopRecoveryArtifact, {
    onStatusChange: (newStatus, oldStatus) => {
      if (newStatus === "loading" && oldStatus === "idle") {
        toast.loading("Starting recovery analysis...", {
          id: "whoop-recovery-analysis",
        });
      } else if (newStatus === "complete") {
        toast.success("Recovery analysis complete!", {
          id: "whoop-recovery-analysis",
        });
      } else if (newStatus === "error") {
        toast.error("Recovery analysis failed.", {
          id: "whoop-recovery-analysis",
        });
      }
    },
    onError: (error) => {
      toast.error(`Recovery analysis failed: ${error}`, {
        id: "whoop-recovery-analysis",
      });
    },
  });

  const whoopSleepData = useArtifact(WhoopSleepArtifact, {
    onStatusChange: (newStatus, oldStatus) => {
      if (newStatus === "loading" && oldStatus === "idle") {
        toast.loading("Starting sleep analysis...", {
          id: "whoop-sleep-analysis",
        });
      } else if (newStatus === "complete") {
        toast.success("Sleep analysis complete!", {
          id: "whoop-sleep-analysis",
        });
      } else if (newStatus === "error") {
        toast.error("Sleep analysis failed.", {
          id: "whoop-sleep-analysis",
        });
      }
    },
    onError: (error) => {
      toast.error(`Sleep analysis failed: ${error}`, {
        id: "whoop-sleep-analysis",
      });
    },
  });

  const whoopStrainData = useArtifact(WhoopStrainArtifact, {
    onStatusChange: (newStatus, oldStatus) => {
      if (newStatus === "loading" && oldStatus === "idle") {
        toast.loading("Starting strain analysis...", {
          id: "whoop-strain-analysis",
        });
      } else if (newStatus === "complete") {
        toast.success("Strain analysis complete!", {
          id: "whoop-strain-analysis",
        });
      } else if (newStatus === "error") {
        toast.error("Strain analysis failed.", {
          id: "whoop-strain-analysis",
        });
      }
    },
    onError: (error) => {
      toast.error(`Strain analysis failed: ${error}`, {
        id: "whoop-strain-analysis",
      });
    },
  });

  const whoopWorkoutData = useArtifact(WhoopWorkoutArtifact, {
    onStatusChange: (newStatus, oldStatus) => {
      if (newStatus === "loading" && oldStatus === "idle") {
        toast.loading("Starting workout analysis...", {
          id: "whoop-workout-analysis",
        });
      } else if (newStatus === "complete") {
        toast.success("Workout analysis complete!", {
          id: "whoop-workout-analysis",
        });
      } else if (newStatus === "error") {
        toast.error("Workout analysis failed.", {
          id: "whoop-workout-analysis",
        });
      }
    },
    onError: (error) => {
      toast.error(`Workout analysis failed: ${error}`, {
        id: "whoop-workout-analysis",
      });
    },
  });

  // Fetch WHOOP data on component mount
  useEffect(() => {
    const fetchWhoopData = async () => {
      try {
        const [recoveryResult, sleepResult, strainResult, workoutResult] =
          await Promise.all([
            getWhoopAnalysisDataAction({ analysisType: "recovery", days: 14 }),
            getWhoopAnalysisDataAction({ analysisType: "sleep", days: 14 }),
            getWhoopAnalysisDataAction({ analysisType: "strain", days: 14 }),
            getWhoopAnalysisDataAction({ analysisType: "workout", days: 14 }),
          ]);

        setWhoopData({
          recovery:
            recoveryResult.data && "recoveryData" in recoveryResult.data
              ? recoveryResult.data.recoveryData
              : [],
          sleep:
            sleepResult.data && "sleepData" in sleepResult.data
              ? sleepResult.data.sleepData
              : [],
          strain:
            strainResult.data && "strainData" in strainResult.data
              ? strainResult.data.strainData
              : [],
          workout:
            workoutResult.data && "workoutData" in workoutResult.data
              ? workoutResult.data.workoutData
              : [],
        });
      } catch (error) {
        console.log("WHOOP data not available - user may not be connected");
        // Silently fail - user may not have WHOOP connected
      }
    };

    fetchWhoopData();
  }, []);

  // Track when we have data to trigger animation
  useEffect(() => {
    const hasAnyData =
      burnRateData?.data ||
      whoopRecoveryData?.data ||
      whoopSleepData?.data ||
      whoopStrainData?.data ||
      whoopWorkoutData?.data;

    if (hasAnyData && !hasData) {
      setHasData(true);
      setShowAnalysisPanel(true);
    }
  }, [
    burnRateData?.data,
    whoopRecoveryData?.data,
    whoopSleepData?.data,
    whoopStrainData?.data,
    whoopWorkoutData?.data,
    hasData,
  ]);

  const hasAnalysisData =
    (burnRateData?.data && burnRateData.data.stage === "complete") ||
    (whoopRecoveryData?.data && whoopRecoveryData.data.stage === "complete") ||
    (whoopSleepData?.data && whoopSleepData.data.stage === "complete") ||
    (whoopStrainData?.data && whoopStrainData.data.stage === "complete") ||
    (whoopWorkoutData?.data && whoopWorkoutData.data.stage === "complete");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  const handleExampleClick = (text: string) => {
    setInput(text);
  };

  const handleBackClick = () => {
    setHasData(false);
    setShowAnalysisPanel(false);
  };

  // Chart opening handlers
  const handleOpenBurnRateChart = () => {
    setShowBurnRateChart(true);
  };

  const handleOpenWhoopChart = (
    type: "recovery" | "sleep" | "strain" | "workout"
  ) => {
    setShowWhoopChart({ type, isOpen: true });
  };

  return (
    <>
      {/* Main Chat Container - Full height minus header */}
      <div className="h-[calc(100vh-var(--header-height)-50px)] flex flex-col lg:flex-row bg-gray-50/30">
        {/* Chat Panel */}
        <div
          className={cn(
            "flex flex-col transition-all duration-500 ease-in-out bg-white",
            showAnalysisPanel
              ? "w-full lg:w-1/2 h-1/2 lg:h-full"
              : "w-full h-full"
          )}
        >
          {/* Chat Header 
          <ChatHeader hasData={hasData} onBackClick={handleBackClick} />*/}

          {/* Chat Messages */}
          <ChatMessages
            messages={messages}
            status={status}
            hasData={hasData}
            onExampleClick={handleExampleClick}
            whoopData={whoopData}
            className="flex-1"
          />

          {/* Chat Input */}
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleFormSubmit}
            status={status}
            whoopData={whoopData}
          />
        </div>

        {/* Analysis Panel - Hidden on mobile when no data, shown as bottom half on mobile */}
        {showAnalysisPanel && (
          <ChatAnalysisPanel
            hasAnalysisData={hasAnalysisData || false}
            onOpenBurnRateChart={handleOpenBurnRateChart}
            onOpenWhoopChart={handleOpenWhoopChart}
            className={cn(
              "transition-all duration-500 ease-in-out",
              "h-1/2 lg:h-full lg:w-1/2"
            )}
          />
        )}
      </div>

      {/* Analysis Chart Modals */}
      {burnRateData?.data && (
        <BurnRateChart
          isOpen={showBurnRateChart}
          onClose={() => setShowBurnRateChart(false)}
        />
      )}

      {/* WHOOP Analysis Chart Modals */}
      {showWhoopChart.type === "recovery" && (
        <WhoopRecoveryChart
          isOpen={showWhoopChart.isOpen}
          onClose={() =>
            setShowWhoopChart({ ...showWhoopChart, isOpen: false })
          }
        />
      )}
      {showWhoopChart.type === "sleep" && (
        <WhoopSleepChart
          isOpen={showWhoopChart.isOpen}
          onClose={() =>
            setShowWhoopChart({ ...showWhoopChart, isOpen: false })
          }
        />
      )}
      {showWhoopChart.type === "strain" && (
        <WhoopStrainChart
          isOpen={showWhoopChart.isOpen}
          onClose={() =>
            setShowWhoopChart({ ...showWhoopChart, isOpen: false })
          }
        />
      )}
      {showWhoopChart.type === "workout" && (
        <WhoopWorkoutChart
          isOpen={showWhoopChart.isOpen}
          onClose={() =>
            setShowWhoopChart({ ...showWhoopChart, isOpen: false })
          }
        />
      )}

      <AIDevtools />
    </>
  );
}
