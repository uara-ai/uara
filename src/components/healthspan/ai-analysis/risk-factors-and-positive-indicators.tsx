"use client";

import React from "react";
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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

function RiskFactors({ riskFactors }: RiskFactorsProps) {
  if (riskFactors.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 rounded-xl sm:rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <IconAlertTriangle className="h-5 w-5" />
          Priority Areas
        </CardTitle>
        <CardDescription className="text-red-600/80">
          Areas that need attention for optimal health
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {riskFactors.map((risk, index) => (
          <div
            key={index}
            className="p-3 bg-white rounded-lg border border-red-200"
          >
            <p className="text-sm text-red-700">{risk}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PositiveIndicators({ positiveIndicators }: PositiveIndicatorsProps) {
  if (positiveIndicators.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 rounded-xl sm:rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <IconCircleCheck className="h-5 w-5" />
          Health Strengths
        </CardTitle>
        <CardDescription className="text-green-600/80">
          Your current health advantages and positive indicators
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {positiveIndicators.map((positive, index) => (
          <div
            key={index}
            className="p-3 bg-white rounded-lg border border-green-200"
          >
            <p className="text-sm text-green-700">{positive}</p>
          </div>
        ))}
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <RiskFactors riskFactors={aiAnalysis.riskFactors} />
      <PositiveIndicators positiveIndicators={aiAnalysis.positiveIndicators} />
    </div>
  );
}

// Cursor rules applied correctly.
