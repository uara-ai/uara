"use client";

import React from "react";
import {
  IconHeart,
  IconMoon,
  IconActivity,
  IconTarget,
  IconTrendingUp,
  IconTrendingDown,
  IconMinus,
  IconBulb,
  IconArrowRight,
  IconAlertTriangle,
  IconCheck,
  IconClock,
  IconActivity as IconWorkout,
  IconBed,
  IconSnowflake,
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
import { MarkdownParser } from "@/components/markdown-parser";
import type { AnalysisResult } from "@/lib/ai/tools/analyze-whoop-data";

interface DetailedAnalysisProps {
  aiAnalysis: AnalysisResult;
}

interface AnalysisCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  score: number;
  trend: string;
  insights: string[];
  recommendations: string[];
  description: string;
}

function AnalysisCard({
  title,
  icon: Icon,
  iconColor,
  score,
  trend,
  insights,
  recommendations,
  description,
}: AnalysisCardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <IconTrendingUp className="h-3 w-3 text-green-600" />;
      case "down":
        return <IconTrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <IconMinus className="h-3 w-3 text-[#085983]/60" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 border-green-200 bg-green-50";
    if (score >= 60) return "text-[#085983] border-[#085983]/20 bg-[#085983]/5";
    return "text-orange-600 border-orange-200 bg-orange-50";
  };

  return (
    <Card className="rounded-2xl border-[#085983]/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-[#085983] font-[family-name:var(--font-instrument-serif)] font-medium">
                  {title}
                </CardTitle>
                {getTrendIcon(trend)}
              </div>
              <CardDescription className="text-xs text-[#085983]/70 font-geist-sans">
                {description}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`font-geist-sans font-medium ${getScoreColor(score)}`}
          >
            {score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Insights */}
        <div className="space-y-3">
          <h4 className="text-sm font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] flex items-center gap-2">
            <IconBulb className="h-4 w-4" />
            Key Insights
          </h4>
          {insights.slice(0, 2).map((insight, index) => (
            <div
              key={index}
              className="p-3 bg-[#085983]/5 rounded-xl border border-[#085983]/10"
            >
              <MarkdownParser
                content={insight}
                className="prose-sm max-w-none [&>*]:text-[#085983]/80 [&>*]:text-sm [&>*]:leading-relaxed [&>*]:mb-0"
              />
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="pt-3 border-t border-[#085983]/10">
            <h5 className="text-sm font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] mb-3 flex items-center gap-2">
              <IconTarget className="h-4 w-4" />
              Action Steps
            </h5>
            <div className="space-y-3">
              {recommendations.slice(0, 2).map((rec, index) => (
                <div
                  key={index}
                  className="group p-4 bg-gradient-to-r from-[#085983]/5 to-[#085983]/10 rounded-xl border border-[#085983]/15 hover:border-[#085983]/25 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#085983]/10 text-[#085983] rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <MarkdownParser
                        content={rec}
                        className="prose-sm max-w-none [&>*]:text-[#085983]/80 [&>*]:text-sm [&>*]:leading-relaxed [&>*]:mb-0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DetailedAnalysis({ aiAnalysis }: DetailedAnalysisProps) {
  const analysisCards = [
    {
      title: "Recovery Analysis",
      icon: IconHeart,
      iconColor: "bg-red-50 text-red-600",
      score: aiAnalysis.recoveryAnalysis.score,
      trend: aiAnalysis.recoveryAnalysis.trend,
      insights: aiAnalysis.recoveryAnalysis.insights,
      recommendations: aiAnalysis.recoveryAnalysis.recommendations,
      description: "Body readiness & capacity",
    },
    {
      title: "Sleep Analysis",
      icon: IconMoon,
      iconColor: "bg-purple-50 text-purple-600",
      score: aiAnalysis.sleepAnalysis.score,
      trend: aiAnalysis.sleepAnalysis.trend,
      insights: aiAnalysis.sleepAnalysis.insights,
      recommendations: aiAnalysis.sleepAnalysis.recommendations,
      description: "Sleep quality and optimization insights",
    },
    {
      title: "Strain Analysis",
      icon: IconActivity,
      iconColor: "bg-orange-50 text-orange-600",
      score: aiAnalysis.strainAnalysis.score,
      trend: aiAnalysis.strainAnalysis.trend,
      insights: aiAnalysis.strainAnalysis.insights,
      recommendations: aiAnalysis.strainAnalysis.recommendations,
      description: "Training load and strain patterns",
    },
  ];

  return (
    <div className="space-y-6 mt-8">
      {/* Section Header */}
      <div className="text-center">
        <h3 className="text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] mb-2">
          Detailed Analysis & Recommendations
        </h3>
        <p className="text-sm text-[#085983]/70 font-geist-sans max-w-2xl mx-auto">
          Deep dive into your recovery, sleep, and strain patterns with
          personalized action steps for longevity optimization
        </p>
      </div>

      {/* Analysis Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {analysisCards.map((card, index) => (
          <AnalysisCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
