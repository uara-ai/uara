"use client";

import React from "react";
import { User } from "@/lib/user.type";
import { UserProfileCard } from "./user-profile-card";
import WhoopActivityCard from "./whoop-activity-card";
import { ContributionChart } from "./contribution-chart";
import { cn } from "@/lib/utils";
import { ScoreOutput } from "@/lib/health/types";

interface HealthspanPageProps {
  user: User;
  whoopData?: {
    sleepPerformance?: number;
    recoveryScore?: number;
    strainScore?: number;
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

      {/* Whoop Activity Card 
      <div className="w-full">
        <WhoopActivityCard
          sleepPerformance={whoopData.sleepPerformance}
          recoveryScore={whoopData.recoveryScore}
          strainScore={whoopData.strainScore}
          title="Today's Metrics"
        />
      </div>*/}

      {/* Second Row: Contribution Chart taking up half page width */}
      <div className="sm:w-1/2 max-w-full">
        <ContributionChart
          memberSince={
            typeof user.createdAt === "string"
              ? user.createdAt
              : new Date().toISOString()
          }
          totalDays={Math.floor(
            (new Date().getTime() -
              new Date(
                typeof user.createdAt === "string" ? user.createdAt : new Date()
              ).getTime()) /
              (1000 * 60 * 60 * 24)
          )}
          currentStreak={30} // Mock streak data - replace with real data later
        />
      </div>

      {/* Additional content can be added here */}
      <div className="text-center text-[#085983]/60 py-12">
        <p>Additional healthspan insights and analytics will appear here...</p>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
