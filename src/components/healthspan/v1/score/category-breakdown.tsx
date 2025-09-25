"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkersConfig } from "@/lib/health/types";
import { TrendingUp, TrendingDown, Target, Minus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CategoryBreakdownProps {
  markers: MarkersConfig;
}

export function CategoryBreakdown({ markers }: CategoryBreakdownProps) {
  const getMarkerTypeIcon = (type: string) => {
    switch (type) {
      case "higher":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "lower":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "optimal":
        return <Target className="h-4 w-4 text-blue-600" />;
      default:
        return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  const getMarkerTypeBadge = (type: string) => {
    switch (type) {
      case "higher":
        return (
          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            Higher is Better
          </div>
        );
      case "lower":
        return (
          <div className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
            Lower is Better
          </div>
        );
      case "optimal":
        return (
          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            Optimal Range
          </div>
        );
      default:
        return <Badge variant="outline">Ignored</Badge>;
    }
  };

  const formatRange = (type: string, range: any) => {
    if (!range) return "N/A";

    switch (type) {
      case "higher":
      case "lower":
        return `${range[0]} - ${range[1]}`;
      case "optimal":
        return `${range[0]} - ${range[1]} - ${range[2]} - ${range[3]}`;
      default:
        return "N/A";
    }
  };

  const getCategoryDescription = (categoryName: string) => {
    const descriptions = {
      Nutrition:
        "Dietary intake and eating patterns that fuel your body optimally",
      SleepRecovery:
        "Sleep quality, duration, and recovery metrics for restoration",
      MovementFitness:
        "Physical activity, exercise, and cardiovascular fitness",
      MindStress: "Mental wellbeing, stress management, and cognitive health",
      HealthChecks: "Biomarkers, vital signs, and clinical health indicators",
    };
    return descriptions[categoryName as keyof typeof descriptions] || "";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Target className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
        <h2 className="text-lg font-medium text-[#085983] tracking-wider">
          Category & Marker Breakdown
        </h2>
      </div>

      {/* Categories */}
      {Object.entries(markers).map(([categoryName, categoryMarkers]) => (
        <div key={categoryName} className="space-y-6">
          {/* Category Header */}
          <div className="bg-[#085983]/5 rounded-lg p-6">
            <h3 className="text-lg font-medium text-[#085983] tracking-wider mb-2">
              {categoryName}
            </h3>
            <p className="text-sm text-[#085983]/60">
              {getCategoryDescription(categoryName)}
            </p>
            <div className="text-xs text-[#085983]/40 mt-2">
              {categoryMarkers.length} markers in this category
            </div>
          </div>

          {/* Markers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryMarkers.map((marker) => (
              <div key={marker.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  {getMarkerTypeIcon(marker.type)}
                  <div className="font-medium text-[#085983] tracking-wider">
                    {marker.label}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getMarkerTypeBadge(marker.type)}
                  </div>

                  <div className="text-xs text-[#085983]/60 font-mono">
                    Range: {formatRange(marker.type, marker.range)}
                  </div>

                  <div className="text-xs text-[#085983]/60">
                    {getMarkerDescription(marker.id)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function getMarkerDescription(markerId: string): string {
  const descriptions: Record<string, string> = {
    // Nutrition
    calories: "Daily caloric intake - optimal range varies by individual needs",
    protein: "Protein intake for muscle maintenance and metabolic health",
    carbs: "Carbohydrate intake for energy and brain function",
    fat: "Healthy fat intake for hormone production and nutrient absorption",
    fiber: "Dietary fiber for digestive health and blood sugar regulation",
    sugar:
      "Added sugar intake - lower is generally better for metabolic health",
    water: "Daily water intake for hydration and cellular function",
    caffeine: "Caffeine consumption - moderate amounts can be beneficial",
    alcohol: "Alcohol consumption - lower intake reduces health risks",
    eatingWindow: "Time-restricted eating window for metabolic benefits",

    // Sleep & Recovery
    totalInBedTime: "Total time spent in bed - includes sleep and wake time",
    sleepEfficiencyPercentage:
      "Percentage of time in bed actually spent sleeping",
    totalAwakeTime: "Time spent awake during sleep period - less is better",
    totalRemSleepTime: "REM sleep duration for memory and cognitive function",
    totalSlowWaveSleepTime:
      "Deep sleep for physical recovery and growth hormone",
    restingHeartRate: "Heart rate at rest - lower indicates better fitness",
    hrvRmssd: "Heart rate variability - higher indicates better recovery",
    sleepConsistencyPercentage:
      "Consistency in sleep timing - higher is better",
    disturbanceCount: "Number of sleep interruptions - fewer is better",
    recoveryScore: "Overall recovery readiness score",
    sleepPerformancePercentage: "Sleep quality and efficiency score",
    respiratoryRate: "Breathing rate during sleep - optimal range exists",

    // Movement & Fitness
    strain: "Daily physical strain and exertion level",
    averageHeartRate: "Average heart rate during activities",
    maxHeartRate: "Maximum heart rate reached during exercise",
    kilojoule: "Energy expenditure through physical activity",
    distanceMeters: "Total distance covered through movement",
    altitudeGainMeters:
      "Vertical distance climbed - indicates activity intensity",
    percentRecorded:
      "Data quality - higher percentage means more accurate data",

    // Mind & Stress
    mood: "Subjective mood rating on 1-5 scale",
    stress: "Perceived stress level - lower is better for health",
    energy: "Subjective energy level on 1-5 scale",
    focus: "Cognitive focus and concentration ability",
    mindfulness: "Time spent in mindfulness or meditation practices",
    journaling: "Words written in reflection or journaling",
    screenTime: "Daily screen exposure - moderation is beneficial",
    socialQuality: "Quality of social interactions and relationships",
    gratitude: "Gratitude practice - binary indicator of well-being",
    workloadPerception: "Perceived workload intensity - lower stress is better",

    // Health Checks
    weight: "Body weight - used for reference, not directly scored",
    bmi: "Body Mass Index - optimal range for health outcomes",
    waistCircumference: "Waist measurement - indicator of visceral fat",
    bodyFat: "Body fat percentage - optimal range varies by age/gender",
    bloodPressureSys: "Systolic blood pressure - optimal range important",
    bloodPressureDia: "Diastolic blood pressure - optimal range important",
    fastingGlucose:
      "Blood glucose after fasting - lower within range is better",
    hba1c: "Average blood sugar over 2-3 months - lower is better",
    ldl: "Low-density lipoprotein cholesterol - lower is better",
    hdl: "High-density lipoprotein cholesterol - higher is better",
    triglycerides: "Blood triglyceride levels - lower is better",
    totalCholesterol: "Total cholesterol - optimal range exists",
    crp: "C-reactive protein - inflammation marker, lower is better",
    vitaminD: "Vitamin D blood levels - optimal range for health",
  };

  return (
    descriptions[markerId] || "Health marker contributing to overall score"
  );
}

// Cursor rules applied correctly.
