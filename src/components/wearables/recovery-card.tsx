"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  IconActivity,
  IconHeartbeat,
  IconLungs,
  IconThermometer,
  IconDroplet,
  IconTrendingUp,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { RecoveryCardProps } from "./types";
import { cn } from "@/lib/utils";

export function RecoveryCard({
  data,
  showDetails = false,
  className,
}: RecoveryCardProps) {
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "fair":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "poor":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 55) return "text-yellow-600";
    return "text-red-600";
  };

  const getRecoveryStatus = (score: number) => {
    if (score >= 85) return { text: "Excellent", color: "text-green-600" };
    if (score >= 70) return { text: "Good", color: "text-blue-600" };
    if (score >= 55) return { text: "Fair", color: "text-yellow-600" };
    return { text: "Poor", color: "text-red-600" };
  };

  const status = getRecoveryStatus(data.recoveryScore);

  return (
    <Card
      className={cn(
        "bg-white rounded-xl border-[#085983]/20 hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#085983]/10 rounded-lg">
              <IconActivity className="h-5 w-5 text-[#085983]" />
            </div>
            <CardTitle className="text-lg font-[family-name:var(--font-instrument-serif)] text-[#085983]">
              Recovery
            </CardTitle>
          </div>
          <Badge variant="outline" className={getQualityColor(data.quality)}>
            {data.quality}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-[#085983]">
            {data.recoveryScore}/100
          </div>
          <div className={cn("text-sm font-medium", status.color)}>
            {status.text}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recovery score bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#085983]/70">Recovery Level</span>
            <span className={getScoreColor(data.recoveryScore)}>
              {data.recoveryScore}%
            </span>
          </div>
          <Progress value={data.recoveryScore} className="h-2" />
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <IconHeartbeat className="h-4 w-4 text-red-500" />
            <span className="text-[#085983]/70">RHR:</span>
            <span className="font-medium text-[#085983]">
              {data.restingHeartRate} bpm
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconTrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-[#085983]/70">HRV:</span>
            <span className="font-medium text-[#085983]">
              {data.heartRateVariability} ms
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconActivity className="h-4 w-4 text-orange-500" />
            <span className="text-[#085983]/70">Strain:</span>
            <span className="font-medium text-[#085983]">
              {data.strain.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconLungs className="h-4 w-4 text-blue-500" />
            <span className="text-[#085983]/70">Respiratory:</span>
            <span className="font-medium text-[#085983]">
              {data.respiratoryRate} /min
            </span>
          </div>
        </div>

        {showDetails && (
          <>
            {/* Sleep performance */}
            <div className="pt-2 border-t border-[#085983]/10">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#085983]/70">Sleep Performance</span>
                  <span className={getScoreColor(data.sleepPerformance)}>
                    {data.sleepPerformance}%
                  </span>
                </div>
                <Progress value={data.sleepPerformance} className="h-2" />
              </div>
            </div>

            {/* Additional vitals */}
            <div className="pt-2 border-t border-[#085983]/10">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <IconThermometer className="h-4 w-4 text-red-400" />
                  <span className="text-[#085983]/70">Skin Temp:</span>
                  <span className="font-medium text-[#085983]">
                    {data.skinTemperature > 0 ? "+" : ""}
                    {data.skinTemperature.toFixed(1)}°C
                  </span>
                </div>
                {data.bloodOxygen && (
                  <div className="flex items-center gap-2">
                    <IconDroplet className="h-4 w-4 text-blue-400" />
                    <span className="text-[#085983]/70">SpO2:</span>
                    <span className="font-medium text-[#085983]">
                      {data.bloodOxygen}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Calibration warning */}
            {data.isCalibrating && (
              <div className="pt-2 border-t border-[#085983]/10">
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <IconAlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    Device is calibrating - metrics may be less accurate
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Cursor rules applied correctly.
