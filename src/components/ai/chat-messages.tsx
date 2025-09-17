"use client";

import { Brain, User, BarChart, ArrowRight } from "lucide-react";
import { IconHeart, IconMoon, IconActivity } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownParser } from "@/components/markdown-parser";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  parts: Array<{ type: string; text?: string }>;
}

interface ChatMessagesProps {
  messages: Message[];
  status: "ready" | "streaming" | "submitted" | "error";
  hasData: boolean;
  onExampleClick: (text: string) => void;
  whoopData?: {
    recovery?: any[];
    sleep?: any[];
    strain?: any[];
    workout?: any[];
  };
  isLoadingWhoopData?: boolean;
  className?: string;
}

export function ChatMessages({
  messages,
  status,
  hasData,
  onExampleClick,
  whoopData,
  isLoadingWhoopData,
  className,
}: ChatMessagesProps) {
  // Generate detailed prompts with real WHOOP data
  const generateWhoopPrompt = (
    type: "recovery" | "sleep" | "strain" | "workout"
  ) => {
    if (isLoadingWhoopData) {
      return `Loading your WHOOP ${type} data...`;
    }

    const data = whoopData?.[type] || [];

    if (data.length === 0) {
      return `Automatically analyze WHOOP ${type} data with detailed insights`;
    }

    const recentData = data.slice(0, 5); // Get last 5 days

    switch (type) {
      case "recovery":
        const recoveryPrompt = recentData
          .map((d, i) => {
            const date = new Date(d.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            return `${date}: ${d.recoveryScore || 0}% recovery, ${
              d.hrvRmssd || 0
            }ms HRV, ${d.restingHeartRate || 0} bpm RHR`;
          })
          .join(". ");
        return `Analyze WHOOP recovery data with detailed insights: ${recoveryPrompt}. Show recovery trends, HRV patterns, and optimization recommendations.`;

      case "sleep":
        const sleepPrompt = recentData
          .map((d, i) => {
            const date = new Date(d.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const duration =
              Math.round(((d.totalInBedTime || 0) / 3600000) * 10) / 10; // Convert ms to hours
            const remHours =
              Math.round(((d.totalRemSleepTime || 0) / 3600000) * 10) / 10;
            const deepHours =
              Math.round(((d.totalSlowWaveSleepTime || 0) / 3600000) * 10) / 10;
            const lightHours =
              Math.round(((d.totalLightSleepTime || 0) / 3600000) * 10) / 10;
            const awakeHours =
              Math.round(((d.totalAwakeTime || 0) / 3600000) * 10) / 10;
            return `${date}: ${duration}h sleep, ${
              d.sleepPerformancePercentage || 0
            }% performance, ${
              d.sleepEfficiencyPercentage || 0
            }% efficiency, ${remHours}h REM, ${deepHours}h deep, ${lightHours}h light, ${awakeHours}h awake, ${
              d.sleepCycleCount || 0
            } cycles`;
          })
          .join(". ");
        return `Analyze WHOOP sleep data with detailed insights: ${sleepPrompt}. Show sleep stages, efficiency trends, and optimization tips.`;

      case "strain":
        const strainPrompt = recentData
          .map((d, i) => {
            const date = new Date(d.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const kilojoules =
              Math.round(((d.kilojoule || 0) / 1000) * 10) / 10; // Convert to k
            return `${date}: ${d.strain || 0} strain, ${
              d.averageHeartRate || 0
            } avg HR, ${
              d.maxHeartRate || 0
            } max HR, ${kilojoules}k kilojoules, ${
              d.percentRecorded || 0
            }% recorded`;
          })
          .join(". ");
        return `Analyze WHOOP strain data with training insights: ${strainPrompt}. Show strain-recovery balance and training load recommendations.`;

      case "workout":
        const workoutPrompt = recentData
          .map((d, i) => {
            const date = new Date(d.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const durationMin = Math.round((d.duration || 0) / 60000); // Convert ms to minutes
            const kilojoules =
              Math.round(((d.kilojoule || 0) / 1000) * 10) / 10;
            const distance = d.distanceMeters
              ? `${Math.round((d.distanceMeters / 1000) * 10) / 10}km`
              : "";
            const sportName = d.sportId ? `Sport ${d.sportId}` : "Workout";
            return `${date}: ${sportName}, ${durationMin}min, ${
              d.strain || 0
            } strain, ${d.averageHeartRate || 0} avg HR, ${
              d.maxHeartRate || 0
            } max HR${
              distance ? `, ${distance}` : ""
            }, ${kilojoules}k kilojoules`;
          })
          .join(". ");
        return `Analyze WHOOP workout data with performance insights: ${workoutPrompt}. Show workout performance trends and training optimization.`;

      default:
        return `Automatically analyze WHOOP ${type} data with detailed insights`;
    }
  };

  const examplePrompts = [
    {
      text: generateWhoopPrompt("recovery"),
      icon: <IconHeart className="h-4 w-4" />,
      category: "Recovery Analysis",
      description: "Analyze trends and patterns",
    },
    {
      text: generateWhoopPrompt("sleep"),
      icon: <IconMoon className="h-4 w-4" />,
      category: "Sleep Analysis",
      description: "Review stages and efficiency",
    },
    {
      text: generateWhoopPrompt("strain"),
      icon: <IconActivity className="h-4 w-4" />,
      category: "Strain Analysis",
      description: "Examine training load",
    },
    {
      text: generateWhoopPrompt("workout"),
      icon: <BarChart className="h-4 w-4" />,
      category: "Workout Analysis",
      description: "Track performance trends",
    },
  ];

  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>
      <div className="p-4 sm:p-6 space-y-4 min-h-full">
        {/* Welcome State */}
        {messages.length === 0 && !hasData && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="p-4 rounded-2xl bg-[#085983]/10">
              <Brain className="h-8 w-8 text-[#085983]" />
            </div>

            <div className="space-y-3 max-w-md">
              <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
                AI Health Coach
              </h2>
              <p className="text-[#085983]/70 font-[family-name:var(--font-geist-sans)] text-sm sm:text-base leading-relaxed">
                Ask me anything about your health data, recovery patterns, or
                longevity optimization. I'll provide personalized insights based
                on your WHOOP metrics.
              </p>
            </div>

            {/* Example Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
              {isLoadingWhoopData
                ? // Show loading skeletons
                  [...Array(4)].map((_, index) => (
                    <Card
                      key={`skeleton-${index}`}
                      className="bg-white rounded-lg border border-[#085983]/10 cursor-not-allowed"
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-md bg-[#085983]/10">
                            <Skeleton className="h-4 w-4" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-2 w-24" />
                          </div>
                          <Skeleton className="h-6 w-6 rounded" />
                        </div>
                      </div>
                    </Card>
                  ))
                : // Show actual example prompts
                  examplePrompts.map((prompt, index) => (
                    <Card
                      key={index}
                      className="bg-white rounded-lg border border-[#085983]/10 hover:border-[#085983]/20 transition-all duration-200 group hover:shadow-sm"
                    >
                      <div className="px-3">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-md bg-[#085983]/10 text-[#085983] group-hover:bg-[#085983]/15 transition-colors">
                            {prompt.icon}
                          </div>
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="text-sm font-medium text-[#085983] font-[family-name:var(--font-geist-sans)]">
                              {prompt.category}
                            </div>
                            <div className="text-xs text-[#085983]/60 font-[family-name:var(--font-geist-sans)] truncate">
                              {prompt.description}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onExampleClick(prompt.text)}
                            disabled={isLoadingWhoopData}
                            className="h-6 w-6 p-0 text-[#085983]/60 hover:text-[#085983] hover:bg-[#085983]/10 shrink-0"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages
          .filter((m) => m.role !== "system")
          .map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-4xl",
                message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  message.role === "user"
                    ? "bg-[#085983] text-white"
                    : "bg-[#085983]/10 text-[#085983]"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
              </div>

              {/* Message Content */}
              <Card
                className={cn(
                  "p-4 rounded-2xl shadow-sm border-0 max-w-[85%] sm:max-w-[75%]",
                  message.role === "user"
                    ? "bg-[#085983] text-white"
                    : "bg-white border border-[#085983]/10"
                )}
              >
                <div className="space-y-2">
                  <div
                    className={cn(
                      "text-xs font-medium font-[family-name:var(--font-geist-sans)]",
                      message.role === "user"
                        ? "text-white/80"
                        : "text-[#085983]/60"
                    )}
                  >
                    {message.role === "user" ? "You" : "AI Health Coach"}
                  </div>
                  <div
                    className={cn(
                      message.role === "user"
                        ? "text-sm font-[family-name:var(--font-geist-sans)] leading-relaxed text-white"
                        : ""
                    )}
                  >
                    {message.parts.map((part, partIndex) => {
                      if (part.type === "text") {
                        // Use markdown parser for assistant messages, plain text for user messages
                        if (message.role === "assistant") {
                          return (
                            <MarkdownParser
                              key={`${message.id}-part-${partIndex}`}
                              content={part.text || ""}
                              className="prose-sm"
                            />
                          );
                        } else {
                          return (
                            <span key={`${message.id}-part-${partIndex}`}>
                              {part.text}
                            </span>
                          );
                        }
                      }
                      return null;
                    })}
                  </div>
                </div>
              </Card>
            </div>
          ))}

        {/* Status Indicator */}
        {status !== "ready" && (
          <div className="flex gap-3 max-w-4xl mr-auto">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#085983]/10 text-[#085983] flex items-center justify-center">
              <Brain className="h-4 w-4" />
            </div>
            <Card className="p-4 rounded-2xl shadow-sm border border-[#085983]/10 bg-white">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
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
                <span className="text-sm text-[#085983]/70 font-[family-name:var(--font-geist-sans)]">
                  {status === "streaming" && "AI is analyzing..."}
                  {status === "submitted" && "Processing your request..."}
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
