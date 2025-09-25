"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CategoryScores } from "@/lib/health/types";

interface HealthStatsProps {
  categoryScores: CategoryScores;
  overallScore: number;
  className?: string;
}

export function HealthStats({
  categoryScores,
  overallScore,
  className,
}: HealthStatsProps) {
  // Map category keys to display names and colors
  const categoryDisplayMap = {
    Nutrition: {
      name: "Nutrition",
      shortName: "Nutrition",
      icon: "🥗",
    },
    SleepRecovery: {
      name: "Sleep & Recovery",
      shortName: "Sleep",
      icon: "😴",
    },
    MovementFitness: {
      name: "Movement & Fitness",
      shortName: "Fitness",
      icon: "💪",
    },
    MindStress: {
      name: "Mind & Stress",
      shortName: "Stress",
      icon: "🧠",
    },
    HealthChecks: {
      name: "Health Checks",
      shortName: "Labs",
      icon: "🏥",
    },
  };

  // Format score to display
  const formatScore = (score: number | undefined) => {
    if (score === undefined || Number.isNaN(score)) return "N/A";
    return Math.round(score).toString();
  };

  // Get score color based on value
  const getScoreColor = (score: number | undefined) => {
    if (score === undefined || Number.isNaN(score)) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Get trend indicator (placeholder for now)
  const getTrendIndicator = (score: number | undefined) => {
    if (score === undefined || Number.isNaN(score)) return null;
    // This would be based on historical data comparison
    // For now, we'll show a positive trend for scores > 70
    if (score > 70) {
      return <span className="text-green-500 text-xs">↑12.3%</span>;
    }
    return <span className="text-red-500 text-xs">↓5.1%</span>;
  };

  return (
    <div className={cn("flex items-center", className)}>
      {/* Desktop Stats - Horizontal layout aligned to the right */}
      <div className="hidden lg:flex items-center gap-3 rounded-lg px-4 py-2.5 border border-[#085983]/50">
        {Object.entries(categoryDisplayMap).map(([key, config]) => {
          const score = categoryScores[key];
          return (
            <div key={key} className="flex flex-col items-center min-w-[55px]">
              <div
                className={cn(
                  "text-lg font-semibold leading-none",
                  getScoreColor(score)
                )}
              >
                {formatScore(score)}
              </div>
              <div className="text-[10px] text-[#085983] mt-1 leading-tight text-center font-medium">
                {config.shortName}
              </div>
            </div>
          );
        })}

        {/* Overall Score - Highlighted */}
        <div className="flex flex-col items-center min-w-[65px] ml-2 pl-3 border-l border-[#085983]">
          <div
            className={cn(
              "text-xl font-bold leading-none",
              getScoreColor(overallScore)
            )}
          >
            {formatScore(overallScore)}
          </div>
          <div className="text-[10px] text-[#085983] mt-1 leading-tight font-medium">
            Overall
          </div>
        </div>
      </div>

      {/* Tablet Stats - Compact horizontal layout */}
      <div className="hidden md:flex lg:hidden items-center gap-2 rounded-lg px-3 py-2 border border-[#085983]/50 justify-center">
        {Object.entries(categoryDisplayMap)
          .slice(0, 3)
          .map(([key, config]) => {
            const score = categoryScores[key];
            return (
              <div
                key={key}
                className="flex flex-col items-center min-w-[50px]"
              >
                <div
                  className={cn(
                    "text-base font-semibold leading-none",
                    getScoreColor(score)
                  )}
                >
                  {formatScore(score)}
                </div>
                <div className="text-[9px] text-[#085983] mt-0.5 leading-tight text-center font-medium">
                  {config.shortName}
                </div>
              </div>
            );
          })}

        {/* Overall Score for tablet */}
        <div className="flex flex-col items-center min-w-[50px] ml-1 pl-2 border-l border-[#085983]/30 justify-center">
          <div
            className={cn(
              "text-lg font-bold leading-none",
              getScoreColor(overallScore)
            )}
          >
            {formatScore(overallScore)}
          </div>
          <div className="text-[9px] text-[#085983] mt-0.5 leading-tight font-medium">
            Overall
          </div>
        </div>
      </div>

      {/* Mobile Stats - All categories in compact layout */}
      <div className="flex md:hidden items-center gap-1.5 rounded-lg px-2.5 py-2 overflow-x-auto border border-[#085983]/50">
        {Object.entries(categoryDisplayMap).map(([key, config]) => {
          const score = categoryScores[key];
          return (
            <div
              key={key}
              className="flex flex-col items-center min-w-[42px] flex-shrink-0"
            >
              <div
                className={cn(
                  "text-sm font-semibold leading-none",
                  getScoreColor(score)
                )}
              >
                {formatScore(score)}
              </div>
              <div className="text-[8px] text-[#085983] mt-0.5 leading-tight text-center font-medium">
                {config.shortName}
              </div>
            </div>
          );
        })}

        {/* Overall Score for mobile */}
        <div className="flex flex-col items-center min-w-[42px] flex-shrink-0 ml-1 pl-1.5 border-l border-[#085983]/30 justify-center">
          <div
            className={cn(
              "text-base font-bold leading-none",
              getScoreColor(overallScore)
            )}
          >
            {formatScore(overallScore)}
          </div>
          <div className="text-[8px] text-[#085983] mt-0.5 leading-tight font-medium">
            Overall
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
