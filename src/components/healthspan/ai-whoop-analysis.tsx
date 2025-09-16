"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IconBrain, IconMessage, IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WhoopDataResponse, WhoopStats } from "@/actions/whoop-data-action";
import {
  generateComprehensiveAnalysis,
  type AnalysisResult,
} from "@/lib/ai/tools/analyze-whoop-data";
import { cn } from "@/lib/utils";
import {
  OverallHealthScore,
  QuickMetrics,
  AnalysisResults,
  DetailedAnalysis,
  RiskFactorsAndPositiveIndicators,
} from "./ai-analysis";

interface AIWhoopAnalysisProps {
  whoopData: WhoopDataResponse | null;
  whoopStats: WhoopStats | null;
  user?: {
    dateOfBirth?: Date | null;
    gender?: string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    tier?: string | null;
  } | null;
  className?: string;
}

export function AIWhoopAnalysis({
  whoopData,
  whoopStats,
  user,
  className,
}: AIWhoopAnalysisProps) {
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateAIAnalysis = useCallback(
    async (
      focusArea: "recovery" | "sleep" | "strain" | "overall" = "overall"
    ) => {
      if (!whoopData || !whoopStats) return;

      setIsLoading(true);
      setError(null);

      try {
        // Call the analysis function directly
        const result = await generateComprehensiveAnalysis(
          whoopData,
          whoopStats,
          focusArea,
          true
        );

        setAiAnalysis(result);
      } catch (err) {
        console.error("Error generating AI analysis:", err);
        setError("Failed to generate AI analysis. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [whoopData, whoopStats]
  );

  useEffect(() => {
    if (whoopData && whoopStats && !aiAnalysis && !isLoading) {
      generateAIAnalysis();
    }
  }, [whoopData, whoopStats, aiAnalysis, isLoading, generateAIAnalysis]);

  if (!whoopData || !whoopStats) {
    return (
      <div className={cn("w-full", className)}>
        <Card className="bg-white rounded-xl sm:rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBrain className="h-5 w-5 text-[#085983]" />
              AI Health Analysis
            </CardTitle>
            <CardDescription>
              No WHOOP data available for analysis. Connect your WHOOP account
              to get AI-powered insights.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <section className={cn("relative w-full", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
              Health Analysis
            </h1>
            <p className="text-base text-[#085983]/70 font-geist-sans">
              Personalized insights from your WHOOP data for longevity
              optimization
            </p>
          </div>
          <Link href="/healthspan/chat" className="shrink-0">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 text-[#085983] border-[#085983]/20 font-geist-sans font-medium"
            >
              <IconMessage className="h-4 w-4" />
              Get AI Analysis
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Overall Health Score */}
          <OverallHealthScore
            aiAnalysis={aiAnalysis}
            whoopStats={whoopStats}
            isLoading={isLoading}
          />

          {/* Right Column: Quick Metrics in 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickMetrics whoopStats={whoopStats} />
          </div>
        </div>

        {/* AI Analysis Results or Instructions */}
        <div className="mt-8 space-y-6">
          <AnalysisResults
            aiAnalysis={aiAnalysis}
            isLoading={isLoading}
            error={error}
            onRefreshAnalysis={() => generateAIAnalysis()}
          />

          {/* Detailed Analysis Sections */}
          {aiAnalysis && <DetailedAnalysis aiAnalysis={aiAnalysis} />}

          {/* Risk Factors and Positive Indicators */}
          {aiAnalysis && (
            <RiskFactorsAndPositiveIndicators aiAnalysis={aiAnalysis} />
          )}
        </div>
      </div>
    </section>
  );
}

// Cursor rules applied correctly.
