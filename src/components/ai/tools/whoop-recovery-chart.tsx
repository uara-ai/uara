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
import { WhoopRecoveryArtifact } from "@/lib/ai";
import { IconHeart } from "@tabler/icons-react";
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
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

interface WhoopRecoveryChartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhoopRecoveryChart({
  isOpen,
  onClose,
}: WhoopRecoveryChartProps) {
  const [activeTab, setActiveTab] = useState<"chart" | "insights">("chart");

  // Get data directly from the artifact hook
  const recoveryData = useArtifact(WhoopRecoveryArtifact);

  // Extract data with fallbacks
  const title = recoveryData?.data?.title || "Recovery Analysis";
  const stage = recoveryData?.data?.stage || "loading";
  const progress = recoveryData?.data?.progress || 0;
  const chartData = recoveryData?.data?.chartData || [];
  const summary = recoveryData?.data?.summary;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
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
    recoveryScore: {
      label: "Recovery Score",
      color: "#085983",
    },
    hrvRmssd: {
      label: "HRV (ms)",
      color: "#10b981",
    },
    restingHeartRate: {
      label: "RHR (bpm)",
      color: "#ef4444",
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
              <IconHeart className="h-5 w-5 text-[#085983]" />
            </div>
            <div>
              <h2 className="text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
                {title}
              </h2>
              {stage === "complete" &&
                summary &&
                "recoveryTrend" in summary && (
                  <div className="flex items-center space-x-2 mt-1">
                    {getTrendIcon(summary.recoveryTrend)}
                    <span
                      className={`text-sm font-medium ${getTrendColor(
                        summary.recoveryTrend
                      )}`}
                    >
                      {summary.recoveryTrend}
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
                      <IconHeart className="h-8 w-8 text-[#085983]" />
                    </div>
                    <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-2 text-[#085983]">
                      No Recovery Data Available
                    </h3>
                    <p className="text-sm text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
                      {stage === "complete"
                        ? "The analysis completed but no recovery data was found."
                        : "Recovery data will appear once the analysis is complete."}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Recovery Score Trend */}
                    <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                      <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                        Recovery Score Trend
                      </h3>
                      <ChartContainer config={chartConfig} className="h-80">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient
                              id="recoveryGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#085983"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#085983"
                                stopOpacity={0.05}
                              />
                            </linearGradient>
                          </defs>
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
                          <Area
                            type="monotone"
                            dataKey="recoveryScore"
                            stroke="#085983"
                            strokeWidth={2}
                            fill="url(#recoveryGradient)"
                          />
                        </AreaChart>
                      </ChartContainer>
                    </div>

                    {/* HRV and RHR Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                        <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                          HRV Trend
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
                            <Line
                              type="monotone"
                              dataKey="hrvRmssd"
                              stroke="#10b981"
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ChartContainer>
                      </div>

                      <div className="bg-white rounded-xl p-6 border border-[#085983]/10">
                        <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium mb-4 text-[#085983]">
                          Resting Heart Rate
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
                            <Line
                              type="monotone"
                              dataKey="restingHeartRate"
                              stroke="#ef4444"
                              strokeWidth={2}
                            />
                          </LineChart>
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
                      <IconHeart className="h-8 w-8 text-[#085983]" />
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
                    {summary && "averageRecovery" in summary && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
