"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  IconBrain,
  IconMessage,
  IconArrowRight,
  IconRefresh,
  IconLoader,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
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
  onDataRefresh?: () => void;
}

export function AIWhoopAnalysis({
  whoopData,
  whoopStats,
  user,
  className,
  onDataRefresh,
}: AIWhoopAnalysisProps) {
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

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

  const syncWhoopData = useCallback(async () => {
    setIsSyncing(true);
    setSyncStatus("idle");

    try {
      // Call the WHOOP sync endpoint
      const response = await fetch(
        "/api/wearables/whoop/sync?days=7&type=all",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to sync WHOOP data");
      }

      const result = await response.json();
      console.log("WHOOP sync result:", result);

      setSyncStatus("success");
      setLastSyncTime(new Date());

      // Clear current AI analysis to trigger refresh
      setAiAnalysis(null);
      setError(null);

      // Call parent refresh function to reload data
      if (onDataRefresh) {
        onDataRefresh();
      }

      // Auto-clear success status after 3 seconds
      setTimeout(() => {
        setSyncStatus("idle");
      }, 3000);
    } catch (err) {
      console.error("Error syncing WHOOP data:", err);
      setSyncStatus("error");

      // Auto-clear error status after 5 seconds
      setTimeout(() => {
        setSyncStatus("idle");
      }, 5000);
    } finally {
      setIsSyncing(false);
    }
  }, [onDataRefresh]);

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
            <div className="space-y-1">
              <p className="text-base text-[#085983]/70 font-geist-sans">
                Personalized insights from your WHOOP data for longevity
                optimization
              </p>
              {whoopData?._metadata?.fetchedAt && (
                <p className="text-sm text-[#085983]/60 font-geist-sans">
                  Data from{" "}
                  {new Date(whoopData._metadata.fetchedAt).toLocaleDateString()}{" "}
                  •{whoopData._metadata.daysPeriod} days period
                  {lastSyncTime && (
                    <span className="ml-2">
                      • Last synced {lastSyncTime.toLocaleTimeString()}
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href="/healthspan/chat">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-[#085983] border-[#085983]/20 font-geist-sans font-medium"
              >
                <IconMessage className="h-4 w-4" />
                Chat with AI
                <IconArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              onClick={syncWhoopData}
              disabled={isSyncing}
              variant="outline"
              size="lg"
              className={cn(
                "gap-2 font-geist-sans font-medium transition-all duration-200",
                syncStatus === "success" &&
                  "text-green-700 border-green-200 bg-green-50",
                syncStatus === "error" &&
                  "text-red-700 border-red-200 bg-red-50",
                syncStatus === "idle" && "text-[#085983] border-[#085983]/20"
              )}
            >
              {isSyncing ? (
                <>
                  <IconLoader className="h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : syncStatus === "success" ? (
                <>
                  <IconCheck className="h-4 w-4" />
                  Synced
                </>
              ) : syncStatus === "error" ? (
                <>
                  <IconX className="h-4 w-4" />
                  Failed
                </>
              ) : (
                <>
                  <IconRefresh className="h-4 w-4" />
                  Sync WHOOP
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Overall Health Score */}
          <OverallHealthScore
            aiAnalysis={aiAnalysis}
            whoopStats={whoopStats}
            isLoading={isLoading}
            lastSyncTime={lastSyncTime}
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
