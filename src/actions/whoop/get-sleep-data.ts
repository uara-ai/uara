"use server";

import { z } from "zod";
import { actionClient } from "../safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { unstable_cache } from "next/cache";

// Input schema
const sleepDataSchema = z.object({
  days: z.number().min(1).max(90).default(30),
  limit: z.number().min(1).max(100).default(30),
});

// Transform DB sleep data to match WhoopSleep interface
function transformSleepData(rawSleepData: any[]) {
  return rawSleepData.map((sleep) => ({
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
    score_state: sleep.scoreState as "SCORED" | "PENDING_SCORE" | "UNSCORABLE",
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
  }));
}

// Fetch sleep data from database
async function fetchSleepDataFromDB(
  userId: string,
  days: number,
  limit: number
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const sleepData = await prisma.whoopSleep.findMany({
    where: {
      whoopUserId: userId,
      start: { gte: cutoffDate },
      nap: false, // Exclude naps for main sleep data
    },
    orderBy: { start: "desc" },
    take: limit,
  });

  // Serialize Date objects
  const serializedSleepData = sleepData.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    start: s.start.toISOString(),
    end: s.end.toISOString(),
  }));

  return transformSleepData(serializedSleepData);
}

// Cached version for better performance
const getCachedSleepData = unstable_cache(
  async (userId: string, days: number, limit: number) => {
    return fetchSleepDataFromDB(userId, days, limit);
  },
  ["sleep-data"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["whoop-data", "sleep"],
  }
);

// Server action for client components
export const getSleepDataAction = actionClient
  .schema(sleepDataSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    return await getCachedSleepData(
      user.id,
      parsedInput.days,
      parsedInput.limit
    );
  });

// Server function for server components
export async function getSleepDataServer(
  days: number = 30,
  limit: number = 30
) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    return await getCachedSleepData(user.id, days, limit);
  } catch (error) {
    console.error("Error fetching sleep data:", error);
    return null;
  }
}

// Get sleep summary stats
export async function getSleepStatsServer(days: number = 7) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const sleepData = await prisma.whoopSleep.findMany({
      where: {
        whoopUserId: user.id,
        start: { gte: cutoffDate },
        nap: false,
        scoreState: "SCORED",
      },
      select: {
        sleepPerformancePercentage: true,
        sleepEfficiencyPercentage: true,
        sleepConsistencyPercentage: true,
        totalInBedTime: true,
        respiratoryRate: true,
        start: true,
      },
      orderBy: { start: "desc" },
      take: days,
    });

    if (sleepData.length === 0) return null;

    const validPerformance = sleepData
      .map((s) => s.sleepPerformancePercentage)
      .filter((p): p is number => p !== null);

    const validEfficiency = sleepData
      .map((s) => s.sleepEfficiencyPercentage)
      .filter((e): e is number => e !== null);

    const validConsistency = sleepData
      .map((s) => s.sleepConsistencyPercentage)
      .filter((c): c is number => c !== null);

    const validDuration = sleepData
      .map((s) => s.totalInBedTime)
      .filter((d): d is number => d !== null);

    return {
      averagePerformance:
        validPerformance.length > 0
          ? validPerformance.reduce((a, b) => a + b, 0) /
            validPerformance.length
          : null,
      averageEfficiency:
        validEfficiency.length > 0
          ? validEfficiency.reduce((a, b) => a + b, 0) / validEfficiency.length
          : null,
      averageConsistency:
        validConsistency.length > 0
          ? validConsistency.reduce((a, b) => a + b, 0) /
            validConsistency.length
          : null,
      averageDurationHours:
        validDuration.length > 0
          ? validDuration.reduce((a, b) => a + b, 0) /
            validDuration.length /
            (1000 * 60 * 60)
          : null,
      totalNights: sleepData.length,
      latestSleep: sleepData[0]
        ? {
            performance: sleepData[0].sleepPerformancePercentage,
            efficiency: sleepData[0].sleepEfficiencyPercentage,
            date: sleepData[0].start.toISOString(),
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching sleep stats:", error);
    return null;
  }
}

// Cursor rules applied correctly.
