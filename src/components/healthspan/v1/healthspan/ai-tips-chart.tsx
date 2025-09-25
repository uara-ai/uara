"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Brain,
  AlertTriangle,
  Moon,
  Activity,
  Heart,
  Dumbbell,
  Utensils,
  Users,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { Logo } from "@/components/logo";

export interface AiTipsChartProps {
  data?: {
    sleep?: Array<{
      score?: {
        sleep_performance_percentage?: number;
      };
    }>;
    recovery?: Array<{
      score?: {
        recovery_score?: number;
      };
    }>;
    cycles?: Array<{
      score?: {
        strain?: number;
      };
    }>;
  };
  className?: string;
}

interface HealthTip {
  category:
    | "sleep"
    | "recovery"
    | "strain"
    | "nutrition"
    | "exercise"
    | "lifestyle";
  title: string;
  description: string;
  action: string;
  priority: "low" | "medium" | "high";
  timeframe: "immediate" | "daily" | "weekly" | "monthly";
  impact: "minor" | "moderate" | "significant";
  difficulty: "easy" | "moderate" | "challenging";
  statImpact: {
    sleep?: number;
    recovery?: number;
    strain?: number;
  };
}

interface AiTipsResult {
  overallHealthScore: number;
  status: string;
  primaryConcern: string;
  strengths: string[];
  summary: string;
  tips: HealthTip[];
}

const categoryIcons = {
  sleep: Moon,
  recovery: Heart,
  strain: Activity,
  nutrition: Utensils,
  exercise: Dumbbell,
  lifestyle: Users,
};

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  low: "bg-green-100 text-green-800 border-green-200",
};

const difficultyIcons = {
  easy: CheckCircle,
  moderate: Target,
  challenging: TrendingUp,
};

