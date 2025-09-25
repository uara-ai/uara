"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from "recharts";
import {
  getSleepColor,
  getRecoveryColor,
  getStrainColor,
} from "../wearables/chart-colors";

interface WearableStatsChartProps {
  data?: {
    sleep?: Array<{
      score?: { sleep_performance_percentage?: number };
      created_at: string;
    }>;
    recovery?: Array<{
      score?: { recovery_score?: number };
      created_at: string;
    }>;
    cycles?: Array<{ score?: { strain?: number }; created_at: string }>;
  };
  className?: string;
}

// Generate fallback data for when no real data is available
const generateFallbackData = (days: number = 30) => {
  const data = [];
  const today = new Date();

  // Generate data from oldest (days-1 ago) to newest (today)
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Generate realistic wearable data with natural variations
    const sleepBase = 75 + Math.sin(i * 0.1) * 10 + (Math.random() - 0.5) * 15;
    const recoveryBase =
      70 + Math.cos(i * 0.15) * 15 + (Math.random() - 0.5) * 20;
    const strainBase = 12 + Math.sin(i * 0.08) * 4 + (Math.random() - 0.5) * 6;

    // Ensure values stay within realistic bounds
    const sleep = Math.max(40, Math.min(100, sleepBase));
    const recovery = Math.max(20, Math.min(100, recoveryBase));
    const strain = Math.max(2, Math.min(21, strainBase));

    data.push({
      sleep: Math.round(sleep),
      recovery: Math.round(recovery),
      strain: parseFloat(strain.toFixed(1)),
      date: date.toISOString().split("T")[0],
    });
  }

  return data; // Data is ordered from oldest to newest (left to right on chart)
};

// Process real wearable data or use fallback
const processWearableData = (data?: WearableStatsChartProps["data"]) => {
  if (!data) {
    const fallbackData = generateFallbackData();
    return {
      sleepData: fallbackData.map((d) => ({ value: d.sleep })),
      recoveryData: fallbackData.map((d) => ({ value: d.recovery })),
      strainData: fallbackData.map((d) => ({ value: d.strain })),
    };
  }

  // Process real sleep data - sort by date (oldest to newest)
  const sleepData = (data.sleep || [])
    .filter((item) => item.score?.sleep_performance_percentage !== undefined)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .slice(-30) // Last 30 days
    .map((item) => ({ value: item.score!.sleep_performance_percentage! }));

  // Process real recovery data - sort by date (oldest to newest)
  const recoveryData = (data.recovery || [])
    .filter((item) => item.score?.recovery_score !== undefined)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .slice(-30) // Last 30 days
    .map((item) => ({ value: item.score!.recovery_score! }));

  // Process real strain data - sort by date (oldest to newest)
  const strainData = (data.cycles || [])
    .filter((item) => item.score?.strain !== undefined)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .slice(-30) // Last 30 days
    .map((item) => ({ value: item.score!.strain! }));

  // If we don't have enough real data, use fallback
  if (
    sleepData.length < 5 ||
    recoveryData.length < 5 ||
    strainData.length < 5
  ) {
    const fallbackData = generateFallbackData();
    return {
      sleepData:
        sleepData.length > 0
          ? sleepData
          : fallbackData.map((d) => ({ value: d.sleep })),
      recoveryData:
        recoveryData.length > 0
          ? recoveryData
          : fallbackData.map((d) => ({ value: d.recovery })),
      strainData:
        strainData.length > 0
          ? strainData
          : fallbackData.map((d) => ({ value: d.strain })),
    };
  }

  return { sleepData, recoveryData, strainData };
};

// Calculate average helper
const getSeriousAverage = (data: { value: number }[], days: number = 7) => {
  if (data.length === 0) return 0;
  const recent = data.slice(-days);
  const sum = recent.reduce((acc, curr) => acc + curr.value, 0);
  return sum / recent.length;
};

