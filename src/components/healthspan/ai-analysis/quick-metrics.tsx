"use client";

import React from "react";
import { IconHeart, IconMoon, IconActivity } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { WhoopStats } from "@/actions/whoop-data-action";

interface QuickMetricsProps {
  whoopStats: WhoopStats | null;
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  unit?: string;
}

function MetricCard({ icon: Icon, value, label, unit }: MetricCardProps) {
  return (
    <Card className="bg-white border-[#085983]/10 rounded-xl hover:shadow-sm transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#085983]/10">
            <Icon className="h-3.5 w-3.5 text-[#085983]" />
          </div>
          <CardDescription className="font-[family-name:var(--font-geist-sans)] text-xs font-medium text-[#085983]/70 uppercase tracking-wide">
            {label}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xl sm:text-2xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
          {value}
          {unit && (
            <span className="text-sm font-geist-sans text-[#085983]/60 ml-1">
              {unit}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickMetrics({ whoopStats }: QuickMetricsProps) {
  const metrics = [
    {
      icon: IconHeart,
      value: whoopStats?.latestRecovery?.hrvRmssd?.toFixed(0) ?? "--",
      label: "HRV",
      unit: "ms",
    },
    {
      icon: IconHeart,
      value: whoopStats?.latestRecovery?.restingHeartRate?.toFixed(0) ?? "--",
      label: "Resting HR",
      unit: "bpm",
    },
    {
      icon: IconMoon,
      value:
        whoopStats?.latestSleep?.sleepEfficiencyPercentage?.toFixed(0) ?? "--",
      label: "Sleep Efficiency",
      unit: "%",
    },
    {
      icon: IconActivity,
      value: whoopStats?.weeklyStrain?.totalWorkouts?.toString() ?? "--",
      label: "Weekly Workouts",
    },
  ];

  return (
    <>
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </>
  );
}

// Cursor rules applied correctly.
