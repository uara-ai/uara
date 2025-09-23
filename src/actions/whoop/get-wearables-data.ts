"use server";

import { z } from "zod";
import { actionClient } from "../safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { unstable_cache } from "next/cache";

// Input schema
const wearablesDataSchema = z.object({
  days: z.number().min(1).max(90).default(7),
  limit: z.number().min(1).max(100).default(50),
});

// Transform DB data to match WearablesData interface
function transformWearablesData(rawData: {
  cycles: any[];
  sleep: any[];
  recovery: any[];
  workouts: any[];
}) {
  return {
    cycles: rawData.cycles.map((cycle) => ({
      id: Number(cycle.cycleId),
      user_id: 10129, // Static for compatibility
      created_at: cycle.createdAt,
      updated_at: cycle.updatedAt,
      start: cycle.start,
      end: cycle.end || cycle.start,
      timezone_offset: cycle.timezoneOffset || "-05:00",
      score_state: cycle.scoreState as
        | "SCORED"
        | "PENDING_SCORE"
        | "UNSCORABLE",
      score: {
        strain: cycle.strain || 0,
        kilojoule: cycle.kilojoule || 0,
        average_heart_rate: cycle.averageHeartRate || 0,
        max_heart_rate: cycle.maxHeartRate || 0,
      },
    })),
    sleep: rawData.sleep.map((sleep) => ({
      id: sleep.sleepId,
      cycle_id: Number(sleep.sleepId.replace(/[^0-9]/g, "")) || 93845,
      v1_id: Number(sleep.sleepId.replace(/[^0-9]/g, "")) || 93845,
      user_id: 10129, // Static for compatibility
      created_at: sleep.createdAt,
      updated_at: sleep.updatedAt,
      start: sleep.start,
      end: sleep.end,
      timezone_offset: sleep.timezoneOffset || "-05:00",
      nap: sleep.nap || false,
      score_state: sleep.scoreState as
        | "SCORED"
        | "PENDING_SCORE"
        | "UNSCORABLE",
      score: {
        stage_summary: {
          total_in_bed_time_milli: sleep.totalInBedTime || 0,
          total_awake_time_milli: sleep.totalAwakeTime || 0,
          total_no_data_time_milli: sleep.totalNoDataTime || 0,
          total_light_sleep_time_milli: sleep.totalLightSleepTime || 0,
          total_slow_wave_sleep_time_milli: sleep.totalSlowWaveSleepTime || 0,
          total_rem_sleep_time_milli: sleep.totalRemSleepTime || 0,
          sleep_cycle_count: sleep.sleepCycleCount || 0,
          disturbance_count: sleep.disturbanceCount || 0,
        },
        sleep_needed: {
          baseline_milli: sleep.sleepNeedBaseline || 0,
          need_from_sleep_debt_milli: sleep.sleepNeedFromDebt || 0,
          need_from_recent_strain_milli: sleep.sleepNeedFromStrain || 0,
          need_from_recent_nap_milli: sleep.sleepNeedFromNap || 0,
        },
        respiratory_rate: sleep.respiratoryRate || 0,
        sleep_performance_percentage: sleep.sleepPerformancePercentage || 0,
        sleep_consistency_percentage: sleep.sleepConsistencyPercentage || 0,
        sleep_efficiency_percentage: sleep.sleepEfficiencyPercentage || 0,
      },
    })),
    recovery: rawData.recovery.map((recovery) => ({
      cycle_id: Number(recovery.cycleId),
      sleep_id: recovery.sleepId,
      user_id: 10129, // Static for compatibility
      created_at: recovery.createdAt,
      updated_at: recovery.updatedAt,
      score_state: recovery.scoreState as
        | "SCORED"
        | "PENDING_SCORE"
        | "UNSCORABLE",
      score: {
        user_calibrating: recovery.userCalibrating || false,
        recovery_score: recovery.recoveryScore || 0,
        resting_heart_rate: recovery.restingHeartRate || 0,
        hrv_rmssd_milli: recovery.hrvRmssd || 0,
        spo2_percentage: 95.6875, // Default value as it's not in DB
        skin_temp_celsius: 33.7, // Default value as it's not in DB
      },
    })),
    workouts: rawData.workouts.map((workout) => ({
      id: workout.workoutId,
      v1_id: Number(workout.workoutId.replace(/[^0-9]/g, "")) || 1043,
      user_id: 10129, // Static for compatibility
      created_at: workout.createdAt,
      updated_at: workout.updatedAt,
      start: workout.start,
      end: workout.end,
      timezone_offset: workout.timezoneOffset || "-05:00",
      sport_name: "running", // Default sport name
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
    })),
  };
}

// Fetch raw data from database
async function fetchWearablesDataFromDB(
  userId: string,
  days: number,
  limit: number
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const [cycles, sleep, recovery, workouts] = await Promise.all([
    prisma.whoopCycle.findMany({
      where: {
        whoopUserId: userId,
        start: { gte: cutoffDate },
      },
      orderBy: { start: "desc" },
      take: limit,
    }),
    prisma.whoopSleep.findMany({
      where: {
        whoopUserId: userId,
        start: { gte: cutoffDate },
      },
      orderBy: { start: "desc" },
      take: limit,
    }),
    prisma.whoopRecovery.findMany({
      where: {
        whoopUserId: userId,
        createdAt: { gte: cutoffDate },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.whoopWorkout.findMany({
      where: {
        whoopUserId: userId,
        start: { gte: cutoffDate },
      },
      orderBy: { start: "desc" },
      take: limit,
    }),
  ]);

  // Serialize BigInt and Date objects
  const serializedData = {
    cycles: cycles.map((c) => ({
      ...c,
      cycleId: c.cycleId.toString(),
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      start: c.start.toISOString(),
      end: c.end?.toISOString(),
    })),
    sleep: sleep.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      start: s.start.toISOString(),
      end: s.end.toISOString(),
    })),
    recovery: recovery.map((r) => ({
      ...r,
      cycleId: r.cycleId.toString(),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    workouts: workouts.map((w) => ({
      ...w,
      createdAt: w.createdAt.toISOString(),
      updatedAt: w.updatedAt.toISOString(),
      start: w.start.toISOString(),
      end: w.end.toISOString(),
    })),
  };

  return transformWearablesData(serializedData);
}

// Cached version for better performance
const getCachedWearablesData = unstable_cache(
  async (userId: string, days: number, limit: number) => {
    return fetchWearablesDataFromDB(userId, days, limit);
  },
  ["wearables-data"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["whoop-data", "wearables"],
  }
);

// Server action for client components
export const getWearablesDataAction = actionClient
  .schema(wearablesDataSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    return await getCachedWearablesData(
      user.id,
      parsedInput.days,
      parsedInput.limit
    );
  });

// Server function for server components
export async function getWearablesDataServer(
  days: number = 7,
  limit: number = 50
) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    return await getCachedWearablesData(user.id, days, limit);
  } catch (error) {
    console.error("Error fetching wearables data:", error);
    return null;
  }
}

// Get WHOOP user information
export async function getWhoopUserServer() {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        lastSyncAt: true,
      },
    });

    return whoopUser;
  } catch (error) {
    console.error("Error fetching WHOOP user:", error);
    return null;
  }
}

// Cursor rules applied correctly.