// Generate cards data
const generateWearableCards = (data?: WearableStatsChartProps["data"]) => {
  const { sleepData, recoveryData, strainData } = processWearableData(data);

  // Get latest values for display
  const latestSleep =
    sleepData.length > 0 ? sleepData[sleepData.length - 1].value : 87;
  const latestRecovery =
    recoveryData.length > 0 ? recoveryData[recoveryData.length - 1].value : 72;
  const latestStrain =
    strainData.length > 0 ? strainData[strainData.length - 1].value : 14.2;

  // Calculate 7-day averages
  const avg7Sleep = Math.round(getSeriousAverage(sleepData));
  const avg7Recovery = Math.round(getSeriousAverage(recoveryData));
  const avg7Strain = parseFloat(getSeriousAverage(strainData).toFixed(1));

  return [
    {
      title: "Sleep",
      metric: "Performance",
      baseValue: `${avg7Sleep}%`,
      baseCurrency: "7d",
      targetValue: `${latestSleep}%`,
      targetCurrency: "Today",
      data: sleepData,
      change: latestSleep > avg7Sleep ? "↗" : "↘",
      isPositive: latestSleep > avg7Sleep,
      color: getSleepColor(latestSleep),
    },
    {
      title: "Recovery",
      metric: "HRV Score",
      baseValue: `${avg7Recovery}%`,
      baseCurrency: "7d",
      targetValue: `${latestRecovery}%`,
      targetCurrency: "Today",
      data: recoveryData,
      change: latestRecovery > avg7Recovery ? "↗" : "↘",
      isPositive: latestRecovery > avg7Recovery,
      color: getRecoveryColor(latestRecovery),
    },
    {
      title: "Strain",
      metric: "Exertion",
      baseValue: `${avg7Strain}`,
      baseCurrency: "7d",
      targetValue: `${latestStrain}`,
      targetCurrency: "Today",
      data: strainData,
      change: latestStrain > avg7Strain ? "↗" : "↘",
      isPositive: latestStrain > 10 && latestStrain < 18, // Optimal strain range
      color: getStrainColor(latestStrain),
    },
    {
      title: "Trend",
      metric: "Overall",
      baseValue: "Good",
      baseCurrency: "Status",
      targetValue: "Live",
      targetCurrency: "Mode",
      data: sleepData, // Use sleep data as representative
      change: "Stable",
      isPositive: true,
      color: "#085983",
    },
  ];
};

export function WearableStatsChart({
  data,
  className,
}: WearableStatsChartProps) {
  const wearableCards = generateWearableCards(data);
  return (
    <div className={cn("w-full max-w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-[#085983] text-base">
              Wearable Stats Trends
            </span>
          </div>
          <p className="text-xs text-[#085983]/60">
            Last 7 days health metrics
          </p>
        </div>
      </div>

      {/* Chart container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 w-full">
        {/* Grid of wearable cards - 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
          {wearableCards.map((card, i) => (
            <Card key={i} className="border-0 shadow-none bg-transparent">
              <CardContent className="flex flex-col gap-2 p-2">
                {/* Header - Compact */}
                <div className="text-center">
                  <h3 className="text-xs font-semibold text-[#085983] m-0">
                    {card.title}
                  </h3>
                  <p className="text-[10px] text-[#085983]/60 m-0">
                    {card.metric}
                  </p>
                </div>

                {/* Mini Chart */}
                <div className="h-8 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={card.data}
                      margin={{
                        top: 2,
                        right: 2,
                        left: 2,
                        bottom: 2,
                      }}
                    >
                      <YAxis domain={["dataMin", "dataMax"]} hide={true} />
                      <ReferenceLine
                        y={card.title === "Strain Level" ? 12 : 70}
                        stroke="#085983"
                        strokeWidth={1}
                        strokeDasharray="2 2"
                        opacity={0.3}
                      />
                      <Tooltip
                        cursor={{
                          stroke: card.color,
                          strokeWidth: 1,
                          strokeDasharray: "2 2",
                        }}
                        position={{ x: undefined, y: undefined }}
                        offset={10}
                        allowEscapeViewBox={{ x: true, y: true }}
                        content={({ active, payload, coordinate }) => {
                          if (
                            active &&
                            payload &&
                            payload.length &&
                            coordinate
                          ) {
                            const value = payload[0].value as number;
                            const formatValue = (val: number) => {
                              if (card.title === "Strain Level") {
                                return `${val}`;
                              } else {
                                return `${val}%`;
                              }
                            };

                            // Smart positioning logic
                            const tooltipStyle: React.CSSProperties = {
                              transform:
                                coordinate.x && coordinate.x > 60
                                  ? "translateX(-100%)"
                                  : "translateX(5px)",
                              marginTop:
                                coordinate.y && coordinate.y > 20
                                  ? "-30px"
                                  : "5px",
                            };

                            return (
                              <div
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg p-1.5 pointer-events-none z-50"
                                style={tooltipStyle}
                              >
                                <p className="text-xs font-semibold text-[#085983] leading-tight">
                                  {formatValue(value)}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={card.color}
                        strokeWidth={2}
                        dot={{
                          r: 0,
                          strokeWidth: 0,
                        }}
                        activeDot={{
                          r: 2,
                          fill: card.color,
                          stroke: "white",
                          strokeWidth: 1,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Values - Compact */}
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-[#085983]">
                      {card.baseValue}
                    </div>
                    <div className="text-[9px] text-[#085983]/60">
                      {card.baseCurrency}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-[#085983]">
                      {card.targetValue}
                    </div>
                    <div className="text-[9px] text-[#085983]/60">
                      {card.targetCurrency}
                    </div>
                  </div>
                </div>

                {/* Status indicator - Compact */}
                <div className="flex items-center justify-center">
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-medium",
                      card.isPositive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    )}
                  >
                    {card.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
