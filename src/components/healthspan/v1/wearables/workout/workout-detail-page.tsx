"use client";

import React from "react";
import { WhoopWorkout } from "../types";
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
  IconTrophy,
  IconMountain,
  IconRuler,
} from "@tabler/icons-react";
import Link from "next/link";

interface WorkoutDetailPageProps {
  workoutData: WhoopWorkout[];
  className?: string;
}

export function WorkoutDetailPage({
  workoutData,
  className,
}: WorkoutDetailPageProps) {
  // Show only the latest/first workout
  const workout = workoutData[0];

  if (!workout) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 font-[family-name:var(--font-geist-sans)]">
          No workout data available
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
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDistance = (meters: number) => {
    if (meters === 0) return "N/A";
    const km = meters / 1000;
    return km >= 1 ? `${km.toFixed(2)} km` : `${meters.toFixed(0)} m`;
  };

  const formatAltitude = (meters: number) => {
    if (meters === 0) return "N/A";
    return `${meters.toFixed(0)} m`;
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
    if (strain >= 16) return "Very High Intensity";
    if (strain >= 10) return "High Intensity";
    if (strain >= 7) return "Moderate Intensity";
    return "Low Intensity";
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
    workout.score.average_heart_rate,
    workout.score.max_heart_rate
  );

  const totalZoneDuration =
    workout.score.zone_durations.zone_zero_milli +
    workout.score.zone_durations.zone_one_milli +
    workout.score.zone_durations.zone_two_milli +
    workout.score.zone_durations.zone_three_milli +
    workout.score.zone_durations.zone_four_milli +
    workout.score.zone_durations.zone_five_milli;

  const getZonePercentage = (zoneDuration: number) => {
    if (totalZoneDuration === 0) return 0;
    return ((zoneDuration / totalZoneDuration) * 100).toFixed(1);
  };

  const formatZoneDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return minutes > 0
      ? `${minutes}:${seconds.toString().padStart(2, "0")}`
      : `${seconds}s`;
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
              {workout.sport_name
                ? `${
                    workout.sport_name.charAt(0).toUpperCase() +
                    workout.sport_name.slice(1)
                  } Workout`
                : "Workout Analysis"}
            </h1>
            <p className="text-[#085983]/60 text-sm mt-1">
              {formatDate(workout.start)} •{" "}
              {formatDuration(workout.start, workout.end)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Strain Score */}
      <div className="flex justify-center">
        <div className="text-center">
          {/* Sport Badge */}
          {workout.sport_name && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#085983]/10 text-[#085983] text-sm font-medium rounded-full">
                <IconActivity className="size-4" />
                {workout.sport_name.charAt(0).toUpperCase() +
                  workout.sport_name.slice(1)}
              </span>
            </div>
          )}
          <div
            className={cn(
              "text-6xl font-bold mb-2",
              getStrainColor(workout.score.strain)
            )}
          >
            {workout.score.strain.toFixed(1)}
          </div>
          <div
            className={cn(
              "text-sm font-medium px-4 py-2 rounded-full",
              getStrainBgColor(workout.score.strain),
              getStrainColor(workout.score.strain)
            )}
          >
            {getStrainStatus(workout.score.strain)}
          </div>
          <p className="text-sm text-[#085983]/70 mt-3 max-w-md">
            {workout.score.percent_recorded.toFixed(1)}% of workout recorded
          </p>
        </div>
      </div>

      {/* Workout Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Workout Timeline
          </h2>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-[#085983]/60 mb-2">
            <span>Start Time</span>
            <span>Duration</span>
            <span>End Time</span>
          </div>
          <div className="flex items-center justify-between font-medium text-[#085983]">
            <span>{formatTime(workout.start)}</span>
            <span>{formatDuration(workout.start, workout.end)}</span>
            <span>{formatTime(workout.end)}</span>
          </div>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 align-middle">
          <IconHeart className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <div className="text-sm text-[#085983] tracking-wider">Avg HR</div>
          <div className="font-semibold text-[#085983]">
            {workout.score.average_heart_rate}
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
            {workout.score.max_heart_rate}
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
            {Math.round(workout.score.kilojoule)}
          </div>
          <div className="text-xs font-medium text-[#085983]/80 border px-2 py-1 rounded-full border-[#085983]/20">
            Total
          </div>
        </div>

        <div className="flex items-center gap-2 align-middle">
          <IconBarbell className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
          <div className="text-sm text-[#085983] tracking-wider">Calories</div>
          <div className="font-semibold text-[#085983]">
            {Math.round(workout.score.kilojoule / 4.184)}
          </div>
          <div className="text-xs font-medium text-[#085983]/80 border px-2 py-1 rounded-full border-[#085983]/20">
            Est.
          </div>
        </div>
      </div>

      {/* Heart Rate Zone Analysis */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Heart Rate Zone Distribution
          </h2>
        </div>

        <div className="grid gap-4">
          {/* Heart Rate Zone Segmented Chart */}
          {totalZoneDuration > 0 ? (
            <div className="flex items-center gap-1.5 w-full mb-3">
              {[
                {
                  name: "Zone 1",
                  duration: workout.score.zone_durations.zone_one_milli,
                  percent:
                    totalZoneDuration === 0
                      ? 0
                      : (workout.score.zone_durations.zone_one_milli /
                          totalZoneDuration) *
                        100,
                  color: "bg-gray-400",
                  label: "Active Recovery",
                },
                {
                  name: "Zone 2",
                  duration: workout.score.zone_durations.zone_two_milli,
                  percent:
                    totalZoneDuration === 0
                      ? 0
                      : (workout.score.zone_durations.zone_two_milli /
                          totalZoneDuration) *
                        100,
                  color: "bg-blue-400",
                  label: "Aerobic Base",
                },
                {
                  name: "Zone 3",
                  duration: workout.score.zone_durations.zone_three_milli,
                  percent:
                    totalZoneDuration === 0
                      ? 0
                      : (workout.score.zone_durations.zone_three_milli /
                          totalZoneDuration) *
                        100,
                  color: "bg-green-400",
                  label: "Aerobic",
                },
                {
                  name: "Zone 4",
                  duration: workout.score.zone_durations.zone_four_milli,
                  percent:
                    totalZoneDuration === 0
                      ? 0
                      : (workout.score.zone_durations.zone_four_milli /
                          totalZoneDuration) *
                        100,
                  color: "bg-yellow-400",
                  label: "Lactate Threshold",
                },
                {
                  name: "Zone 5",
                  duration: workout.score.zone_durations.zone_five_milli,
                  percent:
                    totalZoneDuration === 0
                      ? 0
                      : (workout.score.zone_durations.zone_five_milli /
                          totalZoneDuration) *
                        100,
                  color: "bg-red-400",
                  label: "Neuromuscular Power",
                },
              ].map((zone) => (
                <div
                  key={zone.name}
                  className="space-y-2.5"
                  style={{
                    width: `${zone.percent}%`,
                  }}
                >
                  <div
                    className={cn(
                      zone.color,
                      "h-2.5 w-full overflow-hidden rounded-sm transition-all"
                    )}
                  />
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-xs text-[#085983]/60 font-medium">
                      {zone.name}
                    </span>
                    <span className="text-base font-semibold text-[#085983]">
                      {zone.percent.toFixed(1)}%
                    </span>
                    <span className="text-xs text-[#085983]/40">
                      {formatZoneDuration(zone.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-[#085983]/60">
                No heart rate zone data available for this workout
              </p>
            </div>
          )}

          {/* Training Zone Analysis */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconGauge className="size-5 text-[#085983]" />
              <h3 className="font-medium text-[#085983]">
                Training Zone Analysis
              </h3>
            </div>
            <p className="text-sm text-[#085983]/70">
              Your average heart rate of {workout.score.average_heart_rate} BPM
              puts you in{" "}
              <span className={cn("font-medium", heartRateZone.color)}>
                {heartRateZone.zone}
              </span>{" "}
              - {heartRateZone.desc.toLowerCase()}. This indicates{" "}
              {workout.score.average_heart_rate >= 150
                ? "high-intensity training with significant cardiovascular stress."
                : workout.score.average_heart_rate >= 120
                ? "moderate-intensity exercise good for fitness improvements."
                : "light activity suitable for recovery and base building."}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Performance Metrics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#085983]/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <IconRuler className="size-5 text-[#085983]" />
                <span className="text-sm font-medium text-[#085983]">
                  Distance
                </span>
              </div>
              <span className="text-lg font-bold text-[#085983]">
                {formatDistance(workout.score.distance_meter)}
              </span>
            </div>
            <div className="text-xs text-[#085983]/60">
              Total distance covered
            </div>
          </div>

          <div className="border border-[#085983]/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <IconMountain className="size-5 text-[#085983]" />
                <span className="text-sm font-medium text-[#085983]">
                  Altitude Gain
                </span>
              </div>
              <span className="text-lg font-bold text-[#085983]">
                {formatAltitude(workout.score.altitude_gain_meter)}
              </span>
            </div>
            <div className="text-xs text-[#085983]/60">
              Total elevation gained
            </div>
          </div>
        </div>
      </div>

      {/* Workout Insights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Workout Insights
          </h2>
        </div>

        <div className="grid gap-3">
          {workout.score.strain >= 16 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <h3 className="font-medium text-red-800 mb-1">
                High Intensity Session
              </h3>
              <p className="text-sm text-red-700">
                Very demanding workout. Prioritize recovery with quality sleep,
                hydration, and nutrition.
              </p>
            </div>
          )}

          {workout.score.strain >= 10 && workout.score.strain < 16 && (
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
              <h3 className="font-medium text-orange-800 mb-1">
                Moderate-High Intensity
              </h3>
              <p className="text-sm text-orange-700">
                Good training intensity. Monitor recovery metrics for
                tomorrow&apos;s training decisions.
              </p>
            </div>
          )}

          {workout.score.strain >= 7 && workout.score.strain < 10 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 className="font-medium text-yellow-800 mb-1">
                Moderate Intensity
              </h3>
              <p className="text-sm text-yellow-700">
                Balanced training session. Good foundation for building fitness
                while managing fatigue.
              </p>
            </div>
          )}

          {workout.score.strain < 7 && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <h3 className="font-medium text-green-800 mb-1">Low Intensity</h3>
              <p className="text-sm text-green-700">
                Light training session. Perfect for active recovery or building
                aerobic base.
              </p>
            </div>
          )}

          <div className="bg-blue-50 border-l-4 border-blue-200 p-4">
            <h3 className="font-medium text-[#085983] mb-1">
              Recovery Recommendation
            </h3>
            <p className="text-sm text-[#085983]/80">
              {workout.score.strain >= 16
                ? "Focus on recovery activities like stretching, meditation, or light walking."
                : workout.score.strain >= 10
                ? "Consider light to moderate activity tomorrow, depending on recovery."
                : workout.score.strain >= 7
                ? "You can maintain this intensity or increase if recovery allows."
                : "You have capacity for higher intensity training if desired."}
            </p>
          </div>

          {/* Sport-Specific Insights */}
          {workout.sport_name && (
            <div className="bg-gray-50 border-l-4 border-gray-300 p-4">
              <h3 className="font-medium text-[#085983] mb-1">
                {workout.sport_name.charAt(0).toUpperCase() +
                  workout.sport_name.slice(1)}{" "}
                Performance
              </h3>
              <p className="text-sm text-[#085983]/80">
                {workout.sport_name.toLowerCase() === "running" && (
                  <>
                    {workout.score.distance_meter > 0
                      ? `You covered ${formatDistance(
                          workout.score.distance_meter
                        )} with an average heart rate of ${
                          workout.score.average_heart_rate
                        } BPM. `
                      : ""}
                    {workout.score.strain >= 12
                      ? "High-intensity running session - great for building speed and power."
                      : workout.score.strain >= 8
                      ? "Moderate running pace - excellent for building aerobic capacity."
                      : "Easy-paced run - perfect for recovery and base building."}
                  </>
                )}
                {workout.sport_name.toLowerCase() === "cycling" && (
                  <>
                    {workout.score.distance_meter > 0
                      ? `You cycled ${formatDistance(
                          workout.score.distance_meter
                        )} `
                      : ""}
                    {workout.score.strain >= 12
                      ? "High-intensity cycling - great for building power and lactate threshold."
                      : workout.score.strain >= 8
                      ? "Solid cycling effort - good for building endurance and fitness."
                      : "Easy cycling pace - ideal for active recovery."}
                  </>
                )}
                {!["running", "cycling"].includes(
                  workout.sport_name.toLowerCase()
                ) && (
                  <>
                    Great {workout.sport_name.toLowerCase()} session!
                    {workout.score.strain >= 12
                      ? " High-intensity training that will improve your power and performance."
                      : workout.score.strain >= 8
                      ? " Solid training effort that builds fitness and endurance."
                      : " Light activity that's perfect for skill development and recovery."}
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
