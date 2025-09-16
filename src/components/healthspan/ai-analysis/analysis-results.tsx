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

// Simple markdown parser for AI responses
function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
    .replace(
      /`(.*?)`/g,
      '<code class="bg-[#085983]/10 text-[#085983] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
    ) // Inline code
    .replace(
      /^- (.+)$/gm,
      '<div class="flex items-start gap-2 mb-2"><div class="w-1.5 h-1.5 bg-[#085983] rounded-full mt-2 shrink-0"></div><span>$1</span></div>'
    ) // Bullet points
    .replace(
      /^\d+\. (.+)$/gm,
      '<div class="flex items-start gap-2 mb-2"><div class="w-5 h-5 bg-[#085983]/10 text-[#085983] rounded-full flex items-center justify-center text-xs font-semibold shrink-0">•</div><span>$1</span></div>'
    ) // Numbered lists
    .replace(/\n\n/g, "<br/><br/>") // Double line breaks
    .replace(/\n/g, "<br/>"); // Single line breaks
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
            <div
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(aiAnalysis.summary),
              }}
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

      {/* Action Items Grid */}
      {aiAnalysis.keyRecommendations.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {aiAnalysis.keyRecommendations
            .slice(0, 4)
            .map((recommendation, index) => (
              <Card
                key={index}
                className="bg-white border-[#085983]/10 rounded-xl hover:shadow-sm transition-all duration-200 hover:border-[#085983]/20 cursor-pointer group"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#085983]/10 group-hover:bg-[#085983]/15 transition-colors">
                      <IconTarget className="h-3.5 w-3.5 text-[#085983]" />
                    </div>
                    <CardDescription className="font-[family-name:var(--font-geist-sans)] text-xs font-medium text-[#085983]/70 uppercase tracking-wide">
                      Action Item {index + 1}
                    </CardDescription>
                    <IconChevronRight className="h-3 w-3 text-[#085983]/40 ml-auto group-hover:text-[#085983]/60 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-[#085983]/80 font-geist-sans leading-relaxed line-clamp-3">
                    {recommendation}
                  </p>
                </CardContent>
              </Card>
            ))}
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
