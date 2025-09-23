"use client";

import React from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getRecoveryColor, getChartBackground } from "./chart-colors";

interface RecoveryCardProps {
  recoveryScore: number;
}

export function RecoveryCard({ recoveryScore }: RecoveryCardProps) {
  const chartData = [
    {
      recovery: recoveryScore,
      fill: getRecoveryColor(recoveryScore),
    },
  ];

  const chartConfig = {
    recovery: {
      label: "Recovery",
      color: getRecoveryColor(recoveryScore),
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col items-center">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-[120px] h-[120px]"
      >
        <RadialBarChart
          data={chartData}
          startAngle={0}
          endAngle={250}
          innerRadius={40}
          outerRadius={60}
          width={120}
          height={120}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-slate-100 last:fill-transparent"
            polarRadius={[46, 34]}
          />
          <RadialBar
            dataKey="recovery"
            background={{
              fill: getChartBackground(),
            }}
            cornerRadius={10}
            fill={getRecoveryColor(recoveryScore)}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="text-2xl font-bold"
                      >
                        {recoveryScore}%
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      <Link
        href="/healthspan/wearables/recovery"
        className="text-sm font-medium font-[family-name:var(--font-geist-sans)] tracking-wider flex items-center gap-1 text-[#085983]"
      >
        Recovery
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// Cursor rules applied correctly.
