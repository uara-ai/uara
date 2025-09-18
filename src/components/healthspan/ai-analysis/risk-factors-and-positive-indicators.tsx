"use client";

import React from "react";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconTrendingUp,
  IconShield,
  IconHeart,
  IconTarget,
  IconStar,
  IconTrophy,
} from "@tabler/icons-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownParser } from "@/components/markdown-parser";
import type { AnalysisResult } from "@/lib/ai/tools/analyze-whoop-data";

interface RiskFactorsAndPositiveIndicatorsProps {
  aiAnalysis: AnalysisResult;
}

interface RiskFactorsProps {
  riskFactors: string[];
}

interface PositiveIndicatorsProps {
  positiveIndicators: string[];
}

function OptimizationOpportunities({ riskFactors }: RiskFactorsProps) {
  if (riskFactors.length === 0) return null;

  return (
    <Card className="border-[#085983]/10 rounded-2xl hover:shadow-sm transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50">
              <IconTarget className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-[#085983] font-[family-name:var(--font-instrument-serif)] font-medium">
                Optimization Opportunities
              </CardTitle>
              <CardDescription className="text-[#085983]/70 font-geist-sans text-sm">
                Areas with potential for improvement
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-200 bg-orange-50"
          >
            {riskFactors.length} area{riskFactors.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {riskFactors.map((risk, index) => (
          <div
            key={index}
            className="group p-4 rounded-xl border border-[#085983]/10 hover:border-orange-200 bg-gradient-to-r from-white to-orange-50/30 transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1">
                <MarkdownParser
                  content={risk}
                  className="prose-sm max-w-none [&>*]:text-[#085983]/80 [&>*]:text-sm [&>*]:leading-relaxed [&>*]:mb-0"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function HealthStrengths({ positiveIndicators }: PositiveIndicatorsProps) {
  if (positiveIndicators.length === 0) return null;

  const getStrengthIcon = (index: number) => {
    const icons = [IconTrophy, IconStar, IconShield, IconHeart, IconTrendingUp];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <Card className="border-[#085983]/10 rounded-2xl bg-gradient-to-br from-white via-green-50/30 to-emerald-50/40">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100">
              <IconCircleCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-[#085983] font-[family-name:var(--font-instrument-serif)] font-medium">
                Health Strengths
              </CardTitle>
              <CardDescription className="text-[#085983]/70 font-geist-sans text-sm">
                Your current advantages for longevity
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="outline"
            className="text-green-600 border-green-200 bg-green-50"
          >
            <IconTrophy className="h-3 w-3 mr-1" />
            {positiveIndicators.length} strength
            {positiveIndicators.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {positiveIndicators.map((positive, index) => (
          <div
            key={index}
            className="group p-4 rounded-xl border border-green-200/50 bg-gradient-to-r from-white to-green-50/50"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                {getStrengthIcon(index)}
              </div>
              <div className="flex-1">
                <MarkdownParser
                  content={positive}
                  className="prose-sm max-w-none [&>*]:text-green-700 [&>*]:text-sm [&>*]:leading-relaxed [&>*]:mb-0 [&>*]:font-medium"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function HealthSummary({ aiAnalysis }: { aiAnalysis: AnalysisResult }) {
  const totalPositives = aiAnalysis.positiveIndicators.length;
  const totalOpportunities = aiAnalysis.riskFactors.length;
  const overallScore = aiAnalysis.overallHealthScore;

  let summaryText = "";
  let summaryIcon = IconTrendingUp;
  let summaryColor = "text-[#085983]";

  if (overallScore >= 80) {
    summaryText = `Excellent health profile! You have ${totalPositives} key strengths supporting your longevity goals.`;
    summaryIcon = IconTrophy;
    summaryColor = "text-green-600";
  } else if (overallScore >= 65) {
    summaryText = `Strong health foundation with ${totalPositives} positive indicators. ${
      totalOpportunities > 0
        ? `Focus on ${totalOpportunities} optimization area${
            totalOpportunities !== 1 ? "s" : ""
          } for further improvement.`
        : "Continue your current practices!"
    }`;
    summaryIcon = IconShield;
    summaryColor = "text-blue-600";
  } else {
    summaryText = `Building your health foundation. ${
      totalPositives > 0
        ? `You have ${totalPositives} strength${
            totalPositives !== 1 ? "s" : ""
          } to build upon.`
        : ""
    } ${
      totalOpportunities > 0
        ? ` Focus on ${totalOpportunities} key area${
            totalOpportunities !== 1 ? "s" : ""
          } for rapid improvement.`
        : ""
    }`;
    summaryIcon = IconTarget;
    summaryColor = "text-orange-600";
  }

  const SummaryIcon = summaryIcon;

  return (
    <Card className="border-[#085983]/10 rounded-2xl bg-gradient-to-r from-[#085983]/5 to-[#085983]/10 mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white shadow-sm">
            <SummaryIcon className={`h-6 w-6 ${summaryColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] mb-2">
              Health Overview
            </h3>
            <p className="text-[#085983]/80 font-geist-sans leading-relaxed mb-4">
              {summaryText}
            </p>
            <div className="flex gap-4">
              {totalPositives > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 font-medium">
                    {totalPositives} Strength{totalPositives !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {totalOpportunities > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-orange-600 font-medium">
                    {totalOpportunities} Opportunity
                    {totalOpportunities !== 1 ? "ies" : "y"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskFactorsAndPositiveIndicators({
  aiAnalysis,
}: RiskFactorsAndPositiveIndicatorsProps) {
  const hasRiskFactors = aiAnalysis.riskFactors.length > 0;
  const hasPositiveIndicators = aiAnalysis.positiveIndicators.length > 0;

  if (!hasRiskFactors && !hasPositiveIndicators) {
    return null;
  }

  return (
    <div className="space-y-6 mt-8">
      {/* Section Header */}
      <div className="text-center">
        <h3 className="text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] mb-2">
          Health Assessment Summary
        </h3>
        <p className="text-sm text-[#085983]/70 font-geist-sans max-w-2xl mx-auto">
          Comprehensive overview of your health strengths and areas for
          optimization
        </p>
      </div>

      {/* Health Summary */}
      <HealthSummary aiAnalysis={aiAnalysis} />

      {/* Strengths First (for hopium), then Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Always show positive indicators first if they exist */}
        {hasPositiveIndicators && (
          <div className="lg:order-1">
            <HealthStrengths
              positiveIndicators={aiAnalysis.positiveIndicators}
            />
          </div>
        )}
        {hasRiskFactors && (
          <div
            className={hasPositiveIndicators ? "lg:order-2" : "lg:col-span-2"}
          >
            <OptimizationOpportunities riskFactors={aiAnalysis.riskFactors} />
          </div>
        )}
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
