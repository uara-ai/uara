"use client";

import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconSettings,
  IconShare,
  IconDownload,
  IconPin,
  IconChartBar,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BurnRateAnalysisPanel } from "./tools/burn-rate.analysis-panel";
import { BurnRateLoading } from "./tools/burn-rate-loading";
import { WhoopAnalysisPanel } from "./tools/whoop-analysis-panel";
import { WhoopAnalysisLoading } from "./tools/whoop-analysis-loading";
import {
  WhoopRecoveryArtifact,
  WhoopSleepArtifact,
  WhoopStrainArtifact,
  WhoopWorkoutArtifact,
} from "@/lib/ai";
import { useArtifact } from "@ai-sdk-tools/artifacts/client";

interface ChatAnalysisPanelProps {
  hasAnalysisData: boolean;
  onOpenBurnRateChart: () => void;
  onOpenWhoopChart: (type: "recovery" | "sleep" | "strain" | "workout") => void;
  className?: string;
}

export function ChatAnalysisPanel({
  hasAnalysisData,
  onOpenBurnRateChart,
  onOpenWhoopChart,
  className,
}: ChatAnalysisPanelProps) {
  // Check for WHOOP analysis data
  const whoopRecoveryData = useArtifact(WhoopRecoveryArtifact);
  const whoopSleepData = useArtifact(WhoopSleepArtifact);
  const whoopStrainData = useArtifact(WhoopStrainArtifact);
  const whoopWorkoutData = useArtifact(WhoopWorkoutArtifact);

  // Determine which analysis to show
  const whoopAnalysisType = whoopRecoveryData?.data
    ? "recovery"
    : whoopSleepData?.data
    ? "sleep"
    : whoopStrainData?.data
    ? "strain"
    : whoopWorkoutData?.data
    ? "workout"
    : null;
  // Get real health insights from WHOOP artifacts
  const getHealthInsights = () => {
    const insights = [];

    // Recovery insights
    if (whoopRecoveryData?.data?.summary) {
      const summary = whoopRecoveryData.data.summary;
      if ("averageRecovery" in summary) {
        insights.push({
          metric: "Recovery Score",
          value: `${summary.averageRecovery}%`,
          trend:
            summary.recoveryTrend === "improving"
              ? ("up" as const)
              : summary.recoveryTrend === "declining"
              ? ("down" as const)
              : ("stable" as const),
          description: `Trend: ${summary.recoveryTrend}`,
        });
      }
      if ("avgHrv" in summary) {
        insights.push({
          metric: "HRV Average",
          value: `${summary.avgHrv}ms`,
          trend: "stable" as const,
          description: "Heart rate variability",
        });
      }
    }

    // Sleep insights
    if (whoopSleepData?.data?.summary) {
      const summary = whoopSleepData.data.summary;
      if ("averageSleepPerformance" in summary) {
        insights.push({
          metric: "Sleep Performance",
          value: `${summary.averageSleepPerformance}%`,
          trend:
            summary.sleepTrend === "improving"
              ? ("up" as const)
              : summary.sleepTrend === "declining"
              ? ("down" as const)
              : ("stable" as const),
          description: `Trend: ${summary.sleepTrend}`,
        });
      }
    }

    // Strain insights
    if (whoopStrainData?.data?.summary) {
      const summary = whoopStrainData.data.summary;
      if ("averageStrain" in summary) {
        insights.push({
          metric: "Daily Strain",
          value: `${summary.averageStrain}`,
          trend:
            summary.strainTrend === "increasing"
              ? ("up" as const)
              : summary.strainTrend === "decreasing"
              ? ("down" as const)
              : ("stable" as const),
          description: `Balance: ${summary.strainBalance}`,
        });
      }
    }

    // Workout insights
    if (whoopWorkoutData?.data?.summary) {
      const summary = whoopWorkoutData.data.summary;
      if ("totalWorkouts" in summary) {
        insights.push({
          metric: "Weekly Workouts",
          value: `${Math.round(summary.workoutFrequency || 0)}`,
          trend:
            summary.performanceTrend === "improving"
              ? ("up" as const)
              : summary.performanceTrend === "declining"
              ? ("down" as const)
              : ("stable" as const),
          description: `${summary.totalWorkouts} total workouts`,
        });
      }
    }

    return insights;
  };

  const healthInsights = getHealthInsights();

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3" />;
      case "down":
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-green-600 bg-green-50 border-green-200";
      case "down":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-[#085983] bg-[#085983]/5 border-[#085983]/20";
    }
  };

  return (
    <div
      className={cn(
        "w-full lg:w-1/2 border-l border-[#085983]/10 flex flex-col h-full bg-gray-50/50",
        className
      )}
    >
      {/* Analysis Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#085983]/10 bg-white">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#085983]/10">
            <IconChartBar className="h-4 w-4 text-[#085983]" />
          </div>
          <div>
            <h2 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
              Health Analysis
            </h2>
            <p className="text-xs text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
              Real-time insights from your data
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-[#085983]/5 rounded-lg transition-colors text-[#085983]"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onOpenBurnRateChart}>
              <IconChartBar className="mr-2 h-4 w-4" />
              View Full Chart
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPin className="mr-2 h-4 w-4" />
              Pin Analysis
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconDownload className="mr-2 h-4 w-4" />
              Export Report
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconShare className="mr-2 h-4 w-4" />
              Share Insights
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconSettings className="mr-2 h-4 w-4" />
              Analysis Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Analysis Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Show WHOOP analysis if available, otherwise burn rate */}
        {whoopAnalysisType ? (
          <WhoopAnalysisPanel
            type={
              whoopAnalysisType as "recovery" | "sleep" | "strain" | "workout"
            }
            onOpenChart={onOpenWhoopChart}
          />
        ) : hasAnalysisData ? (
          <>
            {/* Use existing burn rate analysis panel */}
            <BurnRateAnalysisPanel />

            {/* Health Insights from WHOOP data */}
            {healthInsights.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#085983] font-[family-name:var(--font-geist-sans)]">
                  Key Health Metrics
                </h3>
                {healthInsights.map((insight, index) => (
                  <Card
                    key={index}
                    className="bg-white rounded-xl border-[#085983]/10"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#085983]/80 font-[family-name:var(--font-geist-sans)]">
                          {insight.metric}
                        </span>
                        <div
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                            getTrendColor(insight.trend)
                          )}
                        >
                          {getTrendIcon(insight.trend)}
                          <span className="capitalize">{insight.trend}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                          {insight.value}
                        </div>
                        <p className="text-xs text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
                          {insight.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Real Recommendations from WHOOP Analysis */}
            {(() => {
              // Collect recommendations from all WHOOP analyses
              const allRecommendations = [];

              if (whoopRecoveryData?.data?.summary?.recommendations) {
                allRecommendations.push(
                  ...whoopRecoveryData.data.summary.recommendations.slice(0, 2)
                );
              }
              if (whoopSleepData?.data?.summary?.recommendations) {
                allRecommendations.push(
                  ...whoopSleepData.data.summary.recommendations.slice(0, 2)
                );
              }
              if (whoopStrainData?.data?.summary?.recommendations) {
                allRecommendations.push(
                  ...whoopStrainData.data.summary.recommendations.slice(0, 2)
                );
              }
              if (whoopWorkoutData?.data?.summary?.recommendations) {
                allRecommendations.push(
                  ...whoopWorkoutData.data.summary.recommendations.slice(0, 2)
                );
              }

              const topRecommendations = allRecommendations.slice(0, 3);

              return topRecommendations.length > 0 ? (
                <Card className="bg-white rounded-xl border-[#085983]/10">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-[#085983] font-[family-name:var(--font-geist-sans)]">
                      AI Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {topRecommendations.map((recommendation, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-[#085983]/5 border border-[#085983]/10"
                      >
                        <p className="text-sm text-[#085983] font-[family-name:var(--font-geist-sans)]">
                          {recommendation}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : null;
            })()}
          </>
        ) : (
          <BurnRateLoading />
        )}

        {/* Show WHOOP loading if WHOOP analysis is in progress */}
        {whoopAnalysisType && !hasAnalysisData && (
          <WhoopAnalysisLoading
            type={
              whoopAnalysisType as "recovery" | "sleep" | "strain" | "workout"
            }
          />
        )}
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
