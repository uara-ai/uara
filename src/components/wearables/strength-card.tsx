"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconBarbell,
  IconClock,
  IconHeartbeat,
  IconFlame,
  IconTarget,
  IconTrendingUp,
  IconRepeat,
  IconStretching2,
} from "@tabler/icons-react";
import { StrengthCardProps } from "./types";
import { cn } from "@/lib/utils";

export function StrengthCard({
  data,
  showDetails = false,
  className,
}: StrengthCardProps) {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatRestTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
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

  const getEquipmentIcon = (equipmentType: string) => {
    switch (equipmentType) {
      case "barbell":
        return "🏋️";
      case "dumbbell":
        return "💪";
      case "machine":
        return "⚙️";
      case "bodyweight":
        return "🤸";
      case "cable":
        return "🔗";
      default:
        return "💪";
    }
  };

  const getMuscleGroupColor = (muscleGroup: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];
    const index = muscleGroup.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const topExercises = data.exercises
    .slice()
    .sort((a, b) => {
      const aVolume = a.sets.reduce(
        (sum, set) => sum + set.weight * set.reps,
        0
      );
      const bVolume = b.sets.reduce(
        (sum, set) => sum + set.weight * set.reps,
        0
      );
      return bVolume - aVolume;
    })
    .slice(0, 3);

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
              <IconBarbell className="h-5 w-5 text-[#085983]" />
            </div>
            <CardTitle className="text-lg font-[family-name:var(--font-instrument-serif)] text-[#085983]">
              Strength Training
            </CardTitle>
          </div>
          <Badge variant="outline" className={getQualityColor(data.quality)}>
            {data.quality}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-[#085983]">
            {data.totalVolume.toLocaleString()} kg
          </div>
          <div className="text-sm text-[#085983]/70">total volume</div>
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
            <IconTarget className="h-4 w-4 text-green-500" />
            <span className="text-[#085983]/70">Sets:</span>
            <span className="font-medium text-[#085983]">{data.totalSets}</span>
          </div>
          <div className="flex items-center gap-2">
            <IconRepeat className="h-4 w-4 text-purple-500" />
            <span className="text-[#085983]/70">Reps:</span>
            <span className="font-medium text-[#085983]">{data.totalReps}</span>
          </div>
        </div>

        {/* Heart rate and rest */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <IconHeartbeat className="h-4 w-4 text-red-500" />
            <span className="text-[#085983]/70">Avg HR:</span>
            <span className="font-medium text-[#085983]">
              {data.averageHeartRate} bpm
            </span>
          </div>
          <div className="flex items-center gap-2">
            <IconClock className="h-4 w-4 text-gray-500" />
            <span className="text-[#085983]/70">Avg Rest:</span>
            <span className="font-medium text-[#085983]">
              {formatRestTime(data.restTime)}
            </span>
          </div>
        </div>

        {/* Muscle groups */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <IconStretching2 className="h-4 w-4 text-[#085983]/70" />
            <span className="text-sm text-[#085983]/70">Muscle Groups:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {data.muscleGroups.map((group) => (
              <Badge
                key={group}
                variant="outline"
                className={cn("text-xs", getMuscleGroupColor(group))}
              >
                {group}
              </Badge>
            ))}
          </div>
        </div>

        {showDetails && (
          <>
            {/* Top exercises */}
            <div className="pt-2 border-t border-[#085983]/10">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[#085983] flex items-center gap-2">
                  <IconTrendingUp className="h-4 w-4" />
                  Top Exercises
                </h4>
                <div className="space-y-2">
                  {topExercises.map((exercise, index) => {
                    const totalVolume = exercise.sets.reduce(
                      (sum, set) => sum + set.weight * set.reps,
                      0
                    );
                    const maxWeight = Math.max(
                      ...exercise.sets.map((set) => set.weight)
                    );

                    return (
                      <div
                        key={exercise.name}
                        className="flex items-center justify-between p-2 bg-[#085983]/5 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getEquipmentIcon(exercise.equipmentType)}
                          </span>
                          <div>
                            <div className="text-sm font-medium text-[#085983]">
                              {exercise.name}
                            </div>
                            <div className="text-xs text-[#085983]/70">
                              {exercise.sets.length} sets • Max: {maxWeight}kg
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-[#085983]">
                            {totalVolume.toLocaleString()}kg
                          </div>
                          <div className="text-xs text-[#085983]/70">
                            volume
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Exercise breakdown */}
            <div className="pt-2 border-t border-[#085983]/10">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <IconTarget className="h-4 w-4 text-[#085983]/60" />
                  <span className="text-[#085983]/70">Exercises:</span>
                  <span className="font-medium text-[#085983]">
                    {data.exercises.length}
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
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Cursor rules applied correctly.
