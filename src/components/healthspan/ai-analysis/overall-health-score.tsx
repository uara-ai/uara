"use client";

import React from "react";
import { IconLoader, IconTarget, IconTrendingUp } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { WhoopStats } from "@/actions/whoop-data-action";
import type { AnalysisResult } from "@/lib/ai/tools/analyze-whoop-data";
import { cn } from "@/lib/utils";

interface OverallHealthScoreProps {
  aiAnalysis: AnalysisResult | null;
  whoopStats: WhoopStats | null;
  isLoading: boolean;
  lastSyncTime?: Date | null;
}

export function OverallHealthScore({
  aiAnalysis,
  whoopStats,
  isLoading,
  lastSyncTime,
}: OverallHealthScoreProps) {
  const healthScore =
    aiAnalysis?.overallHealthScore ??
    whoopStats?.latestRecovery?.recoveryScore ??
    0;
  const displayScore = isLoading
    ? null
    : aiAnalysis?.overallHealthScore ??
      whoopStats?.latestRecovery?.recoveryScore?.toFixed(0) ??
      "-";

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#085983]";
    if (score >= 60) return "text-[#085983]/80";
    return "text-[#085983]/60";
  };

  return (
    <Card className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl border-[#085983]/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#085983]/10">
              <IconTarget className="h-4 w-4 text-[#085983]" />
            </div>
            <CardDescription className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983]/80">
              Overall Health Score
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="text-xs font-medium text-[#085983] bg-[#085983]/5 border-[#085983]/20"
          >
            <IconTrendingUp className="h-3 w-3 mr-1" />
            Wellness Index
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Score Display */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="flex items-center justify-center w-full">
                <IconLoader className="h-8 w-8 animate-spin text-[#085983]" />
                <span className="ml-2 text-[#085983]/70 font-geist-sans">
                  Calculating...
                </span>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl md:text-5xl font-normal tabular-nums",
                    getScoreColor(healthScore)
                  )}
                >
                  {displayScore}
                  {displayScore !== "-" && (
                    <span className="text-lg ml-1">%</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#085983]/60">Target: 80%</span>
                      <span className="font-medium text-[#085983]">
                        {healthScore
                          ? `${Math.min(
                              Math.round((healthScore / 80) * 100),
                              100
                            )}%`
                          : "0%"}
                      </span>
                    </div>
                    <Progress
                      value={Math.min((healthScore / 80) * 100, 100)}
                      className="h-2"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sub-metrics Grid */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#085983]/10">
          <div className="text-center space-y-1">
            <div className="text-lg sm:text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
              {aiAnalysis?.sleepAnalysis.score ??
                whoopStats?.latestSleep?.sleepPerformancePercentage?.toFixed(
                  0
                ) ??
                "--"}
              <span className="text-xs ml-1">%</span>
            </div>
            <div className="text-xs text-[#085983]/60 font-geist-sans font-medium uppercase tracking-wide">
              Sleep
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-lg sm:text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
              {aiAnalysis?.recoveryAnalysis.score ??
                whoopStats?.latestRecovery?.recoveryScore?.toFixed(0) ??
                "--"}
              <span className="text-xs ml-1">%</span>
            </div>
            <div className="text-xs text-[#085983]/60 font-geist-sans font-medium uppercase tracking-wide">
              Recovery
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-lg sm:text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
              {aiAnalysis?.strainAnalysis.score ??
                whoopStats?.weeklyStrain?.averageStrain?.toFixed(1) ??
                "--"}
              <span className="text-xs ml-1">
                {aiAnalysis?.strainAnalysis.score ? "%" : ""}
              </span>
            </div>
            <div className="text-xs text-[#085983]/60 font-geist-sans font-medium uppercase tracking-wide">
              Strain
            </div>
          </div>
        </div>

        {/* Health Status Summary */}
        <div className="pt-3 border-t border-[#085983]/10">
          <div className="flex justify-between text-xs">
            <span className="text-[#085983]/60">Health Status:</span>
            <span className="font-medium text-[#085983]">
              {healthScore >= 80
                ? "Excellent"
                : healthScore >= 60
                ? "Good"
                : healthScore >= 40
                ? "Fair"
                : healthScore > 0
                ? "Needs Attention"
                : "No Data"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Cursor rules applied correctly.
