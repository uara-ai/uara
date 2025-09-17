"use client";

import { Send, Plus, Mic, Paperclip, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconHeart, IconMoon, IconActivity } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  status: "ready" | "streaming" | "submitted" | "error";
  whoopData?: {
    recovery?: any[];
    sleep?: any[];
    strain?: any[];
    workout?: any[];
  };
  isLoadingWhoopData?: boolean;
  className?: string;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  status,
  whoopData,
  isLoadingWhoopData,
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

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

    const recentData = data.slice(0, 14); // Get last 14 days

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

  const quickActions = [
    {
      icon: <IconHeart className="h-4 w-4" />,
      label: "Recovery Analysis",
      prompt: generateWhoopPrompt("recovery"),
    },
    {
      icon: <IconMoon className="h-4 w-4" />,
      label: "Sleep Analysis",
      prompt: generateWhoopPrompt("sleep"),
    },
    {
      icon: <IconActivity className="h-4 w-4" />,
      label: "Strain Analysis",
      prompt: generateWhoopPrompt("strain"),
    },
    {
      icon: <BarChart className="h-4 w-4" />,
      label: "Workout Analysis",
      prompt: generateWhoopPrompt("workout"),
    },
  ];

  return (
    <div
      className={cn(
        "border-t border-[#085983]/10 bg-white p-4 max-w-4xl w-full mx-auto",
        className
      )}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        {/* Input Area */}
        <div
          className={cn(
            "relative rounded-2xl border transition-all duration-200",
            isFocused
              ? "border-[#085983] shadow-sm ring-2 ring-[#085983]/10"
              : "border-[#085983]/20 hover:border-[#085983]/40"
          )}
        >
          {/* Attachment Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-3 top-3 p-1.5 hover:bg-[#085983]/10 text-[#085983]/60 hover:text-[#085983] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {isLoadingWhoopData ? (
                // Show loading skeletons
                <>
                  {[...Array(4)].map((_, index) => (
                    <DropdownMenuItem
                      key={`skeleton-${index}`}
                      disabled
                      className="flex items-center gap-2 cursor-not-allowed"
                    >
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-24" />
                    </DropdownMenuItem>
                  ))}
                </>
              ) : (
                // Show actual quick actions
                quickActions.map((action, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => action.prompt && setInput(action.prompt)}
                    className="flex items-center gap-2"
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={status !== "ready" || isLoadingWhoopData}
            placeholder={
              isLoadingWhoopData
                ? "Loading your health data..."
                : "Ask about your health data, recovery, sleep, or longevity tips..."
            }
            className="min-h-[56px] max-h-32 pl-12 pr-24 py-4 border-0 resize-none focus-visible:ring-0 font-[family-name:var(--font-geist-sans)] text-sm placeholder:text-[#085983]/50 bg-transparent"
            rows={1}
          />

          {/* Action Buttons */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button
              type="submit"
              disabled={
                status !== "ready" || !input.trim() || isLoadingWhoopData
              }
              size="sm"
              className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
                input.trim() && status === "ready" && !isLoadingWhoopData
                  ? "bg-[#085983] hover:bg-[#085983]/90 text-white shadow-sm"
                  : "bg-[#085983]/10 text-[#085983]/40 cursor-not-allowed"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="flex items-center justify-between text-xs text-[#085983]/50 font-[family-name:var(--font-geist-sans)]">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span
            className={cn(
              "transition-opacity",
              input.length > 500 ? "opacity-100" : "opacity-0"
            )}
          >
            {input.length}/1000
          </span>
        </div>
      </form>
    </div>
  );
}

// Cursor rules applied correctly.
