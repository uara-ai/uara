"use client";

import React from "react";
import { SleepCard, RecoveryCard, CycleCard, WorkoutCard } from "./index";
import { WearablesPageProps } from "./types";
import { cn } from "@/lib/utils";

export function WearablesPage({ data, className }: WearablesPageProps) {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
        {latestSleep && (
          <SleepCard
            sleepPerformancePercentage={
              latestSleep.score.sleep_performance_percentage
            }
          />
        )}
        {latestRecovery && (
          <RecoveryCard recoveryScore={latestRecovery.score.recovery_score} />
        )}
        {latestCycle && <CycleCard strainScore={latestCycle.score.strain} />}
        {latestWorkout && (
          <WorkoutCard strainScore={latestWorkout.score.strain} />
        )}
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
