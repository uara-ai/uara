"use client";

import { useArtifact } from "@ai-sdk-tools/artifacts/client";
import {
  AlertTriangle,
  CheckCircle,
  Minus,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { WhoopWorkoutArtifact } from "@/lib/ai";
import { IconTarget } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
} from "recharts";

interface WhoopWorkoutChartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhoopWorkoutChart({ isOpen, onClose }: WhoopWorkoutChartProps) {
  const [activeTab, setActiveTab] = useState<"chart" | "insights">("chart");

  // Get data directly from the artifact hook
  const workoutData = useArtifact(WhoopWorkoutArtifact);

  // Extract data with fallbacks
  const title = workoutData?.data?.title || "Workout Analysis";
  const stage = workoutData?.data?.stage || "loading";
  const progress = workoutData?.data?.progress || 0;
  const chartData = workoutData?.data?.chartData || [];
  const summary = workoutData?.data?.summary;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Convert milliseconds to minutes for display
  const msToMinutes = (ms: number) => {
    return Math.round(ms / 60000);
  };

  // Convert meters to kilometers for display
  const metersToKm = (meters: number) => {
    return (meters / 1000).toFixed(1);
  };

  // Get trend icon and color
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const chartConfig = {
    strain: {
      label: "Workout Strain",
      color: "#059669",
    },
    duration: {
      label: "Duration (min)",
      color: "#3b82f6",
    },
    averageHeartRate: {
      label: "Avg HR (bpm)",
      color: "#ef4444",
    },
    maxHeartRate: {
      label: "Max HR (bpm)",
      color: "#dc2626",
    },
    kilojoule: {
      label: "Energy (kJ)",
      color: "#f59e0b",
    },
    distanceMeters: {
      label: "Distance (km)",
      color: "#8b5cf6",
    },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#085983]/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#085983]/10">
              <IconTarget className="h-5 w-5 text-[#059669]" />
            </div>
            <div>
              <h2 className="text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
                {title}
              </h2>
              {stage === "complete" &&
                summary &&
                "performanceTrend" in summary && (
                  <div className="flex items-center space-x-2 mt-1">
                    {getTrendIcon(summary.performanceTrend)}
                    <span
                      className={`text-sm font-medium ${getTrendColor(
                        summary.performanceTrend
                      )}`}
                    >
                      {summary.performanceTrend}
                    </span>
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
                {chartData.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 border border-[#085983]/10 text-center">
                    <div className="p-4 rounded-lg bg-[#085983]/10 mx-auto w-fit mb-4">
                      <IconTarget className="h-8 w-8 text-[#059669]" />
                    </div>
                    <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-2 text-[#085983]">
                      No Workout Data Available
                    </h3>
                    <p className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
                      {stage === "complete"
                        ? "The analysis completed but no workout data was found."
                        : "Workout data will appear once the analysis is complete."}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Workout Strain Chart */}
                    <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                      <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                        Workout Strain Trend
                      </h3>
                      <ChartContainer config={chartConfig} className="h-80">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                labelFormatter={formatDate}
                              />
                            }
                          />
                          <Bar
                            dataKey="strain"
                            fill="#059669"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>

                    {/* Duration vs Strain */}
                    <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                      <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                        Duration vs Strain
                      </h3>
                      <ChartContainer config={chartConfig} className="h-64">
                        <ScatterChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="duration"
                            name="Duration"
                            type="number"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            dataKey="strain"
                            name="Strain"
                            tick={{ fontSize: 12 }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Scatter dataKey="strain" fill="#059669" />
                        </ScatterChart>
                      </ChartContainer>
                    </div>

                    {/* Heart Rate Trends */}
                    <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                      <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                        Heart Rate Trends
                      </h3>
                      <ChartContainer config={chartConfig} className="h-64">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={formatDate}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent
                                labelFormatter={formatDate}
                              />
                            }
                          />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Line
                            type="monotone"
                            dataKey="averageHeartRate"
                            stroke="#ef4444"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="maxHeartRate"
                            stroke="#dc2626"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>

                    {/* Energy & Distance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                        <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                          Energy Expenditure
                        </h3>
                        <ChartContainer config={chartConfig} className="h-64">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={formatDate}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  labelFormatter={formatDate}
                                />
                              }
                            />
                            <Bar
                              dataKey="kilojoule"
                              fill="#f59e0b"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ChartContainer>
                      </div>

                      <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                        <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                          Distance Covered
                        </h3>
                        <ChartContainer config={chartConfig} className="h-64">
                          <BarChart
                            data={chartData.filter(
                              (d) => d.distanceMeters && d.distanceMeters > 0
                            )}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tickFormatter={formatDate}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  labelFormatter={formatDate}
                                />
                              }
                            />
                            <Bar
                              dataKey="distanceMeters"
                              fill="#8b5cf6"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ChartContainer>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === "insights" && (
              <div className="space-y-6">
                {!summary ? (
                  <div className="bg-white rounded-xl p-8 border border-[#085983]/10 text-center">
                    <div className="p-4 rounded-lg bg-[#085983]/10 mx-auto w-fit mb-4">
                      <IconTarget className="h-8 w-8 text-[#059669]" />
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
                    {/* Key Metrics */}
                    {summary && "totalWorkouts" in summary && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      </div>
                    )}

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
