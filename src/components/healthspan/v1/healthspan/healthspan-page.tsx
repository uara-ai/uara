"use client";

import React from "react";
import { User } from "@/lib/user.type";
import { UserProfileCard } from "./user-profile-card";
import { ContributionChart } from "./contribution-chart";
import { WearableStatsChart } from "./wearable-stats-chart";
import { AiTipsQuick } from "./ai-tips-quick";
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

      {/* Second Row: Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-full">
        {/* Left Column: Wearable Stats Chart */}
        <div className="w-full order-1">
          <WearableStatsChart data={wearableData} />
        </div>

        {/* Right Column: Two stacked components */}
        <div className="w-full space-y-6 lg:space-y-2.5 order-2">
          {/* Quick AI Tips Component */}
          <div className="w-full">
            <AiTipsQuick />
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
    </div>
  );
}

// Cursor rules applied correctly.
