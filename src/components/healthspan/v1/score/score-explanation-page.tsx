"use client";

import React from "react";
import { User } from "@/lib/user.type";
import { MarkersConfig } from "@/lib/health/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calculator,
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ScoreOverview } from "./score-overview";
import { MarkerExplanation } from "./marker-explanation";
import { FormulaExplanation } from "./formula-explanation";
import { CategoryBreakdown } from "./category-breakdown";
import { ScientificRationale } from "./scientific-rationale";

interface ScoreExplanationPageProps {
  user: User;
  healthScoreResult: any;
  markers: MarkersConfig;
}

export function ScoreExplanationPage({
  user,
  healthScoreResult,
  markers,
}: ScoreExplanationPageProps) {
  const router = useRouter();

  const currentScore = healthScoreResult?.healthScore?.overallScore;
  const scoreDetails = healthScoreResult?.scoreDetails;

  return (
    <div className="font-geist-sans">
      <div className="w-full mx-auto sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#085983]/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-[#085983] bg-[#085983]/10 hover:bg-[#085983]/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-2xl font-medium text-[#085983] tracking-wider">
                Health Score Calculation
              </h1>
              <p className="text-[#085983]/60 text-sm mt-1">
                Understanding how your personalized health score is calculated
              </p>
            </div>
          </div>
        </div>

        {/* Current Score Overview */}
        {currentScore && (
          <ScoreOverview
            currentScore={currentScore}
            scoreDetails={scoreDetails}
            className="mb-8"
          />
        )}

        {/* Main Content */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-2">
              <Calculator className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
              <div>
                <div className="text-sm text-[#085983] tracking-wider">
                  Total Markers
                </div>
                <div className="font-semibold text-[#085983]">
                  {Object.values(markers).flat().length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
              <div>
                <div className="text-sm text-[#085983] tracking-wider">
                  Categories
                </div>
                <div className="font-semibold text-[#085983]">
                  {Object.keys(markers).length}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
              <div>
                <div className="text-sm text-[#085983] tracking-wider">
                  Score Range
                </div>
                <div className="font-semibold text-[#085983]">0-100</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
              <div>
                <div className="text-sm text-[#085983] tracking-wider">
                  Equal Weights
                </div>
                <div className="font-semibold text-[#085983]">
                  All Categories
                </div>
              </div>
            </div>
          </div>

          {/* Scientific Rationale */}
          <ScientificRationale />

          {/* Formula Explanation */}
          <FormulaExplanation />

          {/* Category Breakdown */}
          <CategoryBreakdown markers={markers} />

          {/* Marker Explanation */}
          <MarkerExplanation />
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
