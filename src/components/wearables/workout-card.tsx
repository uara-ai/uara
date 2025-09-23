"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  IconRun,
  IconClock,
  IconHeartbeat,
  IconFlame,
  IconMapPin,
  IconMountain,
  IconActivity,
  IconTarget,
} from "@tabler/icons-react";
import { WorkoutCardProps } from "./types";
import { cn } from "@/lib/utils";

export function WorkoutCard({
  data,
  showDetails = false,
  className,
}: WorkoutCardProps) {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${meters} m`;
  };

  const formatPace = (secondsPerKm: number): string => {
    const minutes = Math.floor(secondsPerKm / 60);
    const seconds = secondsPerKm % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}/km`;
  };

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

  const getStrainColor = (strain: number) => {
    if (strain >= 18) return "text-red-600";
    if (strain >= 14) return "text-orange-600";
    if (strain >= 10) return "text-yellow-600";
    if (strain >= 6) return "text-green-600";
    return "text-blue-600";
  };

  const getActivityIcon = (activityType: string) => {
    const type = activityType.toLowerCase();
    if (type.includes("run") || type.includes("jog")) return IconRun;
    if (type.includes("cycling") || type.includes("bike")) return IconTarget;
    return IconActivity;
  };

  const ActivityIcon = getActivityIcon(data.activityType);

  const totalZoneTime = Object.values(data.zones).reduce(
    (sum, time) => sum + time,
    0
  );

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
              <ActivityIcon className="h-5 w-5 text-[#085983]" />
            </div>
            <CardTitle className="text-lg font-[family-name:var(--font-instrument-serif)] text-[#085983]">
              {data.activityType}
            </CardTitle>
          </div>
          <Badge variant="outline" className={getQualityColor(data.quality)}>
            {data.quality}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={cn("text-2xl font-bold", getStrainColor(data.strain))}
          >
            {data.strain.toFixed(1)}
          </div>
          <div className="text-sm text-[#085983]/70">strain</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <IconClock className="h-4 w-4 text-blue-500" />
            <span className="text-[#085983]/70">Duration:</span>
            <span className="font-medium text-[#085983]">
              {formatDuration(data.duration)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconFlame className="h-4 w-4 text-orange-500" />
            <span className="text-[#085983]/70">Calories:</span>
            <span className="font-medium text-[#085983]">
              {data.calories} kcal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconHeartbeat className="h-4 w-4 text-red-500" />
            <span className="text-[#085983]/70">Avg HR:</span>
            <span className="font-medium text-[#085983]">
              {data.averageHeartRate} bpm
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconHeartbeat className="h-4 w-4 text-red-600" />
            <span className="text-[#085983]/70">Max HR:</span>
            <span className="font-medium text-[#085983]">
              {data.maxHeartRate} bpm
            </span>
          </div>
        </div>

        {/* Distance and pace (if available) */}
        {data.distance && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <IconMapPin className="h-4 w-4 text-green-500" />
              <span className="text-[#085983]/70">Distance:</span>
              <span className="font-medium text-[#085983]">
                {formatDistance(data.distance)}
              </span>
            </div>
            {data.averagePace && (
              <div className="flex items-center gap-2">
                <IconTarget className="h-4 w-4 text-purple-500" />
                <span className="text-[#085983]/70">Pace:</span>
                <span className="font-medium text-[#085983]">
                  {formatPace(data.averagePace)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Altitude (if available) */}
        {data.altitudeGain && data.altitudeGain > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <IconMountain className="h-4 w-4 text-gray-500" />
            <span className="text-[#085983]/70">Elevation:</span>
            <span className="font-medium text-[#085983]">
              +{data.altitudeGain}m
            </span>
          </div>
        )}

        {showDetails && (
          <>
            {/* Heart rate zones */}
            <div className="pt-2 border-t border-[#085983]/10">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#085983]">
                  Heart Rate Zones
                </h4>
                <div className="space-y-2">
                  {Object.entries(data.zones).map(([zone, minutes], index) => {
                    const percentage =
                      totalZoneTime > 0 ? (minutes / totalZoneTime) * 100 : 0;
                    const zoneColors = [
                      "bg-gray-400", // zone1
                      "bg-blue-400", // zone2
                      "bg-green-400", // zone3
                      "bg-yellow-400", // zone4
                      "bg-red-400", // zone5
                    ];

                    return (
                      minutes > 0 && (
                        <div
                          key={zone}
                          className="flex items-center gap-2 text-xs"
                        >
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full",
                              zoneColors[index]
                            )}
                          ></div>
                          <span className="text-[#085983]/70 min-w-12">
                            Zone {index + 1}:
                          </span>
                          <div className="flex-1 flex items-center gap-2">
                            <Progress
                              value={percentage}
                              className="h-1 flex-1"
                            />
                            <span className="text-[#085983] font-medium min-w-8">
                              {formatDuration(minutes)}
                            </span>
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Workout times */}
            <div className="pt-2 border-t border-[#085983]/10">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <IconClock className="h-4 w-4 text-[#085983]/60" />
                  <span className="text-[#085983]/70">Started:</span>
                  <span className="font-medium text-[#085983]">
                    {data.startTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconClock className="h-4 w-4 text-[#085983]/60" />
                  <span className="text-[#085983]/70">Ended:</span>
                  <span className="font-medium text-[#085983]">
                    {data.endTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Cursor rules applied correctly.
