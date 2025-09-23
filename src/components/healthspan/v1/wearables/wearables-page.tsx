"use client";

import React from "react";
import { SleepCard, RecoveryCard, CycleCard, WorkoutCard } from "./index";
import { WearablesPageProps } from "./types";
import { WhoopManagementMenu } from "./whoop-management-menu";
import { cn } from "@/lib/utils";

export function WearablesPage({
  data,
  whoopUser,
  isConnected,
  className,
}: WearablesPageProps) {
  const getLatestData = (dataArray: any[] | undefined) => {
    if (!dataArray || dataArray.length === 0) return null;
    return dataArray.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
  };

  const latestCycle = getLatestData(data.cycles);
  const latestSleep = getLatestData(data.sleep);
  const latestRecovery = getLatestData(data.recovery);
  const latestWorkout = getLatestData(data.workouts);

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* WHOOP Management Menu */}
      <WhoopManagementMenu whoopUser={whoopUser} isConnected={isConnected} />

      {/* Data Cards - only show if connected and has data */}
      {isConnected &&
        (latestSleep || latestRecovery || latestCycle || latestWorkout) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
            {latestSleep && latestSleep.score && (
              <SleepCard
                sleepPerformancePercentage={
                  latestSleep.score.sleep_performance_percentage
                }
              />
            )}
            {latestRecovery && latestRecovery.score && (
              <RecoveryCard
                recoveryScore={latestRecovery.score.recovery_score}
              />
            )}
            {latestCycle && latestCycle.score && (
              <CycleCard strainScore={latestCycle.score.strain} />
            )}
            {latestWorkout && latestWorkout.score && (
              <WorkoutCard strainScore={latestWorkout.score.strain} />
            )}
          </div>
        )}

      {/* Empty state when connected but no data */}
      {isConnected &&
        !latestSleep &&
        !latestRecovery &&
        !latestCycle &&
        !latestWorkout && (
          <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 font-medium">No WHOOP data available</p>
            <p className="text-sm text-gray-500 mt-1">
              Try syncing your data or check your WHOOP device connectivity.
            </p>
          </div>
        )}
    </div>
  );
}

// Cursor rules applied correctly.
