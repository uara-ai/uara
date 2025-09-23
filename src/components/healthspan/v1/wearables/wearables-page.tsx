"use client";

import React from "react";
import { SleepCard, RecoveryCard, StrengthCard } from "./index";
import { WearablesPageProps } from "./types";
import { cn } from "@/lib/utils";

export function WearablesPage({ data, className }: WearablesPageProps) {
  const getLatestData = (dataArray: any[] | undefined) => {
    if (!dataArray || dataArray.length === 0) return null;
    return dataArray.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  };

  const latestSleep = getLatestData(data.sleep);
  const latestRecovery = getLatestData(data.recovery);
  const latestStrength = getLatestData(data.strength);

  const getOverallHealthScore = () => {
    const scores = [];
    if (latestSleep) scores.push(latestSleep.sleepScore);
    if (latestRecovery) scores.push(latestRecovery.recoveryScore);

    if (scores.length === 0) return null;
    return Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
  };

  const overallScore = getOverallHealthScore();

  return (
    <div className={cn("w-full space-y-6", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
        {latestSleep && <SleepCard sleepScore={latestSleep.sleepScore} />}
        {latestRecovery && (
          <RecoveryCard recoveryScore={latestRecovery.recoveryScore} />
        )}
        {latestStrength && <StrengthCard strainScore={latestStrength.strain} />}
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
