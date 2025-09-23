"use client";

import React from "react";
import { WhoopCycle } from "../types";
import { cn } from "@/lib/utils";
import {
  IconBolt,
  IconHeart,
  IconActivity,
  IconTarget,
  IconTrendingUp,
  IconClock,
  IconFlame,
  IconGauge,
  IconArrowLeft,
  IconBarbell,
  IconBoltFilled,
} from "@tabler/icons-react";
import Link from "next/link";

interface CycleDetailPageProps {
  cycleData: WhoopCycle[];
  className?: string;
}

export function CycleDetailPage({
  cycleData,
  className,
}: CycleDetailPageProps) {
  // Show only the latest/first cycle
  const cycle = cycleData[0];

  if (!cycle) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 font-[family-name:var(--font-geist-sans)]">
          No cycle data available
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStrainColor = (strain: number) => {
    if (strain >= 16) return "text-red-600";
    if (strain >= 10) return "text-orange-600";
    if (strain >= 7) return "text-yellow-600";
    return "text-green-600";
  };

  const getStrainBgColor = (strain: number) => {
    if (strain >= 16) return "bg-red-100";
    if (strain >= 10) return "bg-orange-100";
    if (strain >= 7) return "bg-yellow-100";
    return "bg-green-100";
  };

  const getStrainStatus = (strain: number) => {
    if (strain >= 16) return "Very High Strain";
    if (strain >= 10) return "High Strain";
    if (strain >= 7) return "Moderate Strain";
    return "Low Strain";
  };

  const getStrainDescription = (strain: number) => {
    if (strain >= 16)
      return "Intense training day. Your body experienced significant physiological stress.";
    if (strain >= 10)
      return "Demanding day with elevated cardiovascular stress. Good training intensity.";
    if (strain >= 7)
      return "Moderate activity level. Balanced approach to training and recovery.";
    return "Light activity day. Good for active recovery or rest.";
  };

  const getHeartRateZone = (avgHr: number, maxHr: number) => {
    const percentage = (avgHr / maxHr) * 100;
    if (percentage >= 90)
      return {
        zone: "Zone 5",
        color: "text-red-600",
        desc: "Neuromuscular Power",
      };
    if (percentage >= 80)
      return {
        zone: "Zone 4",
        color: "text-orange-600",
        desc: "Lactate Threshold",
      };
    if (percentage >= 70)
      return { zone: "Zone 3", color: "text-yellow-600", desc: "Aerobic Base" };
    if (percentage >= 60)
      return { zone: "Zone 2", color: "text-blue-600", desc: "Fat Burning" };
    return { zone: "Zone 1", color: "text-green-600", desc: "Active Recovery" };
  };

  const heartRateZone = getHeartRateZone(
    cycle.score.average_heart_rate,
    cycle.score.max_heart_rate
  );

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
              Daily Strain Analysis
            </h1>
            <p className="text-[#085983]/60 text-sm mt-1">
              {formatDate(cycle.start)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Strain Score */}
      <div className="flex justify-center">
        <div className="text-center">
          <div
            className={cn(
              "text-6xl font-bold mb-2",
              getStrainColor(cycle.score.strain)
            )}
          >
            {cycle.score.strain.toFixed(1)}
          </div>
          <div
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-full",
              getStrainBgColor(cycle.score.strain),
              getStrainColor(cycle.score.strain)
            )}
          >
            {getStrainStatus(cycle.score.strain)}
          </div>
          <p className="text-sm text-[#085983]/70 mt-3 max-w-md">
            {getStrainDescription(cycle.score.strain)}
          </p>
        </div>
      </div>

      {/* Daily Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Cycle Timeline
          </h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-[#085983]/60 mb-2">
            <span>Cycle Start</span>
            <span>Duration</span>
            <span>Cycle End</span>
          </div>
          <div className="flex items-center justify-between font-medium text-[#085983]">
            <span>{formatTime(cycle.start)}</span>
            <span>{formatDuration(cycle.start, cycle.end)}</span>
            <span>{formatTime(cycle.end)}</span>
          </div>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 align-middle">
          <IconHeart className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <div className="text-sm text-[#085983] tracking-wider">Avg HR</div>
          <div className="font-semibold text-[#085983]">
            {cycle.score.average_heart_rate}
          </div>
          <div
            className={cn(
              "text-xs font-medium border px-2 py-1 rounded-full border-[#085983]/20",
              heartRateZone.color
            )}
          >
            {heartRateZone.zone}
          </div>
        </div>

        <div className="flex items-center gap-2 align-middle">
          <IconBoltFilled className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <div className="text-sm text-[#085983] tracking-wider">Max HR</div>
          <div className="font-semibold text-[#085983]">
            {cycle.score.max_heart_rate}
          </div>
          <div className="text-xs font-medium text-[#085983]/80 border px-2 py-1 rounded-full border-[#085983]/20">
            Peak
          </div>
        </div>

        <div className="flex items-center gap-2 align-middle">
          <IconFlame className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <div className="text-sm text-[#085983] tracking-wider">
            Energy (kJ)
          </div>
          <div className="font-semibold text-[#085983]">
            {Math.round(cycle.score.kilojoule)}
          </div>
          <div className="text-xs font-medium text-[#085983]/80 border px-2 py-1 rounded-full border-[#085983]/20">
            Total
          </div>
        </div>

        <div className="flex items-center gap-2 align-middle">
          <IconBarbell className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <div className="text-sm text-[#085983] tracking-wider">Calories</div>
          <div className="font-semibold text-[#085983]">
            {Math.round(cycle.score.kilojoule / 4.184)}
          </div>
          <div className="text-xs font-medium text-[#085983]/80 border px-2 py-1 rounded-full border-[#085983]/20">
            Est.
          </div>
        </div>
      </div>

      {/* Heart Rate Analysis */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Heart Rate Analysis
          </h2>
        </div>

        <div className="grid gap-4">
          {/* Training Zone */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconGauge className="size-5 text-[#085983]" />
              <h3 className="font-medium text-[#085983]">Training Zone</h3>
            </div>
            <p className="text-sm text-[#085983]/70">
              Your average heart rate of {cycle.score.average_heart_rate} BPM
              puts you in{" "}
              <span className={cn("font-medium", heartRateZone.color)}>
                {heartRateZone.zone}
              </span>{" "}
              - {heartRateZone.desc.toLowerCase()}. This indicates{" "}
              {cycle.score.average_heart_rate >= 150
                ? "high-intensity training with significant cardiovascular stress."
                : cycle.score.average_heart_rate >= 120
                ? "moderate-intensity exercise good for fitness improvements."
                : "light activity suitable for recovery and base building."}
            </p>
          </div>

          {/* Heart Rate Reserve */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconTrendingUp className="size-5 text-[#085983]" />
              <h3 className="font-medium text-[#085983]">Heart Rate Reserve</h3>
            </div>
            <p className="text-sm text-[#085983]/70">
              Peak heart rate reached {cycle.score.max_heart_rate} BPM. The
              difference between your average ({cycle.score.average_heart_rate})
              and max ({cycle.score.max_heart_rate}) heart rate shows{" "}
              {cycle.score.max_heart_rate - cycle.score.average_heart_rate > 40
                ? "good heart rate variability during activity, indicating varied intensity levels."
                : "consistent effort throughout the activity period."}
            </p>
          </div>
        </div>
      </div>

      {/* Energy Expenditure */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Energy Expenditure
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#085983]/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#085983]">
                Total Energy
              </span>
              <span className="text-lg font-bold text-[#085983]">
                {Math.round(cycle.score.kilojoule)} kJ
              </span>
            </div>
            <div className="text-xs text-[#085983]/60">
              ~{Math.round(cycle.score.kilojoule / 4.184)} calories burned
            </div>
          </div>

          <div className="border border-[#085983]/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#085983]">
                Energy Rate
              </span>
              <span className="text-lg font-bold text-[#085983]">
                {Math.round(
                  cycle.score.kilojoule /
                    ((new Date(cycle.end).getTime() -
                      new Date(cycle.start).getTime()) /
                      (1000 * 60 * 60))
                )}{" "}
                kJ/h
              </span>
            </div>
            <div className="text-xs text-[#085983]/60">
              Average energy expenditure rate
            </div>
          </div>
        </div>
      </div>

      {/* Strain Insights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Strain Insights
          </h2>
        </div>

        <div className="grid gap-3">
          {cycle.score.strain >= 16 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <h3 className="font-medium text-red-800 mb-1">High Strain Day</h3>
              <p className="text-sm text-red-700">
                Very demanding day. Prioritize recovery with quality sleep,
                hydration, and nutrition.
              </p>
            </div>
          )}

          {cycle.score.strain >= 10 && cycle.score.strain < 16 && (
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <h3 className="font-medium text-orange-800 mb-1">
                Moderate-High Strain
              </h3>
              <p className="text-sm text-orange-700">
                Good training intensity. Monitor recovery metrics for
                tomorrow&apos;s training decisions.
              </p>
            </div>
          )}

          {cycle.score.strain >= 7 && cycle.score.strain < 10 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 className="font-medium text-yellow-800 mb-1">
                Moderate Strain
              </h3>
              <p className="text-sm text-yellow-700">
                Balanced activity level. Good foundation for building fitness
                while managing fatigue.
              </p>
            </div>
          )}

          {cycle.score.strain < 7 && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <h3 className="font-medium text-green-800 mb-1">Low Strain</h3>
              <p className="text-sm text-green-700">
                Light activity day. Perfect for active recovery or building
                aerobic base.
              </p>
            </div>
          )}

          <div className="bg-blue-50 border-l-4 border-blue-200 p-4">
            <h3 className="font-medium text-[#085983] mb-1">
              Training Recommendation
            </h3>
            <p className="text-sm text-[#085983]/80">
              {cycle.score.strain >= 16
                ? "Focus on recovery activities like stretching, meditation, or light walking."
                : cycle.score.strain >= 10
                ? "Consider light to moderate activity tomorrow, depending on recovery."
                : cycle.score.strain >= 7
                ? "You can maintain this intensity or increase if recovery allows."
                : "You have capacity for higher intensity training if desired."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
