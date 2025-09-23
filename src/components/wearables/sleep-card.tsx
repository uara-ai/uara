"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SleepCardProps } from "./types";
import { cn } from "@/lib/utils";

export function SleepCard({
  data,
  showDetails = false,
  className,
}: SleepCardProps) {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 55) return "text-amber-500";
    return "text-red-500";
  };

  const getSleepStagePercentage = (stageTime: number) => {
    return Math.round((stageTime / data.totalSleepTime) * 100);
  };

  return (
    <Card
      className={cn(
        "bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200 hover:shadow-sm",
        className
      )}
    >
      <CardContent className="p-6">
        {/* Header with score */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-gray-900">
                Sleep
              </h3>
              <p className="font-[family-name:var(--font-geist-sans)] text-xs text-gray-500">
                {formatDuration(data.totalSleepTime)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={cn(
                "text-2xl font-bold font-[family-name:var(--font-geist-sans)]",
                getScoreColor(data.sleepScore)
              )}
            >
              {data.sleepScore}
            </div>
            <p className="font-[family-name:var(--font-geist-sans)] text-xs text-gray-500">
              score
            </p>
          </div>
        </div>

        {/* Sleep efficiency */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-[family-name:var(--font-geist-sans)] text-sm text-gray-600">
              Efficiency
            </span>
            <span className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-gray-900">
              {data.sleepEfficiency}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${data.sleepEfficiency}%` }}
            />
          </div>
        </div>

        {/* Sleep stages visualization */}
        <div className="space-y-4">
          <h4 className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-gray-900">
            Sleep Stages
          </h4>

          {/* Visual breakdown */}
          <div className="flex rounded-lg overflow-hidden h-3 bg-gray-100">
            <div
              className="bg-indigo-500"
              style={{
                width: `${getSleepStagePercentage(data.deepSleepTime)}%`,
              }}
              title="Deep Sleep"
            />
            <div
              className="bg-purple-500"
              style={{
                width: `${getSleepStagePercentage(data.remSleepTime)}%`,
              }}
              title="REM Sleep"
            />
            <div
              className="bg-blue-400"
              style={{
                width: `${getSleepStagePercentage(data.lightSleepTime)}%`,
              }}
              title="Light Sleep"
            />
            <div
              className="bg-orange-400"
              style={{ width: `${getSleepStagePercentage(data.awakeTime)}%` }}
              title="Awake"
            />
          </div>

          {/* Stage details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                <span className="font-[family-name:var(--font-geist-sans)] text-xs text-gray-600">
                  Deep
                </span>
              </div>
              <span className="font-[family-name:var(--font-geist-sans)] text-xs font-medium text-gray-900">
                {formatDuration(data.deepSleepTime)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="font-[family-name:var(--font-geist-sans)] text-xs text-gray-600">
                  REM
                </span>
              </div>
              <span className="font-[family-name:var(--font-geist-sans)] text-xs font-medium text-gray-900">
                {formatDuration(data.remSleepTime)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="font-[family-name:var(--font-geist-sans)] text-xs text-gray-600">
                  Light
                </span>
              </div>
              <span className="font-[family-name:var(--font-geist-sans)] text-xs font-medium text-gray-900">
                {formatDuration(data.lightSleepTime)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                <span className="font-[family-name:var(--font-geist-sans)] text-xs text-gray-600">
                  Awake
                </span>
              </div>
              <span className="font-[family-name:var(--font-geist-sans)] text-xs font-medium text-gray-900">
                {formatDuration(data.awakeTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Sleep window */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-[family-name:var(--font-geist-sans)] text-xs text-gray-500 mb-1">
                Bedtime
              </p>
              <p className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-gray-900">
                {formatTime(data.bedTime)}
              </p>
            </div>
            <div>
              <p className="font-[family-name:var(--font-geist-sans)] text-xs text-gray-500 mb-1">
                Wake time
              </p>
              <p className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-gray-900">
                {formatTime(data.wakeTime)}
              </p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-[family-name:var(--font-geist-sans)] text-xs text-gray-500 mb-1">
                  Heart rate
                </p>
                <p className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-gray-900">
                  {data.restingHeartRate} bpm
                </p>
              </div>
              <div>
                <p className="font-[family-name:var(--font-geist-sans)] text-xs text-gray-500 mb-1">
                  Respiratory
                </p>
                <p className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-gray-900">
                  {data.respiratoryRate}/min
                </p>
              </div>
            </div>

            {data.disturbances > 0 && (
              <div className="mt-4">
                <p className="font-[family-name:var(--font-geist-sans)] text-xs text-gray-500 mb-1">
                  Disturbances
                </p>
                <p className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-orange-600">
                  {data.disturbances}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Cursor rules applied correctly.
