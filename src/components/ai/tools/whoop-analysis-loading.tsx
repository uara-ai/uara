"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import {
  WhoopRecoveryArtifact,
  WhoopSleepArtifact,
  WhoopStrainArtifact,
  WhoopWorkoutArtifact,
} from "@/lib/ai";
import {
  IconHeart,
  IconMoon,
  IconActivity,
  IconTarget,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface WhoopAnalysisLoadingProps {
  type: "recovery" | "sleep" | "strain" | "workout";
  className?: string;
}

export function WhoopAnalysisLoading({
  type,
  className,
}: WhoopAnalysisLoadingProps) {
  const recoveryData = useArtifact(WhoopRecoveryArtifact);
  const sleepData = useArtifact(WhoopSleepArtifact);
  const strainData = useArtifact(WhoopStrainArtifact);
  const workoutData = useArtifact(WhoopWorkoutArtifact);

  // Get the appropriate data based on type
  const data = {
    recovery: recoveryData,
    sleep: sleepData,
    strain: strainData,
    workout: workoutData,
  }[type];

  if (!data?.data || data.data.stage === "complete") {
    return null;
  }

  const getStageText = (stage: string, analysisType: string) => {
    switch (stage) {
      case "loading":
        return `Initializing ${analysisType} analysis...`;
      case "processing":
        return `Processing ${analysisType} data...`;
      case "analyzing":
        return `Analyzing ${analysisType} trends and generating insights...`;
      default:
        return `Analyzing ${analysisType} data...`;
    }
  };

  const getIcon = (analysisType: string) => {
    switch (analysisType) {
      case "recovery":
        return <IconHeart className="h-6 w-6 text-[#085983]" />;
      case "sleep":
        return <IconMoon className="h-6 w-6 text-[#085983]" />;
      case "strain":
        return <IconActivity className="h-6 w-6 text-[#085983]" />;
      case "workout":
        return <IconTarget className="h-6 w-6 text-[#085983]" />;
      default:
        return <IconHeart className="h-6 w-6 text-[#085983]" />;
    }
  };

  const getTypeLabel = (analysisType: string) => {
    return analysisType.charAt(0).toUpperCase() + analysisType.slice(1);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center h-full min-h-[300px]",
        className
      )}
    >
      <div className="text-center space-y-4">
        {/* Animated Icon */}
        <div className="p-4 rounded-2xl bg-[#085983]/10 mx-auto w-fit animate-pulse">
          {getIcon(type)}
        </div>

        {/* Loading Title */}
        <div>
          <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] mb-1">
            {getTypeLabel(type)} Analysis
          </h3>
          <p className="text-sm text-[#085983]/70 font-[family-name:var(--font-geist-sans)]">
            {getStageText(data.data.stage, type)}
          </p>
        </div>

        {/* Progress Indicator */}
        {data.data.progress > 0 && (
          <div className="w-64 mx-auto">
            <div className="w-full bg-[#085983]/10 rounded-full h-2 mb-2">
              <div
                className="bg-[#085983] h-2 rounded-full transition-all duration-300"
                style={{ width: `${data.data.progress * 100}%` }}
              />
            </div>
            <p className="text-xs text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
              {Math.round(data.data.progress * 100)}% complete
            </p>
          </div>
        )}

        {/* Loading Animation */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-[#085983]/60 rounded-full animate-bounce" />
          <div
            className="w-2 h-2 bg-[#085983]/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-2 h-2 bg-[#085983]/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
