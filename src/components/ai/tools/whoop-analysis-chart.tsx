"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import {
  WhoopRecoveryArtifact,
  WhoopSleepArtifact,
  WhoopStrainArtifact,
  WhoopWorkoutArtifact,
} from "@/lib/ai";
import {
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  TrendingUp,
  Minus,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  IconHeart,
  IconMoon,
  IconActivity,
  IconTarget,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface WhoopAnalysisChartProps {
  type: "recovery" | "sleep" | "strain" | "workout";
  isOpen: boolean;
  onClose: () => void;
}

export function WhoopAnalysisChart({
  type,
  isOpen,
  onClose,
}: WhoopAnalysisChartProps) {
  const [activeTab, setActiveTab] = useState<"chart" | "insights">("chart");

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

  const title =
    artifactData?.data?.title ||
    `${type.charAt(0).toUpperCase() + type.slice(1)} Analysis`;
  const stage = artifactData?.data?.stage || "loading";
  const progress = artifactData?.data?.progress || 0;
  const chartData = artifactData?.data?.chartData || [];
  const summary = artifactData?.data?.summary;

  // Debug log to see what data is available
  console.log(`WHOOP Chart Debug - Type: ${type}`, {
    hasArtifactData: !!artifactData,
    hasData: !!artifactData?.data,
    stage,
    chartDataLength: chartData.length,
    chartDataSample: chartData[0],
    hasSummary: !!summary,
  });

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get appropriate icon and color for type
  const getTypeConfig = (analysisType: string) => {
    switch (analysisType) {
      case "recovery":
        return {
          icon: <IconHeart className="h-5 w-5 text-[#085983]" />,
          color: "#085983",
          primaryMetric: "recoveryScore",
          primaryLabel: "Recovery Score",
        };
      case "sleep":
        return {
          icon: <IconMoon className="h-5 w-5 text-[#085983]" />,
          color: "#4c1d95",
          primaryMetric: "sleepPerformance",
          primaryLabel: "Sleep Performance",
        };
      case "strain":
        return {
          icon: <IconActivity className="h-5 w-5 text-[#085983]" />,
          color: "#dc2626",
          primaryMetric: "strain",
          primaryLabel: "Strain",
        };
      case "workout":
        return {
          icon: <IconTarget className="h-5 w-5 text-[#085983]" />,
          color: "#059669",
          primaryMetric: "strain",
          primaryLabel: "Workout Strain",
        };
      default:
        return {
          icon: <IconHeart className="h-5 w-5 text-[#085983]" />,
          color: "#085983",
          primaryMetric: "value",
          primaryLabel: "Value",
        };
    }
  };

  const typeConfig = getTypeConfig(type);

  // Get trend icon and color
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "declining":
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
      case "increasing":
        return "text-green-600";
      case "declining":
      case "decreasing":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#085983]/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#085983]/10">
              {typeConfig.icon}
            </div>
            <div>
              <h2 className="text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
                {title}
              </h2>
              {stage === "complete" && summary && (
                <div className="flex items-center space-x-2 mt-1">
                  {/* Show trend based on type */}
                  {type === "recovery" && "recoveryTrend" in summary && (
                    <>
                      {getTrendIcon(summary.recoveryTrend)}
                      <span
                        className={`text-sm font-medium ${getTrendColor(
                          summary.recoveryTrend
                        )}`}
                      >
                        {summary.recoveryTrend}
                      </span>
                    </>
                  )}
                  {type === "sleep" && "sleepTrend" in summary && (
                    <>
                      {getTrendIcon(summary.sleepTrend)}
                      <span
                        className={`text-sm font-medium ${getTrendColor(
                          summary.sleepTrend
                        )}`}
                      >
                        {summary.sleepTrend}
                      </span>
                    </>
                  )}
                  {type === "strain" && "strainTrend" in summary && (
                    <>
                      {getTrendIcon(summary.strainTrend)}
                      <span
                        className={`text-sm font-medium ${getTrendColor(
                          summary.strainTrend
                        )}`}
                      >
                        {summary.strainTrend}
                      </span>
                    </>
                  )}
                  {type === "workout" && "performanceTrend" in summary && (
                    <>
                      {getTrendIcon(summary.performanceTrend)}
                      <span
                        className={`text-sm font-medium ${getTrendColor(
                          summary.performanceTrend
                        )}`}
                      >
                        {summary.performanceTrend}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[#085983]/5 rounded-lg transition-colors text-[#085983]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {stage !== "complete" && (
          <div className="px-6 py-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#085983]/80 font-[family-name:var(--font-geist-sans)]">
                {stage === "loading" && "Initializing..."}
                {stage === "processing" && "Processing data..."}
                {stage === "analyzing" && "Analyzing trends..."}
              </span>
              <span className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="w-full bg-[#085983]/10 rounded-full h-2">
              <div
                className="bg-[#085983] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#085983]/10 bg-white">
            <button
              type="button"
              onClick={() => setActiveTab("chart")}
              className={cn(
                "px-6 py-3 text-sm font-medium font-[family-name:var(--font-geist-sans)] transition-colors",
                activeTab === "chart"
                  ? "text-[#085983] border-b-2 border-[#085983]"
                  : "text-[#085983]/60 hover:text-[#085983]/80"
              )}
            >
              Charts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("insights")}
              className={cn(
                "px-6 py-3 text-sm font-medium font-[family-name:var(--font-geist-sans)] transition-colors",
                activeTab === "insights"
                  ? "text-[#085983] border-b-2 border-[#085983]"
                  : "text-[#085983]/60 hover:text-[#085983]/80"
              )}
            >
              Insights
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50/30">
            {activeTab === "chart" && (
              <div className="space-y-6">
                {/* Show message if no chart data */}
                {chartData.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 border border-[#085983]/10 text-center">
                    <div className="p-4 rounded-lg bg-[#085983]/10 mx-auto w-fit mb-4">
                      {typeConfig.icon}
                    </div>
                    <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-2 text-[#085983]">
                      No Chart Data Available
                    </h3>
                    <p className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-4">
                      {stage === "complete"
                        ? "The analysis completed but no chart data was generated."
                        : "Chart data will appear once the analysis is complete."}
                    </p>
                    {stage !== "complete" && (
                      <div className="w-64 mx-auto">
                        <div className="w-full bg-[#085983]/10 rounded-full h-2 mb-2">
                          <div
                            className="bg-[#085983] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
                          {Math.round(progress * 100)}% complete
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Primary Chart */}
                    <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                      <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                        {typeConfig.primaryLabel} Trend
                      </h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          {type === "strain" || type === "workout" ? (
                            <BarChart data={chartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#085983"
                                strokeOpacity={0.1}
                              />
                              <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                tick={{ fontSize: 12, fill: "#085983" }}
                                axisLine={{
                                  stroke: "#085983",
                                  strokeOpacity: 0.2,
                                }}
                              />
                              <YAxis
                                tick={{ fontSize: 12, fill: "#085983" }}
                                axisLine={{
                                  stroke: "#085983",
                                  strokeOpacity: 0.2,
                                }}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "white",
                                  border: `1px solid #085983`,
                                  borderRadius: "8px",
                                  boxShadow:
                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                                labelFormatter={(date) => formatDate(date)}
                              />
                              <Legend />
                              <Bar
                                dataKey={typeConfig.primaryMetric}
                                fill={typeConfig.color}
                                name={typeConfig.primaryLabel}
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          ) : (
                            <AreaChart data={chartData}>
                              <defs>
                                <linearGradient
                                  id={`gradient-${type}`}
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop
                                    offset="5%"
                                    stopColor={typeConfig.color}
                                    stopOpacity={0.3}
                                  />
                                  <stop
                                    offset="95%"
                                    stopColor={typeConfig.color}
                                    stopOpacity={0.05}
                                  />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#085983"
                                strokeOpacity={0.1}
                              />
                              <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                tick={{ fontSize: 12, fill: "#085983" }}
                                axisLine={{
                                  stroke: "#085983",
                                  strokeOpacity: 0.2,
                                }}
                              />
                              <YAxis
                                tick={{ fontSize: 12, fill: "#085983" }}
                                axisLine={{
                                  stroke: "#085983",
                                  strokeOpacity: 0.2,
                                }}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "white",
                                  border: `1px solid #085983`,
                                  borderRadius: "8px",
                                  boxShadow:
                                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                }}
                                labelFormatter={(date) => formatDate(date)}
                              />
                              <Legend />
                              <Area
                                type="monotone"
                                dataKey={typeConfig.primaryMetric}
                                stroke={typeConfig.color}
                                strokeWidth={2}
                                fill={`url(#gradient-${type})`}
                                name={typeConfig.primaryLabel}
                              />
                            </AreaChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Secondary Charts based on type */}
                    {type === "recovery" && chartData.length > 0 && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                          <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                            HRV Trend
                          </h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#085983"
                                  strokeOpacity={0.1}
                                />
                                <XAxis
                                  dataKey="date"
                                  tickFormatter={formatDate}
                                  tick={{ fontSize: 12, fill: "#085983" }}
                                />
                                <YAxis
                                  tick={{ fontSize: 12, fill: "#085983" }}
                                />
                                <Tooltip
                                  labelFormatter={(date) => formatDate(date)}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="hrvRmssd"
                                  stroke="#10b981"
                                  strokeWidth={2}
                                  name="HRV (ms)"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                          <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                            Resting Heart Rate
                          </h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#085983"
                                  strokeOpacity={0.1}
                                />
                                <XAxis
                                  dataKey="date"
                                  tickFormatter={formatDate}
                                  tick={{ fontSize: 12, fill: "#085983" }}
                                />
                                <YAxis
                                  tick={{ fontSize: 12, fill: "#085983" }}
                                />
                                <Tooltip
                                  labelFormatter={(date) => formatDate(date)}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="restingHeartRate"
                                  stroke="#ef4444"
                                  strokeWidth={2}
                                  name="RHR (bpm)"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}

                    {type === "sleep" && chartData.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                        <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                          Sleep Duration vs Efficiency
                        </h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#085983"
                                strokeOpacity={0.1}
                              />
                              <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                tick={{ fontSize: 12, fill: "#085983" }}
                              />
                              <YAxis tick={{ fontSize: 12, fill: "#085983" }} />
                              <Tooltip
                                labelFormatter={(date) => formatDate(date)}
                                formatter={(value, name) => {
                                  if (name === "Duration (hrs)") {
                                    return [
                                      ((value as number) / 3600000).toFixed(1),
                                      name,
                                    ];
                                  }
                                  return [value, name];
                                }}
                              />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="sleepDuration"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                name="Duration (hrs)"
                                yAxisId="duration"
                              />
                              <Line
                                type="monotone"
                                dataKey="sleepEfficiency"
                                stroke="#06b6d4"
                                strokeWidth={2}
                                name="Efficiency (%)"
                                yAxisId="efficiency"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "insights" && (
              <div className="space-y-6">
                {!summary ? (
                  <div className="bg-white rounded-xl p-8 border border-[#085983]/10 text-center">
                    <div className="p-4 rounded-lg bg-[#085983]/10 mx-auto w-fit mb-4">
                      {typeConfig.icon}
                    </div>
                    <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-2 text-[#085983]">
                      No Insights Available
                    </h3>
                    <p className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
                      {stage === "complete"
                        ? "The analysis completed but no insights were generated."
                        : "Insights will appear once the analysis is complete."}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Render different metrics based on type */}
                      {type === "recovery" &&
                        summary &&
                        "averageRecovery" in summary && (
                          <>
                            <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                              <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                Average Recovery
                              </h4>
                              <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                                {summary.averageRecovery}%
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                              <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                Average HRV
                              </h4>
                              <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                                {summary.avgHrv} ms
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                              <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                Consistency Score
                              </h4>
                              <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                                {summary.consistencyScore}%
                              </p>
                            </div>
                          </>
                        )}

                      {type === "sleep" &&
                        summary &&
                        "averageSleepPerformance" in summary && (
                          <>
                            <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                              <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                Sleep Performance
                              </h4>
                              <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                                {summary.averageSleepPerformance}%
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                              <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                Sleep Duration
                              </h4>
                              <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                                {summary.averageSleepDuration}h
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                              <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                Sleep Debt
                              </h4>
                              <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                                {summary.sleepDebt}h
                              </p>
                            </div>
                          </>
                        )}

                      {type === "strain" &&
                        summary &&
                        "averageStrain" in summary && (
                          <>
                            <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                              <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                Average Strain
                              </h4>
                              <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                                {summary.averageStrain}
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                              <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                Total Workouts
                              </h4>
                              <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                                {summary.totalWorkouts}
                              </p>
                            </div>
                            <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                              <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                Fatigue Risk
                              </h4>
                              <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983] capitalize">
                                {summary.fatigueRisk}
                              </p>
                            </div>
                          </>
                        )}

                      {type === "workout" &&
                        summary &&
                        "totalWorkouts" in summary && (
                          <>
                            <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                              <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                Total Workouts
                              </h4>
                              <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                                {summary.totalWorkouts}
                              </p>
                            </div>
                            {"averageWorkoutDuration" in summary && (
                              <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                                <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                  Average Duration
                                </h4>
                                <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                                  {summary.averageWorkoutDuration}m
                                </p>
                              </div>
                            )}
                            {"workoutFrequency" in summary && (
                              <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                                <h4 className="text-sm font-medium text-[#085983]/60 font-[family-name:var(--font-geist-sans)] mb-2">
                                  Workout Frequency
                                </h4>
                                <p className="text-3xl font-[family-name:var(--font-instrument-serif)] font-normal text-[#085983]">
                                  {summary.workoutFrequency}/wk
                                </p>
                              </div>
                            )}
                          </>
                        )}
                    </div>

                    {/* Insights */}
                    {summary.insights && summary.insights.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                        <h4 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983] flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          Key Insights
                        </h4>
                        <div className="space-y-3">
                          {summary.insights.map((insight, index) => (
                            <div
                              key={index}
                              className={cn(
                                "p-4 rounded-lg border",
                                insight.impact === "positive" &&
                                  "bg-green-50 border-green-200",
                                insight.impact === "negative" &&
                                  "bg-red-50 border-red-200",
                                insight.impact === "neutral" &&
                                  "bg-gray-50 border-gray-200"
                              )}
                            >
                              <div className="font-medium text-sm mb-1 text-[#085983]">
                                {insight.title}
                              </div>
                              <p className="text-sm text-[#085983]/70 font-[family-name:var(--font-geist-sans)]">
                                {insight.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {summary.recommendations &&
                      summary.recommendations.length > 0 && (
                        <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                          <h4 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983] flex items-center">
                            <AlertTriangle className="h-5 w-5 text-blue-500 mr-2" />
                            Recommendations
                          </h4>
                          <div className="space-y-3">
                            {summary.recommendations.map(
                              (recommendation, index) => (
                                <div
                                  key={index}
                                  className="p-4 rounded-lg bg-blue-50 border border-blue-200"
                                >
                                  <p className="text-sm text-blue-800 font-[family-name:var(--font-geist-sans)]">
                                    {recommendation}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
