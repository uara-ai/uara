"use client";

import React from "react";
import { WhoopSleep } from "./types";
import { cn } from "@/lib/utils";
import {
  IconMoon,
  IconClock,
  IconHeart,
  IconBrain,
  IconTarget,
  IconZzz,
  IconActivity,
  IconTrendingUp,
  IconBed,
  IconBolt,
} from "@tabler/icons-react";

interface SleepDetailPageProps {
  sleepData: WhoopSleep[];
  className?: string;
}

export function SleepDetailPage({
  sleepData,
  className,
}: SleepDetailPageProps) {
  // Show only the latest/first sleep session
  const sleep = sleepData[0];

  if (!sleep) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 font-[family-name:var(--font-geist-sans)]">
          No sleep data available
        </p>
      </div>
    );
  }

  // Utility functions
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}:${minutes}h`;
  };

  const formatPercentage = (milliseconds: number, total: number) => {
    return ((milliseconds / total) * 100).toFixed(1);
  };

  const totalSleep =
    sleep.score.stage_summary.total_light_sleep_time_milli +
    sleep.score.stage_summary.total_slow_wave_sleep_time_milli +
    sleep.score.stage_summary.total_rem_sleep_time_milli;

  return (
    <div
      className={cn(
        "w-full mx-auto space-y-8 px-6 font-[family-name:var(--font-geist-sans)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-6">
        <IconMoon className="size-9 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
        <div>
          <h1 className="text-2xl font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Sleep Analysis
          </h1>
          <p className="text-[#085983]/60 text-sm mt-1">
            {formatDate(sleep.start)}
          </p>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="flex justify-center gap-6 sm:gap-8">
        <div className="text-center flex-1">
          <div className="text-2xl sm:text-4xl font-bold text-[#085983] mb-1">
            {sleep.score.sleep_performance_percentage}%
          </div>
          <div className="text-xs sm:text-sm text-[#085983]/60 uppercase tracking-wide">
            Performance
          </div>
        </div>
        <div className="text-center flex-1">
          <div className="text-2xl sm:text-4xl font-bold text-[#085983] mb-1">
            {sleep.score.sleep_efficiency_percentage.toFixed(1)}%
          </div>
          <div className="text-xs sm:text-sm text-[#085983]/60 uppercase tracking-wide">
            Efficiency
          </div>
        </div>
        <div className="text-center flex-1">
          <div className="text-2xl sm:text-4xl font-bold text-[#085983] mb-1">
            {formatDuration(sleep.score.stage_summary.total_in_bed_time_milli)}
          </div>
          <div className="text-xs sm:text-sm text-[#085983]/60 uppercase tracking-wide">
            Total Time
          </div>
        </div>
      </div>

      {/* Sleep Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <IconClock className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Sleep Timeline
          </h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-[#085983]/60 mb-2">
            <span>Bedtime</span>
            <span>Wake Time</span>
          </div>
          <div className="flex items-center justify-between font-medium text-[#085983]">
            <span>{formatTime(sleep.start)}</span>
            <span>{formatTime(sleep.end)}</span>
          </div>
        </div>
      </div>

      {/* Sleep Stages Visualization */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <IconBrain className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Sleep Stages
          </h2>
        </div>

        {/* Sleep Stages Segmented Chart */}
        <div className="flex items-center gap-1.5 w-full mb-3">
          {[
            {
              name: "Light",
              duration: sleep.score.stage_summary.total_light_sleep_time_milli,
              percent: parseFloat(
                formatPercentage(
                  sleep.score.stage_summary.total_light_sleep_time_milli,
                  totalSleep
                )
              ),
              color: "bg-blue-300",
            },
            {
              name: "Deep",
              duration:
                sleep.score.stage_summary.total_slow_wave_sleep_time_milli,
              percent: parseFloat(
                formatPercentage(
                  sleep.score.stage_summary.total_slow_wave_sleep_time_milli,
                  totalSleep
                )
              ),
              color: "bg-indigo-400",
            },
            {
              name: "REM",
              duration: sleep.score.stage_summary.total_rem_sleep_time_milli,
              percent: parseFloat(
                formatPercentage(
                  sleep.score.stage_summary.total_rem_sleep_time_milli,
                  totalSleep
                )
              ),
              color: "bg-purple-400",
            },
          ].map((stage) => (
            <div
              key={stage.name}
              className="space-y-2.5"
              style={{
                width: `${stage.percent}%`,
              }}
            >
              <div
                className={cn(
                  stage.color,
                  "h-2.5 w-full overflow-hidden rounded-sm transition-all"
                )}
              />
              <div className="flex flex-col items-start flex-1">
                <span className="text-xs text-[#085983]/60 font-medium">
                  {stage.name}
                </span>
                <span className="text-base font-semibold text-[#085983]">
                  {stage.percent.toFixed(1)}%
                </span>
                <span className="text-xs text-[#085983]/40">
                  {formatDuration(stage.duration)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center justify-center items-center">
          <IconZzz className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <div className="font-medium text-gray-900 mb-1">
            {sleep.score.stage_summary.sleep_cycle_count}
          </div>
          <div className="text-sm text-gray-600">Sleep Cycles</div>
        </div>

        <div className="text-center">
          <IconActivity className="h-6 w-6 mx-auto mb-2 text-gray-700" />
          <div className="font-medium text-gray-900 mb-1">
            {sleep.score.stage_summary.disturbance_count}
          </div>
          <div className="text-sm text-gray-600">Disturbances</div>
        </div>

        <div className="text-center">
          <IconHeart className="h-6 w-6 mx-auto mb-2 text-gray-700" />
          <div className="font-medium text-gray-900 mb-1">
            {sleep.score.respiratory_rate.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Respiratory Rate</div>
        </div>

        <div className="text-center">
          <IconBed className="h-6 w-6 mx-auto mb-2 text-gray-700" />
          <div className="font-medium text-gray-900 mb-1">
            {formatDuration(sleep.score.stage_summary.total_awake_time_milli)}
          </div>
          <div className="text-sm text-gray-600">Awake Time</div>
        </div>
      </div>

      {/* Sleep Need Analysis */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <IconTarget className="h-5 w-5 text-gray-900" />
          <h2 className="text-lg font-medium text-gray-900">
            Sleep Need Analysis
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="font-medium text-gray-900 mb-1">
              {formatDuration(sleep.score.sleep_needed.baseline_milli)}
            </div>
            <div className="text-sm text-gray-600">Baseline Need</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="font-medium text-gray-900 mb-1">
              {formatDuration(
                sleep.score.sleep_needed.need_from_sleep_debt_milli
              )}
            </div>
            <div className="text-sm text-gray-600">Sleep Debt</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="font-medium text-gray-900 mb-1">
              {formatDuration(
                sleep.score.sleep_needed.need_from_recent_strain_milli
              )}
            </div>
            <div className="text-sm text-gray-600">From Strain</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="font-medium text-gray-900 mb-1">
              {sleep.score.sleep_needed.need_from_recent_nap_milli >= 0
                ? formatDuration(
                    sleep.score.sleep_needed.need_from_recent_nap_milli
                  )
                : `-${formatDuration(
                    Math.abs(
                      sleep.score.sleep_needed.need_from_recent_nap_milli
                    )
                  )}`}
            </div>
            <div className="text-sm text-gray-600">From Naps</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
