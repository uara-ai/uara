"use server";

import { z } from "zod";
import { actionClient } from "../safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { unstable_cache } from "next/cache";

// Input schema
const workoutDataSchema = z.object({
  days: z.number().min(1).max(90).default(30),
  limit: z.number().min(1).max(100).default(30),
});

// Transform DB workout data to match WhoopWorkout interface
function transformWorkoutData(rawWorkoutData: any[]) {
  return rawWorkoutData.map((workout) => ({
    id: workout.workoutId,
    v1_id: Number(workout.workoutId.replace(/[^0-9]/g, "")) || 1043,
    user_id: 10129, // Static for compatibility
    created_at: workout.createdAt,
    updated_at: workout.updatedAt,
    start: workout.start,
    end: workout.end,
    timezone_offset: workout.timezoneOffset || "-05:00",
    sport_name: workout.sportName || "running",
    score_state: workout.scoreState as
      | "SCORED"
      | "PENDING_SCORE"
      | "UNSCORABLE",
    score: {
      strain: workout.strain || 0,
      average_heart_rate: workout.averageHeartRate || 0,
      max_heart_rate: workout.maxHeartRate || 0,
      kilojoule: workout.kilojoule || 0,
      percent_recorded: workout.percentRecorded || 100,
      distance_meter: workout.distanceMeters || 0,
      altitude_gain_meter: workout.altitudeGainMeters || 0,
      altitude_change_meter: workout.altitudeChangeMeters || 0,
      zone_durations: {
        zone_zero_milli: workout.zoneZeroDuration || 0,
        zone_one_milli: workout.zoneOneDuration || 0,
        zone_two_milli: workout.zoneTwoDuration || 0,
        zone_three_milli: workout.zoneThreeDuration || 0,
        zone_four_milli: workout.zoneFourDuration || 0,
        zone_five_milli: workout.zoneFiveDuration || 0,
      },
    },
    sport_id: workout.sportId || 1,
  }));
}

// Fetch workout data from database
async function fetchWorkoutDataFromDB(
  userId: string,
  days: number,
  limit: number
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const workoutData = await prisma.whoopWorkout.findMany({
    where: {
      whoopUserId: userId,
      start: { gte: cutoffDate },
      scoreState: "SCORED", // Only include scored workout data
    },
    orderBy: { start: "desc" },
    take: limit,
  });

  // Serialize Date objects
  const serializedWorkoutData = workoutData.map((w) => ({
    ...w,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
    start: w.start.toISOString(),
    end: w.end.toISOString(),
    workoutId: w.workoutId,
    timezoneOffset: w.timezoneOffset,
    sportName: w.sportName,
    scoreState: w.scoreState,
    strain: w.strain,
    averageHeartRate: w.averageHeartRate,
    maxHeartRate: w.maxHeartRate,
    kilojoule: w.kilojoule,
    percentRecorded: w.percentRecorded,
    distanceMeters: w.distanceMeters,
    altitudeGainMeters: w.altitudeGainMeters,
    altitudeChangeMeters: w.altitudeChangeMeters,
    zoneZeroDuration: w.zoneZeroDuration,
    zoneOneDuration: w.zoneOneDuration,
    zoneTwoDuration: w.zoneTwoDuration,
    zoneThreeDuration: w.zoneThreeDuration,
    zoneFourDuration: w.zoneFourDuration,
    zoneFiveDuration: w.zoneFiveDuration,
    sportId: w.sportId,
  }));

  return transformWorkoutData(serializedWorkoutData);
}

// Cached version for better performance
const getCachedWorkoutData = unstable_cache(
  async (userId: string, days: number, limit: number) => {
    return fetchWorkoutDataFromDB(userId, days, limit);
  },
  ["workout-data"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["whoop-data", "workouts"],
  }
);

// Server action for client components
export const getWorkoutDataAction = actionClient
  .schema(workoutDataSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    return await getCachedWorkoutData(
      user.id,
      parsedInput.days,
      parsedInput.limit
    );
  });

// Server function for server components
export async function getWorkoutDataServer(
  days: number = 30,
  limit: number = 30
) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    return await getCachedWorkoutData(user.id, days, limit);
  } catch (error) {
    console.error("Error fetching workout data:", error);
    return null;
  }
}

// Get workout summary stats
export async function getWorkoutStatsServer(days: number = 7) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const workoutData = await prisma.whoopWorkout.findMany({
      where: {
        whoopUserId: user.id,
        start: { gte: cutoffDate },
        scoreState: "SCORED",
      },
      select: {
        strain: true,
        averageHeartRate: true,
        maxHeartRate: true,
        kilojoule: true,
        distanceMeters: true,
        altitudeGainMeters: true,
        sportName: true,
        start: true,
        end: true,
      },
      orderBy: { start: "desc" },
      take: days * 2, // Get more workouts since some days might have multiple
    });

    if (workoutData.length === 0) return null;

    const validStrain = workoutData
      .map((w) => w.strain)
      .filter((s): s is number => s !== null);

    const validAvgHr = workoutData
      .map((w) => w.averageHeartRate)
      .filter((hr): hr is number => hr !== null);

    const validMaxHr = workoutData
      .map((w) => w.maxHeartRate)
      .filter((hr): hr is number => hr !== null);

    const validKilojoules = workoutData
      .map((w) => w.kilojoule)
      .filter((kj): kj is number => kj !== null);

    const validDistance = workoutData
      .map((w) => w.distanceMeters)
      .filter((d): d is number => d !== null && d > 0);

    const totalDuration = workoutData.reduce((total, workout) => {
      const duration =
        new Date(workout.end).getTime() - new Date(workout.start).getTime();
      return total + duration;
    }, 0);

    return {
      averageStrain:
        validStrain.length > 0
          ? validStrain.reduce((a, b) => a + b, 0) / validStrain.length
          : null,
      averageHeartRate:
        validAvgHr.length > 0
          ? validAvgHr.reduce((a, b) => a + b, 0) / validAvgHr.length
          : null,
      averageMaxHeartRate:
        validMaxHr.length > 0
          ? validMaxHr.reduce((a, b) => a + b, 0) / validMaxHr.length
          : null,
      totalKilojoules:
        validKilojoules.length > 0
          ? validKilojoules.reduce((a, b) => a + b, 0)
          : null,
      totalDistance:
        validDistance.length > 0
          ? validDistance.reduce((a, b) => a + b, 0)
          : null,
      totalDurationHours: totalDuration / (1000 * 60 * 60),
      totalWorkouts: workoutData.length,
      latestWorkout: workoutData[0]
        ? {
            strain: workoutData[0].strain,
            averageHeartRate: workoutData[0].averageHeartRate,
            maxHeartRate: workoutData[0].maxHeartRate,
            sportName: workoutData[0].sportName,
            date: workoutData[0].start.toISOString(),
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching workout stats:", error);
    return null;
  }
}

// Cursor rules applied correctly.
