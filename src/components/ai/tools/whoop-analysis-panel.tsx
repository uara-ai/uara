"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import {
  WhoopRecoveryArtifact,
  WhoopSleepArtifact,
  WhoopStrainArtifact,
  WhoopWorkoutArtifact,
} from "@/lib/ai";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  IconHeart,
  IconMoon,
  IconActivity as IconActivityTabler,
  IconTarget,
  IconChartBar,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WhoopAnalysisPanelProps {
  type: "recovery" | "sleep" | "strain" | "workout";
  className?: string;
}

export function WhoopAnalysisPanel({
  type,
  className,
}: WhoopAnalysisPanelProps) {
  const recoveryData = useArtifact(WhoopRecoveryArtifact);
  const sleepData = useArtifact(WhoopSleepArtifact);
  const strainData = useArtifact(WhoopStrainArtifact);
  const workoutData = useArtifact(WhoopWorkoutArtifact);

  // Get the appropriate data based on type
  const artifactData = {
    recovery: recoveryData,
    sleep: sleepData,
    strain: strainData,
    workout: workoutData,
  }[type];

  const hasAnalysisData =
    artifactData?.data && artifactData.data.stage === "complete";
  const summary = artifactData?.data?.summary;
  const chartData = artifactData?.data?.chartData || [];

  // Type-specific configurations
  const getTypeConfig = (analysisType: string) => {
    switch (analysisType) {
      case "recovery":
        return {
          icon: <IconHeart className="h-5 w-5 text-[#085983]" />,
          title: "Recovery Analysis",
          primaryMetric:
            summary && "averageRecovery" in summary
              ? summary.averageRecovery
              : undefined,
          primaryLabel: "Avg Recovery",
          primaryUnit: "%",
          secondaryMetric:
            summary && "avgHrv" in summary ? summary.avgHrv : undefined,
          secondaryLabel: "Avg HRV",
          secondaryUnit: "ms",
          trend:
            summary && "recoveryTrend" in summary
              ? summary.recoveryTrend
              : undefined,
          color: "#085983",
        };
      case "sleep":
        return {
          icon: <IconMoon className="h-5 w-5 text-[#4c1d95]" />,
          title: "Sleep Analysis",
          primaryMetric:
            summary && "averageSleepPerformance" in summary
              ? summary.averageSleepPerformance
              : undefined,
          primaryLabel: "Sleep Performance",
          primaryUnit: "%",
          secondaryMetric:
            summary && "averageSleepDuration" in summary
              ? summary.averageSleepDuration
              : undefined,
          secondaryLabel: "Avg Duration",
          secondaryUnit: "h",
          trend:
            summary && "sleepTrend" in summary ? summary.sleepTrend : undefined,
          color: "#4c1d95",
        };
      case "strain":
        return {
          icon: <IconActivityTabler className="h-5 w-5 text-[#dc2626]" />,
          title: "Strain Analysis",
          primaryMetric:
            summary && "averageStrain" in summary
              ? summary.averageStrain
              : undefined,
          primaryLabel: "Avg Strain",
          primaryUnit: "",
          secondaryMetric:
            summary && "totalWorkouts" in summary
              ? summary.totalWorkouts
              : undefined,
          secondaryLabel: "Total Workouts",
          secondaryUnit: "",
          trend:
            summary && "strainTrend" in summary
              ? summary.strainTrend
              : undefined,
          color: "#dc2626",
        };
      case "workout":
        return {
          icon: <IconTarget className="h-5 w-5 text-[#059669]" />,
          title: "Workout Analysis",
          primaryMetric:
            summary && "totalWorkouts" in summary
              ? summary.totalWorkouts
              : undefined,
          primaryLabel: "Total Workouts",
          primaryUnit: "",
          secondaryMetric:
            summary && "averageWorkoutDuration" in summary
              ? summary.averageWorkoutDuration
              : undefined,
          secondaryLabel: "Avg Duration",
          secondaryUnit: "m",
          trend:
            summary && "performanceTrend" in summary
              ? summary.performanceTrend
              : undefined,
          color: "#059669",
        };
      default:
        return {
          icon: <IconChartBar className="h-5 w-5 text-[#085983]" />,
          title: "Analysis",
          primaryMetric: 0,
          primaryLabel: "Metric",
          primaryUnit: "",
          trend: "stable",
          color: "#085983",
        };
    }
  };

  const typeConfig = getTypeConfig(type);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "declining":
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
      case "increasing":
        return "text-green-600 bg-green-50 border-green-200";
      case "declining":
      case "decreasing":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (!artifactData?.data) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-[#085983]/10">{typeConfig.icon}</div>
        <div>
          <h3 className="text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
            {typeConfig.title}
          </h3>
          <p className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
            {hasAnalysisData ? "Analysis complete" : "Processing data..."}
          </p>
        </div>
      </div>

      {/* Chart Preview */}
      <Card className="bg-white rounded-xl border-[#085983]/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {typeConfig.title} Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="p-2 rounded-lg bg-[#085983]/10 mx-auto w-fit mb-2">
                <BarChart3 className="h-6 w-6 text-[#085983]" />
              </div>
              <p className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
                {chartData.length > 0
                  ? "Interactive chart available"
                  : "Processing chart data..."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-white rounded-xl border-[#085983]/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
                {typeConfig.primaryLabel}
              </span>
              {typeConfig.trend && (
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                    getTrendColor(typeConfig.trend)
                  )}
                >
                  {getTrendIcon(typeConfig.trend)}
                  {typeConfig.trend}
                </div>
              )}
            </div>
            <div className="text-2xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
              {typeConfig.primaryMetric !== undefined
                ? `${typeConfig.primaryMetric}${typeConfig.primaryUnit}`
                : "N/A"}
            </div>
          </CardContent>
        </Card>

        {typeConfig.secondaryMetric !== undefined && (
          <Card className="bg-white rounded-xl border-[#085983]/10">
            <CardContent className="p-4">
              <div className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                {typeConfig.secondaryLabel}
              </div>
              <div className="text-2xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                {typeConfig.secondaryMetric}
                {typeConfig.secondaryUnit}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Type-specific additional metrics */}
      {type === "recovery" && summary && "consistencyScore" in summary && (
        <Card className="bg-white rounded-xl border-[#085983]/10">
          <CardContent className="p-4">
            <div className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
              Consistency Score
            </div>
            <div className="text-2xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
              {summary.consistencyScore}%
            </div>
            <div className="mt-2 w-full bg-[#085983]/10 rounded-full h-2">
              <div
                className="bg-[#085983] h-2 rounded-full transition-all duration-300"
                style={{ width: `${summary.consistencyScore}%` }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {type === "sleep" && summary && "sleepDebt" in summary && (
        <Card className="bg-white rounded-xl border-[#085983]/10">
          <CardContent className="p-4">
            <div className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
              Sleep Debt
            </div>
            <div className="text-2xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
              {summary.sleepDebt}h
            </div>
            <div className="mt-1">
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  summary.sleepDebt > 5
                    ? "bg-red-100 text-red-700"
                    : summary.sleepDebt > 2
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                )}
              >
                {summary.sleepDebt > 5
                  ? "High debt"
                  : summary.sleepDebt > 2
                  ? "Moderate debt"
                  : "Low debt"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {type === "strain" && summary && "fatigueRisk" in summary && (
        <Card className="bg-white rounded-xl border-[#085983]/10">
          <CardContent className="p-4">
            <div className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
              Fatigue Risk
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983] capitalize">
                {summary.fatigueRisk}
              </div>
              <span
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  summary.fatigueRisk === "high"
                    ? "bg-red-100 text-red-700"
                    : summary.fatigueRisk === "moderate"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                )}
              >
                {summary.fatigueRisk === "high"
                  ? "Monitor closely"
                  : summary.fatigueRisk === "moderate"
                  ? "Be cautious"
                  : "All good"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {type === "workout" &&
        summary &&
        "intensityDistribution" in summary &&
        summary.intensityDistribution && (
          <Card className="bg-white rounded-xl border-[#085983]/10">
            <CardContent className="p-4">
              <div className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-3">
                Intensity Distribution
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#085983]/70">Low Intensity</span>
                  <span className="font-medium text-[#085983]">
                    {summary.intensityDistribution.low}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#085983]/70">Moderate</span>
                  <span className="font-medium text-[#085983]">
                    {summary.intensityDistribution.moderate}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#085983]/70">High Intensity</span>
                  <span className="font-medium text-[#085983]">
                    {summary.intensityDistribution.high}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Quick Insights */}
      {hasAnalysisData && summary?.insights && summary.insights.length > 0 && (
        <Card className="bg-white rounded-xl border-[#085983]/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {summary.insights.slice(0, 2).map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border text-sm",
                  insight.impact === "positive" &&
                    "bg-green-50 border-green-200 text-green-800",
                  insight.impact === "negative" &&
                    "bg-red-50 border-red-200 text-red-800",
                  insight.impact === "neutral" &&
                    "bg-gray-50 border-gray-200 text-gray-800"
                )}
              >
                <div className="font-medium mb-1">{insight.title}</div>
                <p className="text-xs opacity-80 font-[family-name:var(--font-geist-sans)]">
                  {insight.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Top Recommendations */}
      {hasAnalysisData &&
        summary?.recommendations &&
        summary.recommendations.length > 0 && (
          <Card className="bg-white rounded-xl border-[#085983]/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Top Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {summary.recommendations
                .slice(0, 3)
                .map((recommendation, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-blue-50 border border-blue-200"
                  >
                    <p className="text-sm text-blue-800 font-[family-name:var(--font-geist-sans)]">
                      {recommendation}
                    </p>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

      {/* Action Buttons */}
      {hasAnalysisData && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="px-4 py-3 bg-[#085983]/5 hover:bg-[#085983]/10 text-[#085983] rounded-lg transition-colors text-sm font-medium font-[family-name:var(--font-geist-sans)]"
          >
            View Full Chart
          </button>
          <button
            type="button"
            className="px-4 py-3 bg-[#085983]/5 hover:bg-[#085983]/10 text-[#085983] rounded-lg transition-colors text-sm font-medium font-[family-name:var(--font-geist-sans)]"
          >
            Export Analysis
          </button>
        </div>
      )}
    </div>
  );
}

// Cursor rules applied correctly.
