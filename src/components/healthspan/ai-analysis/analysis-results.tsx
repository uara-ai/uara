"use client";

import React from "react";
import Link from "next/link";
import {
  IconBrain,
  IconRefresh,
  IconTarget,
  IconLoader,
  IconMessage,
  IconArrowRight,
  IconCircleCheck,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import type { AnalysisResult } from "@/lib/ai/tools/analyze-whoop-data";

interface AnalysisResultsProps {
  aiAnalysis: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onRefreshAnalysis: () => void;
}

interface AnalysisSuccessProps {
  aiAnalysis: AnalysisResult;
  onRefreshAnalysis: () => void;
  isLoading: boolean;
}

interface AnalysisInstructionsProps {
  isLoading: boolean;
  error: string | null;
}

function AnalysisSuccess({
  aiAnalysis,
  onRefreshAnalysis,
  isLoading,
}: AnalysisSuccessProps) {
  return (
    <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-200 rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <IconBrain className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <CardTitle className="text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
                AI Analysis Results
              </CardTitle>
              <CardDescription className="text-sm text-[#085983]/70 font-geist-sans">
                Personalized insights from your WHOOP data
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-green-700 border-green-300 font-geist-sans text-xs w-fit"
          >
            Generated
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose prose-sm max-w-none text-[#085983]/90 font-geist-sans">
          <div
            dangerouslySetInnerHTML={{
              __html: aiAnalysis.summary.replace(/\n/g, "<br/>"),
            }}
          />
        </div>

        {/* Key Recommendations */}
        {aiAnalysis.keyRecommendations.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] flex items-center gap-2">
              <IconTarget className="h-5 w-5" />
              Key Recommendations
            </h4>
            <div className="grid gap-3">
              {aiAnalysis.keyRecommendations
                .slice(0, 3)
                .map((recommendation, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-xl border border-green-200 shadow-sm"
                  >
                    <p className="text-sm text-[#085983]/80 font-geist-sans leading-relaxed">
                      {recommendation}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-green-200">
          <Button
            onClick={onRefreshAnalysis}
            variant="outline"
            size="default"
            disabled={isLoading}
            className="text-[#085983] border-[#085983]/20 font-geist-sans font-medium"
          >
            {isLoading ? (
              <>
                <IconLoader className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <IconRefresh className="h-4 w-4 mr-2" />
                Refresh Analysis
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalysisInstructions({ isLoading, error }: AnalysisInstructionsProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <IconBrain className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <CardTitle className="text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
              {isLoading
                ? "Generating AI Analysis..."
                : error
                ? "Analysis Error"
                : "Get AI-Powered Analysis"}
            </CardTitle>
            <CardDescription className="text-sm text-[#085983]/70 font-geist-sans">
              {isLoading
                ? "Please wait while we analyze your WHOOP data..."
                : error
                ? error
                : "Use our AI chat to get detailed, personalized insights from your WHOOP data"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] flex items-center gap-2">
                <IconMessage className="h-5 w-5" />
                Sample Questions
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                  <p className="text-sm text-[#085983]/80 font-geist-sans leading-relaxed">
                    &ldquo;Analyze my WHOOP data for longevity insights&rdquo;
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                  <p className="text-sm text-[#085983]/80 font-geist-sans leading-relaxed">
                    &ldquo;How can I improve my recovery score?&rdquo;
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                  <p className="text-sm text-[#085983]/80 font-geist-sans leading-relaxed">
                    &ldquo;What does my sleep data tell you about my
                    health?&rdquo;
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] flex items-center gap-2">
                <IconCircleCheck className="h-5 w-5" />
                What You&apos;ll Get
              </h4>
              <div className="space-y-3">
                {[
                  "Personalized health score analysis",
                  "Evidence-based recommendations",
                  "Longevity optimization tips",
                  "Risk factor identification",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <IconCircleCheck className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="text-sm text-[#085983]/80 font-geist-sans">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-blue-200">
            <Link href="/healthspan/chat" className="block">
              <Button className="w-full bg-[#085983] hover:bg-[#085983]/90 text-white font-geist-sans font-medium h-12">
                <IconMessage className="h-5 w-5 mr-2" />
                Start AI Analysis Chat
                <IconArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalysisResults({
  aiAnalysis,
  isLoading,
  error,
  onRefreshAnalysis,
}: AnalysisResultsProps) {
  if (aiAnalysis) {
    return (
      <AnalysisSuccess
        aiAnalysis={aiAnalysis}
        onRefreshAnalysis={onRefreshAnalysis}
        isLoading={isLoading}
      />
    );
  }

  return <AnalysisInstructions isLoading={isLoading} error={error} />;
}

// Cursor rules applied correctly.
