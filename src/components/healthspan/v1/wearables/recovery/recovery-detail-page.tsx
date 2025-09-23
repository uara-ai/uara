"use client";

import React from "react";
import { WhoopRecovery } from "../types";
import { cn } from "@/lib/utils";
import {
  IconHeart,
  IconBrain,
  IconBolt,
  IconActivity,
  IconTarget,
  IconTrendingUp,
  IconThermometer,
  IconLungs,
  IconArrowLeft,
  IconGauge,
} from "@tabler/icons-react";
import Link from "next/link";

interface RecoveryDetailPageProps {
  recoveryData: WhoopRecovery[];
  className?: string;
}

export function RecoveryDetailPage({
  recoveryData,
  className,
}: RecoveryDetailPageProps) {
  // Show only the latest/first recovery session
  const recovery = recoveryData[0];

  if (!recovery) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 font-[family-name:var(--font-geist-sans)]">
          No recovery data available
        </p>
      </div>
    );
  }

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getRecoveryColor = (score: number) => {
    if (score >= 67) return "text-green-600";
    if (score >= 34) return "text-yellow-600";
    return "text-red-600";
  };

  const getRecoveryBgColor = (score: number) => {
    if (score >= 67) return "bg-green-100";
    if (score >= 34) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getRecoveryStatus = (score: number) => {
    if (score >= 67) return "Good Recovery";
    if (score >= 34) return "Moderate Recovery";
    return "Poor Recovery";
  };

  const getHrvStatus = (hrv: number) => {
    if (hrv >= 40) return "Excellent";
    if (hrv >= 25) return "Good";
    if (hrv >= 15) return "Fair";
    return "Poor";
  };

  const getRhrStatus = (rhr: number) => {
    if (rhr <= 60) return "Excellent";
    if (rhr <= 70) return "Good";
    if (rhr <= 80) return "Fair";
    return "Needs Attention";
  };

  return (
    <div
      className={cn(
        "w-full mx-auto space-y-8 px-6 font-[family-name:var(--font-geist-sans)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <Link
            href="/healthspan/wearables"
            className="flex items-center gap-2 px-3 py-3 text-sm font-medium text-[#085983] bg-[#085983]/10 hover:bg-[#085983]/20 rounded-lg transition-colors"
          >
            <IconArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
              Recovery Analysis
            </h1>
            <p className="text-[#085983]/60 text-sm mt-1">
              {formatDate(recovery.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Recovery Score */}
      <div className="flex justify-center">
        <div className="text-center">
          <div
            className={cn(
              "text-6xl font-bold mb-2",
              getRecoveryColor(recovery.score.recovery_score)
            )}
          >
            {recovery.score.recovery_score}%
          </div>
          <div
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-full",
              getRecoveryBgColor(recovery.score.recovery_score),
              getRecoveryColor(recovery.score.recovery_score)
            )}
          >
            {getRecoveryStatus(recovery.score.recovery_score)}
          </div>
          {recovery.score.user_calibrating && (
            <div className="text-xs text-[#085983]/60 mt-2 bg-blue-50 px-3 py-1 rounded-full">
              Still Calibrating
            </div>
          )}
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-[#085983]/10 rounded-lg p-6 text-center">
          <IconHeart className="size-8 text-[#085983] mx-auto mb-3" />
          <div className="text-2xl font-bold text-[#085983] mb-1">
            {recovery.score.resting_heart_rate}
          </div>
          <div className="text-sm text-[#085983]/60 mb-1">BPM</div>
          <div className="text-xs font-medium text-[#085983]/80">
            {getRhrStatus(recovery.score.resting_heart_rate)}
          </div>
        </div>

        <div className="bg-[#085983]/10 rounded-lg p-6 text-center">
          <IconBrain className="size-8 text-[#085983] mx-auto mb-3" />
          <div className="text-2xl font-bold text-[#085983] mb-1">
            {recovery.score.hrv_rmssd_milli.toFixed(1)}
          </div>
          <div className="text-sm text-[#085983]/60 mb-1">HRV (ms)</div>
          <div className="text-xs font-medium text-[#085983]/80">
            {getHrvStatus(recovery.score.hrv_rmssd_milli)}
          </div>
        </div>

        <div className="bg-[#085983]/10 rounded-lg p-6 text-center col-span-2 md:col-span-1">
          <IconLungs className="size-8 text-[#085983] mx-auto mb-3" />
          <div className="text-2xl font-bold text-[#085983] mb-1">
            {recovery.score.spo2_percentage.toFixed(1)}%
          </div>
          <div className="text-sm text-[#085983]/60 mb-1">SpO2</div>
          <div className="text-xs font-medium text-[#085983]/80">
            {recovery.score.spo2_percentage >= 95 ? "Normal" : "Low"}
          </div>
        </div>
      </div>

      {/* Recovery Insights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <IconTarget className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Recovery Insights
          </h2>
        </div>

        <div className="grid gap-4">
          {/* HRV Analysis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconActivity className="size-5 text-[#085983]" />
              <h3 className="font-medium text-[#085983]">
                Heart Rate Variability
              </h3>
            </div>
            <p className="text-sm text-[#085983]/70">
              Your HRV of {recovery.score.hrv_rmssd_milli.toFixed(1)}ms
              indicates{" "}
              {recovery.score.hrv_rmssd_milli >= 40
                ? "excellent autonomic nervous system recovery. Your body is well-rested and ready for training."
                : recovery.score.hrv_rmssd_milli >= 25
                ? "good recovery status. You can proceed with moderate training intensity."
                : recovery.score.hrv_rmssd_milli >= 15
                ? "fair recovery. Consider lighter training or active recovery."
                : "poor recovery. Prioritize rest and stress management."}
            </p>
          </div>

          {/* RHR Analysis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconHeart className="size-5 text-[#085983]" />
              <h3 className="font-medium text-[#085983]">Resting Heart Rate</h3>
            </div>
            <p className="text-sm text-[#085983]/70">
              Your resting heart rate of {recovery.score.resting_heart_rate} BPM
              is{" "}
              {recovery.score.resting_heart_rate <= 60
                ? "excellent, indicating strong cardiovascular fitness and good recovery."
                : recovery.score.resting_heart_rate <= 70
                ? "good, showing healthy cardiovascular function."
                : recovery.score.resting_heart_rate <= 80
                ? "fair. Consider improving cardiovascular fitness through regular exercise."
                : "elevated. This may indicate stress, poor sleep, or incomplete recovery."}
            </p>
          </div>

          {/* Overall Recovery */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconGauge className="size-5 text-[#085983]" />
              <h3 className="font-medium text-[#085983]">
                Recovery Recommendations
              </h3>
            </div>
            <p className="text-sm text-[#085983]/70">
              {recovery.score.recovery_score >= 67
                ? "Great recovery! You're ready for high-intensity training. Your body has recovered well from previous stress."
                : recovery.score.recovery_score >= 34
                ? "Moderate recovery. You can train, but consider reducing intensity or focusing on technique work."
                : "Poor recovery detected. Prioritize sleep, nutrition, and stress management. Consider rest or very light activity only."}
            </p>
          </div>
        </div>
      </div>

      {/* Physiological Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <IconThermometer className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Physiological Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#085983]/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#085983]">
                Skin Temperature
              </span>
              <span className="text-lg font-bold text-[#085983]">
                {recovery.score.skin_temp_celsius.toFixed(1)}°C
              </span>
            </div>
            <div className="text-xs text-[#085983]/60">
              Normal range: 35.5°C - 37.2°C
            </div>
          </div>

          <div className="bg-[#085983]/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#085983]">
                Blood Oxygen
              </span>
              <span className="text-lg font-bold text-[#085983]">
                {recovery.score.spo2_percentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-[#085983]/60">
              Normal range: 95% - 100%
            </div>
          </div>
        </div>
      </div>

      {/* Recovery Trends Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <IconTrendingUp className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Recovery Tips
          </h2>
        </div>

        <div className="grid gap-3">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h3 className="font-medium text-blue-800 mb-1">Sleep Quality</h3>
            <p className="text-sm text-blue-700">
              Aim for 7-9 hours of quality sleep to optimize recovery.
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <h3 className="font-medium text-green-800 mb-1">
              Stress Management
            </h3>
            <p className="text-sm text-green-700">
              Practice meditation, deep breathing, or light stretching to
              improve HRV.
            </p>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
            <h3 className="font-medium text-purple-800 mb-1">Nutrition</h3>
            <p className="text-sm text-purple-700">
              Stay hydrated and consume anti-inflammatory foods to support
              recovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