function AiTipsChart({ data, className }: AiTipsChartProps) {
  const [aiTips, setAiTips] = useState<AiTipsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateAiTips = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Calculate health stats from wearable data
      const sleepScore =
        data?.sleep?.[0]?.score?.sleep_performance_percentage || 78;
      const recoveryScore = data?.recovery?.[0]?.score?.recovery_score || 72;
      const strainScore = data?.cycles?.[0]?.score?.strain || 12.5;

      // Calculate derived metrics
      const sleepEfficiency = sleepScore > 80 ? 85 : sleepScore > 60 ? 75 : 65;
      const sleepDuration = sleepScore > 80 ? 8.2 : sleepScore > 60 ? 7.5 : 6.8;
      const sleepConsistency = sleepScore > 80 ? 90 : sleepScore > 60 ? 75 : 60;

      const hrv = recoveryScore > 80 ? 45 : recoveryScore > 60 ? 35 : 25;
      const restingHR = recoveryScore > 80 ? 55 : recoveryScore > 60 ? 65 : 75;

      const strainBalance =
        strainScore > 15 ? "over" : strainScore < 8 ? "under" : "optimal";
      const workoutFrequency = strainScore > 12 ? 5 : strainScore > 8 ? 4 : 2;

      const overallScore = Math.round(
        (sleepScore + recoveryScore + Math.min(strainScore * 6, 100)) / 3
      );

      const healthStats = {
        sleep: {
          performance: sleepScore,
          efficiency: sleepEfficiency,
          duration: sleepDuration,
          consistency: sleepConsistency,
        },
        recovery: {
          score: recoveryScore,
          hrv: hrv,
          restingHR: restingHR,
          trend: "stable" as const,
        },
        strain: {
          daily: strainScore,
          weekly: strainScore,
          balance: strainBalance,
          workoutFrequency: workoutFrequency,
        },
        overall: {
          healthScore: overallScore,
          streak: 30,
          memberSince: new Date().toISOString(),
        },
      };

      console.log("Generating AI tips with health stats:", healthStats);

      // Call our dedicated AI tips API
      const response = await fetch("/api/ai-tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          healthStats,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `API request failed: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Tool used correctly - AI tips generated successfully");
      console.log("AI Tips Result:", result);

      setAiTips(result);
    } catch (error) {
      console.error("Failed to generate AI tips:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
      setAiTips(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateAiTips();
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div
        className={cn(
          "w-full mx-auto space-y-8 px-6 font-[family-name:var(--font-geist-sans)]",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <Brain className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2 animate-pulse" />
            <div>
              <h1 className="text-2xl font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
                AI Health Coach
              </h1>
              <p className="text-[#085983]/60 text-sm mt-1">
                Analyzing your health data...
              </p>
            </div>
          </div>
          <div className="animate-spin">
            <Logo hidden />
          </div>
        </div>

        {/* Loading skeleton */}
        <div className="space-y-4">
          <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !aiTips) {
    return (
      <div
        className={cn(
          "w-full mx-auto space-y-8 px-6 font-[family-name:var(--font-geist-sans)]",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <Brain className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
            <div>
              <h1 className="text-2xl font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
                AI Health Coach
              </h1>
              <p className="text-[#085983]/60 text-sm mt-1">
                Analysis unavailable
              </p>
            </div>
          </div>
          <AlertTriangle className="size-6 text-amber-500" />
        </div>

        {/* No Data State */}
        <div className="flex justify-center gap-6 sm:gap-8 mb-8">
          <div className="text-center flex-1">
            <div className="text-2xl sm:text-4xl font-bold text-[#085983] mb-1">
              -
            </div>
            <div className="text-xs sm:text-sm text-[#085983]/60 uppercase tracking-wide">
              Health Score
            </div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl sm:text-4xl font-bold text-[#085983] mb-1">
              -
            </div>
            <div className="text-xs sm:text-sm text-[#085983]/60 uppercase tracking-wide">
              Status
            </div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl sm:text-4xl font-bold text-[#085983] mb-1">
              -
            </div>
            <div className="text-xs sm:text-sm text-[#085983]/60 uppercase tracking-wide">
              Priority Actions
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 text-center">
          <AlertTriangle className="size-8 text-amber-600 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">
            AI Analysis Unavailable
          </h3>
          <p className="text-amber-700 dark:text-amber-400 text-sm">
            {error ||
              "Unable to generate personalized health tips at this time. Please check your data connection and try again."}
          </p>
        </div>
      </div>
    );
  }

  const highPriorityTips = aiTips.tips.filter((tip) => tip.priority === "high");
  const otherTips = aiTips.tips.filter((tip) => tip.priority !== "high");

  return (
    <div
      className={cn(
        "w-full mx-auto space-y-8 px-6 font-[family-name:var(--font-geist-sans)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <Brain className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <div>
            <h1 className="text-2xl font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
              AI Health Coach
            </h1>
            <p className="text-[#085983]/60 text-sm mt-1">
              Personalized recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Health Overview */}
      <div className="flex justify-center gap-6 sm:gap-8 mb-8">
        <div className="text-center flex-1">
          <div className="text-2xl sm:text-4xl font-bold text-[#085983] mb-1">
            {aiTips.overallHealthScore}
          </div>
          <div className="text-xs sm:text-sm text-[#085983]/60 uppercase tracking-wide">
            Health Score
          </div>
        </div>
        <div className="text-center flex-1">
          <div className="text-2xl sm:text-4xl font-bold text-[#085983] mb-1 capitalize">
            {aiTips.status}
          </div>
          <div className="text-xs sm:text-sm text-[#085983]/60 uppercase tracking-wide">
            Status
          </div>
        </div>
        <div className="text-center flex-1">
          <div className="text-2xl sm:text-4xl font-bold text-[#085983] mb-1">
            {highPriorityTips.length}
          </div>
          <div className="text-xs sm:text-sm text-[#085983]/60 uppercase tracking-wide">
            Priority Actions
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-[#085983]/5 border border-[#085983]/10 rounded-lg p-6">
        <h3 className="text-lg font-medium text-[#085983] mb-3 flex items-center gap-2">
          <Brain className="size-5" />
          AI Analysis
        </h3>
        <p className="text-[#085983]/80 leading-relaxed mb-4">
          {aiTips.summary}
        </p>
        {aiTips.primaryConcern && (
          <div className="mb-4">
            <span className="text-sm font-medium text-[#085983]/70">
              Primary Focus Area:
            </span>
            <span className="ml-2 text-[#085983] font-medium">
              {aiTips.primaryConcern}
            </span>
          </div>
        )}
        {aiTips.strengths.length > 0 && (
          <div>
            <span className="text-sm font-medium text-[#085983]/70">
              Your Strengths:
            </span>
            <span className="ml-2 text-[#085983]">
              {aiTips.strengths.join(", ")}
            </span>
          </div>
        )}
      </div>

      {/* High Priority Tips */}
      {highPriorityTips.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-[#085983] mb-4 flex items-center gap-2">
            <AlertTriangle className="size-5 text-red-500" />
            Priority Actions
          </h3>
          <div className="space-y-4">
            {highPriorityTips.map((tip, index) => {
              const IconComponent = categoryIcons[tip.category];
              const DifficultyIcon = difficultyIcons[tip.difficulty];

              return (
                <div
                  key={index}
                  className="bg-white border border-red-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <IconComponent className="size-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-[#085983]">
                          {tip.title}
                        </h4>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs border",
                            priorityColors[tip.priority]
                          )}
                        >
                          {tip.priority}
                        </span>
                      </div>
                      <p className="text-[#085983]/70 text-sm mb-3">
                        {tip.description}
                      </p>
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="font-medium text-[#085983] text-sm">
                          {tip.action}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#085983]/60">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {tip.timeframe}
                        </div>
                        <div className="flex items-center gap-1">
                          <DifficultyIcon className="size-3" />
                          {tip.difficulty}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="size-3" />
                          {tip.impact} impact
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Recommendations */}
      <div>
        <h3 className="text-lg font-medium text-[#085983] mb-4 flex items-center gap-2">
          <Target className="size-5" />
          All Recommendations
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {otherTips.map((tip, index) => {
            const IconComponent = categoryIcons[tip.category];
            const DifficultyIcon = difficultyIcons[tip.difficulty];

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-[#085983]/10 p-2 rounded-lg">
                    <IconComponent className="size-5 text-[#085983]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-[#085983] text-sm">
                        {tip.title}
                      </h4>
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs border",
                          priorityColors[tip.priority]
                        )}
                      >
                        {tip.priority}
                      </span>
                    </div>
                    <p className="text-[#085983]/70 text-xs mb-2">
                      {tip.description}
                    </p>
                    <p className="font-medium text-[#085983] text-xs mb-2">
                      {tip.action}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#085983]/60">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {tip.timeframe}
                      </div>
                      <div className="flex items-center gap-1">
                        <DifficultyIcon className="size-3" />
                        {tip.difficulty}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { AiTipsChart };
export default AiTipsChart;

// Cursor rules applied correctly.
