"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreOverviewProps {
  currentScore: number;
  scoreDetails?: any;
  className?: string;
}

export function ScoreOverview({
  currentScore,
  scoreDetails,
  className,
}: ScoreOverviewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const categoryScores = scoreDetails?.category || {};

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Target className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
        <h2 className="text-lg font-medium text-[#085983] tracking-wider">
          Your Current Health Score
        </h2>
      </div>

      {/* Overall Score Display */}
      <div className="text-center bg-gray-50 rounded-lg p-8">
        <div className="text-6xl font-bold text-[#085983] mb-2">
          {Math.round(currentScore)}
        </div>
        <div className="text-xl text-[#085983]/60 mb-4">
          {getScoreLabel(currentScore)}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 max-w-md mx-auto">
          <div
            className="bg-[#085983] h-3 rounded-full transition-all duration-300"
            style={{ width: `${currentScore}%` }}
          ></div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-[#085983] tracking-wider mb-4">
          Category Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryScores).map(([category, score]) => {
            const numScore = typeof score === "number" ? score : 0;
            const isValid = !isNaN(numScore) && isFinite(numScore);

            return (
              <div
                key={category}
                className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-medium text-[#085983] tracking-wider">
                    {category}
                  </div>
                  {isValid ? (
                    <div className="text-2xl font-bold text-[#085983] mt-1">
                      {Math.round(numScore)}
                    </div>
                  ) : (
                    <div className="text-sm text-[#085983]/40 mt-1">
                      No Data
                    </div>
                  )}
                </div>
                {isValid && (
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#085983] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${numScore}%` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
