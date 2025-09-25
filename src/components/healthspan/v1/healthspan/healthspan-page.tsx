"use client";

import React from "react";
import { User } from "@/lib/user.type";
import { UserProfileCard } from "./user-profile-card";
import WhoopActivityCard from "./whoop-activity-card";
import { ContributionChart } from "./contribution-chart";
import { WearableStatsChart } from "./wearable-stats-chart";
import { cn } from "@/lib/utils";
import { ScoreOutput } from "@/lib/health/types";

interface HealthspanPageProps {
  user: User;
  whoopData?: {
    sleepPerformance?: number;
    recoveryScore?: number;
    strainScore?: number;
  };
  wearableData?: {
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
  healthScores?: ScoreOutput;
  className?: string;
}

export function HealthspanPage({
  user,
  whoopData = {
    sleepPerformance: 87,
    recoveryScore: 72,
    strainScore: 14.2,
  },
  wearableData,
  healthScores,
  className,
}: HealthspanPageProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto space-y-8 px-6 font-[family-name:var(--font-geist-sans)]",
        className
      )}
    >
      {/* First Row: Minimal Profile Card - Full Width */}
      <UserProfileCard user={user} healthScores={healthScores} />

      {/* Second Row: Charts in grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-full">
        {/* Wearable Stats Chart */}
        <div className="w-full">
          <WearableStatsChart data={wearableData} />
        </div>
        {/* Contribution Chart */}
        <div className="w-full">
          <ContributionChart
            memberSince={
              typeof user.createdAt === "string"
                ? user.createdAt
                : new Date().toISOString()
            }
            totalDays={Math.floor(
              (new Date().getTime() -
                new Date(
                  typeof user.createdAt === "string"
                    ? user.createdAt
                    : new Date()
                ).getTime()) /
                (1000 * 60 * 60 * 24)
            )}
            currentStreak={30} // Mock streak data - replace with real data later
          />
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
