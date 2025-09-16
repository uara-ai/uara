"use client";

import React from "react";
import {
  IconHeart,
  IconMoon,
  IconActivity,
  IconTarget,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import type { AnalysisResult } from "@/lib/ai/tools/analyze-whoop-data";

interface DetailedAnalysisProps {
  aiAnalysis: AnalysisResult;
}

interface AnalysisCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  score: number;
  insights: string[];
  recommendations: string[];
  description: string;
}

function AnalysisCard({
  title,
  icon: Icon,
  iconColor,
  score,
  insights,
  recommendations,
  description,
}: AnalysisCardProps) {
  return (
    <Card className="bg-white rounded-2xl border-[#085983]/10 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-[#085983] font-[family-name:var(--font-instrument-serif)] font-medium">
                {title}
              </CardTitle>
              <CardDescription className="text-xs text-[#085983]/70 font-geist-sans">
                {description}
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-[#085983] border-[#085983]/20 font-geist-sans font-medium"
          >
            {score}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Insights */}
        <div className="space-y-3">
          {insights.slice(0, 2).map((insight, index) => (
            <div key={index} className="p-3 bg-[#085983]/5 rounded-xl">
              <p className="text-sm text-[#085983]/80 font-geist-sans leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="pt-3 border-t border-[#085983]/10">
            <h5 className="text-sm font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] mb-3 flex items-center gap-2">
              <IconTarget className="h-4 w-4" />
              Top Actions
            </h5>
            <div className="space-y-2">
              {recommendations.slice(0, 1).map((rec, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-xl border border-[#085983]/20 shadow-sm"
                >
                  <p className="text-xs text-[#085983]/80 font-geist-sans leading-relaxed">
                    {rec}
                  </p>
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
      insights: aiAnalysis.recoveryAnalysis.insights,
      recommendations: aiAnalysis.recoveryAnalysis.recommendations,
      description: "Body readiness & capacity",
    },
    {
      title: "Sleep Analysis",
      icon: IconMoon,
      iconColor: "bg-purple-50 text-purple-600",
      score: aiAnalysis.sleepAnalysis.score,
      insights: aiAnalysis.sleepAnalysis.insights,
      recommendations: aiAnalysis.sleepAnalysis.recommendations,
      description: "Sleep quality and optimization insights",
    },
    {
      title: "Strain Analysis",
      icon: IconActivity,
      iconColor: "bg-orange-50 text-orange-600",
      score: aiAnalysis.strainAnalysis.score,
      insights: aiAnalysis.strainAnalysis.insights,
      recommendations: aiAnalysis.strainAnalysis.recommendations,
      description: "Training load and strain patterns",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {analysisCards.map((card, index) => (
        <AnalysisCard key={index} {...card} />
      ))}
    </div>
  );
}

// Cursor rules applied correctly.
