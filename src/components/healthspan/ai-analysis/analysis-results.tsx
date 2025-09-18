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
  IconBulb,
  IconAlertTriangle,
  IconChevronRight,
  IconClock,
  IconActivity,
  IconHeart,
  IconMoon,
  IconTrendingUp,
  IconFlag,
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
import { Separator } from "@/components/ui/separator";
import { MarkdownParser } from "@/components/markdown-parser";
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

function AnalysisStreamingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Analysis Summary Card Skeleton */}
      <Card className="bg-white border-[#085983]/10 rounded-xl sm:rounded-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#085983]/10">
                <IconLoader className="h-4 w-4 text-[#085983] animate-spin" />
              </div>
              <CardDescription className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983]/80">
                AI Analysis Summary
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-medium text-blue-600 bg-blue-50 border-blue-200"
            >
              <IconLoader className="h-3 w-3 mr-1 animate-spin" />
              Analyzing...
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="h-4 bg-gradient-to-r from-[#085983]/10 via-[#085983]/20 to-[#085983]/10 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] rounded"></div>
            <div className="h-4 bg-[#085983]/20 rounded w-4/5 animate-pulse"></div>
            <div className="h-4 bg-[#085983]/15 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-[#085983]/20 rounded w-5/6 animate-pulse"></div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-[#085983] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#085983]/60 rounded-full animate-bounce [animation-delay:0.1s]"></div>
              <div className="w-2 h-2 bg-[#085983]/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            </div>
            <span className="text-xs text-[#085983]/60 font-geist-sans">
              Processing your health data...
            </span>
          </div>

          <Separator className="bg-[#085983]/10" />

          <div className="flex items-center justify-between">
            <div className="h-3 bg-[#085983]/10 rounded w-24 animate-pulse"></div>
            <div className="h-6 bg-[#085983]/10 rounded w-16 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Action Items Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <IconTarget className="h-5 w-5 text-[#085983]" />
          <div className="h-6 bg-[#085983]/10 rounded w-48 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="border-[#085983]/10 rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#085983]/10 rounded-full animate-pulse"></div>
                    <div>
                      <div className="h-3 bg-[#085983]/10 rounded w-20 animate-pulse mb-1"></div>
                      <div className="h-4 bg-[#085983]/10 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-4 w-4 bg-[#085983]/10 rounded animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="h-3 bg-[#085983]/10 rounded animate-pulse"></div>
                  <div className="h-3 bg-[#085983]/10 rounded w-4/5 animate-pulse"></div>
                  <div className="h-3 bg-[#085983]/10 rounded w-3/4 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalysisSuccess({
  aiAnalysis,
  onRefreshAnalysis,
  isLoading,
}: AnalysisSuccessProps) {
  return (
    <div className="space-y-6">
      {/* Analysis Summary Card */}
      <Card className="bg-white border-[#085983]/10 rounded-xl sm:rounded-2xl hover:shadow-sm transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#085983]/10">
                <IconBrain className="h-4 w-4 text-[#085983]" />
              </div>
              <CardDescription className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983]/80">
                AI Analysis Summary
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-medium text-[#085983] bg-[#085983]/5 border-[#085983]/20"
            >
              <IconCircleCheck className="h-3 w-3 mr-1" />
              Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-[#085983]/90 font-geist-sans leading-relaxed">
            <MarkdownParser
              content={aiAnalysis.summary}
              className="prose-sm max-w-none [&>*]:text-[#085983]/90 [&>*]:leading-relaxed"
            />
          </div>

          <Separator className="bg-[#085983]/10" />

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#085983]/60 font-geist-sans">
              Last updated: {new Date().toLocaleDateString()}
            </span>
            <Button
              onClick={onRefreshAnalysis}
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="text-[#085983] hover:bg-[#085983]/5 h-8 px-3"
            >
              {isLoading ? (
                <IconLoader className="h-3 w-3 mr-1.5 animate-spin" />
              ) : (
                <IconRefresh className="h-3 w-3 mr-1.5" />
              )}
              <span className="text-xs">Refresh</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Priority Action Items */}
      {aiAnalysis.keyRecommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <IconTarget className="h-5 w-5 text-[#085983]" />
            <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
              Priority Action Items
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiAnalysis.keyRecommendations
              .slice(0, 4)
              .map((recommendation, index) => {
                const priorities = ["High", "Medium", "Medium", "Low"];
                const priorityColors = [
                  "border-red-200 bg-red-50 text-red-700",
                  "border-orange-200 bg-orange-50 text-orange-700",
                  "border-orange-200 bg-orange-50 text-orange-700",
                  "border-blue-200 bg-blue-50 text-blue-700",
                ];

                return (
                  <Card
                    key={index}
                    className="border-[#085983]/10 rounded-xl group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#085983]/10 to-[#085983]/20 text-[#085983] rounded-full flex items-center justify-center text-sm font-bold group-hover:from-[#085983]/15 group-hover:to-[#085983]/25 transition-all">
                            {index + 1}
                          </div>
                          <div>
                            <CardDescription className="font-[family-name:var(--font-geist-sans)] text-xs font-medium text-[#085983]/70 uppercase tracking-wide">
                              Action Item {index + 1}
                            </CardDescription>
                            <Badge
                              variant="outline"
                              className={`text-xs mt-1 ${priorityColors[index]}`}
                            >
                              {priorities[index]} Priority
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <MarkdownParser
                        content={recommendation}
                        className="prose-sm max-w-none [&>*]:text-[#085983]/80 [&>*]:text-sm [&>*]:leading-relaxed [&>*]:mb-1 [&>p]:line-clamp-3"
                      />
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-[#085983]/5 to-[#085983]/10 border-[#085983]/20 rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#085983]/10">
                <IconBulb className="h-4 w-4 text-[#085983]" />
              </div>
              <div>
                <h4 className="text-sm font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983]">
                  Want More Detailed Analysis?
                </h4>
                <p className="text-xs text-[#085983]/70 font-geist-sans">
                  Get personalized insights and ask specific questions
                </p>
              </div>
            </div>
            <Link href="/healthspan/chat">
              <Button className="bg-[#085983] hover:bg-[#085983]/90 text-white font-geist-sans font-medium h-9 px-4">
                <IconMessage className="h-4 w-4 mr-2" />
                Chat with AI
                <IconArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalysisInstructions({ isLoading, error }: AnalysisInstructionsProps) {
  if (error) {
    return (
      <Card className="bg-white border-red-200 rounded-xl sm:rounded-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-50">
              <IconAlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <CardDescription className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-red-600">
              Analysis Error
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700 font-geist-sans mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <IconRefresh className="h-3 w-3 mr-1.5" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-white border-[#085983]/10 rounded-xl sm:rounded-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#085983]/10">
              <IconLoader className="h-4 w-4 text-[#085983] animate-spin" />
            </div>
            <CardDescription className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983]/80">
              Generating AI Analysis...
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#085983] rounded-full animate-pulse"></div>
              <span className="text-sm text-[#085983]/70 font-geist-sans">
                Processing your WHOOP data...
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#085983]/60 rounded-full animate-pulse delay-150"></div>
              <span className="text-sm text-[#085983]/70 font-geist-sans">
                Analyzing health patterns...
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#085983]/40 rounded-full animate-pulse delay-300"></div>
              <span className="text-sm text-[#085983]/70 font-geist-sans">
                Generating personalized insights...
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main CTA Card */}
      <Card className="bg-gradient-to-r from-[#085983]/5 to-[#085983]/10 border-[#085983]/20 rounded-xl sm:rounded-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#085983]/10">
              <IconBrain className="h-4 w-4 text-[#085983]" />
            </div>
            <CardDescription className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983]/80">
              AI Health Analysis
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] mb-2">
              Get Personalized Health Insights
            </h3>
            <p className="text-sm text-[#085983]/70 font-geist-sans leading-relaxed">
              Our AI analyzes your WHOOP data to provide actionable
              recommendations for optimizing your health and longevity.
            </p>
          </div>

          <Link href="/healthspan/chat" className="block">
            <Button className="w-full bg-[#085983] hover:bg-[#085983]/90 text-white font-geist-sans font-medium h-11">
              <IconMessage className="h-4 w-4 mr-2" />
              Start AI Analysis
              <IconArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            icon: IconTarget,
            title: "Recovery Analysis",
            description:
              "Optimize your body's readiness and performance capacity",
          },
          {
            icon: IconBulb,
            title: "Sleep Insights",
            description: "Improve your sleep quality and consistency patterns",
          },
          {
            icon: IconCircleCheck,
            title: "Actionable Tips",
            description:
              "Get specific recommendations for longevity optimization",
          },
        ].map((feature, index) => (
          <Card
            key={index}
            className="bg-white border-[#085983]/10 rounded-xl hover:shadow-sm transition-shadow"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#085983]/10">
                  <feature.icon className="h-3.5 w-3.5 text-[#085983]" />
                </div>
                <CardDescription className="font-[family-name:var(--font-geist-sans)] text-xs font-medium text-[#085983]/70 uppercase tracking-wide">
                  {feature.title}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-[#085983]/80 font-geist-sans leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AnalysisResults({
  aiAnalysis,
  isLoading,
  error,
  onRefreshAnalysis,
}: AnalysisResultsProps) {
  // Show skeleton when loading and no analysis exists yet, or when refreshing
  if (isLoading) {
    return <AnalysisStreamingSkeleton />;
  }

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
