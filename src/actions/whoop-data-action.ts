"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { unstable_cache } from "next/cache";

// Input schema for optional parameters
const whoopDataSchema = z.object({
  days: z.number().min(1).max(365).optional().default(30),
  limit: z.number().min(1).max(1000).optional().default(100),
});

// Types for processed WHOOP data
export interface WhoopDataResponse {
  recovery: any[];
  cycles: any[];
  sleep: any[];
  workouts: any[];
  _metadata: {
    userId: string;
    counts: {
      recovery: number;
      cycles: number;
      sleep: number;
      workouts: number;
    };
    fetchedAt: string;
    daysPeriod: number;
  };
}

export interface WhoopStats {
  latestRecovery?: {
    recoveryScore: number | null;
    restingHeartRate: number | null;
    hrvRmssd: number | null;
    date: string;
  };
  latestSleep?: {
    sleepEfficiencyPercentage: number | null;
    sleepPerformancePercentage: number | null;
    totalInBedTime: number | null;
    date: string;
  };
  weeklyStrain?: {
    averageStrain: number;
    maxStrain: number;
    totalWorkouts: number;
  };
  trends: {
    recoveryTrend: "up" | "down" | "stable";
    sleepTrend: "up" | "down" | "stable";
    strainTrend: "up" | "down" | "stable";
  };
}

// Core function to fetch WHOOP data from database
async function fetchWhoopDataFromDB(
  userId: string,
  days: number = 30,
  limit: number = 50 // Reduced default limit for faster queries
): Promise<WhoopDataResponse> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Fetch limited essential fields for better performance
  const [recoveryData, cyclesData, sleepData, workoutsData] = await Promise.all(
    [
      // Recovery data - only essential fields
      prisma.whoopRecovery.findMany({
        where: {
          whoopUserId: userId,
          createdAt: {
            gte: cutoffDate,
          },
        },
        select: {
          id: true,
          cycleId: true,
          sleepId: true,
          recoveryScore: true,
          restingHeartRate: true,
          hrvRmssd: true,
          userCalibrating: true,
          scoreState: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: Math.min(limit, 50), // Cap at 50 for performance
      }),

      // Cycles data - only essential fields
      prisma.whoopCycle.findMany({
        where: {
          whoopUserId: userId,
          start: {
            gte: cutoffDate,
          },
        },
        select: {
          id: true,
          cycleId: true,
          start: true,
          end: true,
          strain: true,
          averageHeartRate: true,
          maxHeartRate: true,
          kilojoule: true,
          percentRecorded: true,
          scoreState: true,
          createdAt: true,
        },
        orderBy: {
          start: "desc",
        },
        take: Math.min(limit, 50),
      }),

      // Sleep data - only essential fields
      prisma.whoopSleep.findMany({
        where: {
          whoopUserId: userId,
          start: {
            gte: cutoffDate,
          },
        },
        select: {
          id: true,
          sleepId: true,
          start: true,
          end: true,
          nap: true,
          sleepPerformancePercentage: true,
          sleepEfficiencyPercentage: true,
          sleepConsistencyPercentage: true,
          totalInBedTime: true,
          totalAwakeTime: true,
          totalLightSleepTime: true,
          totalSlowWaveSleepTime: true,
          totalRemSleepTime: true,
          respiratoryRate: true,
          scoreState: true,
          createdAt: true,
        },
        orderBy: {
          start: "desc",
        },
        take: Math.min(limit, 25),
      }),

      // Workouts data - only essential fields
      prisma.whoopWorkout.findMany({
        where: {
          whoopUserId: userId,
          start: {
            gte: cutoffDate,
          },
        },
        select: {
          id: true,
          workoutId: true,
          start: true,
          end: true,
          sportId: true,
          strain: true,
          averageHeartRate: true,
          maxHeartRate: true,
          kilojoule: true,
          distanceMeters: true,
          scoreState: true,
          createdAt: true,
        },
        orderBy: {
          start: "desc",
        },
        take: Math.min(limit, 25),
      }),
    ]
  );

  // Convert BigInt values to strings for JSON serialization
  const serializeData = (data: any[]) => {
    return data.map((item) => ({
      ...item,
      cycleId: item.cycleId ? item.cycleId.toString() : item.cycleId,
      createdAt: item.createdAt?.toISOString?.() || item.createdAt,
      updatedAt: item.updatedAt?.toISOString?.() || item.updatedAt,
      start: item.start?.toISOString?.() || item.start,
      end: item.end?.toISOString?.() || item.end,
    }));
  };

  return {
    recovery: serializeData(recoveryData),
    cycles: serializeData(cyclesData),
    sleep: serializeData(sleepData),
    workouts: serializeData(workoutsData),
    _metadata: {
      userId,
      counts: {
        recovery: recoveryData.length,
        cycles: cyclesData.length,
        sleep: sleepData.length,
        workouts: workoutsData.length,
      },
      fetchedAt: new Date().toISOString(),
      daysPeriod: days,
    },
  };
}

// Simplified version without caching to avoid blocking issues
async function getWhoopDataFromDB(userId: string, days: number, limit: number) {
  return fetchWhoopDataFromDB(userId, days, limit);
}

// Server action for client components
export const getWhoopDataAction = actionClient
  .schema(whoopDataSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    return await getWhoopDataFromDB(
      user.id,
      parsedInput.days,
      parsedInput.limit
    );
  });

// Server function for server components (no authentication wrapper needed)
export async function getWhoopDataServer(
  days: number = 30,
  limit: number = 100
): Promise<WhoopDataResponse | null> {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    return await getWhoopDataFromDB(user.id, days, limit);
  } catch (error) {
    console.error("Error fetching WHOOP data from server:", error);
    return null;
  }
}

// Function to process WHOOP data into stats
export async function processWhoopDataToStats(
  data: WhoopDataResponse
): Promise<WhoopStats> {
  const stats: WhoopStats = {
    trends: {
      recoveryTrend: "stable",
      sleepTrend: "stable",
      strainTrend: "stable",
    },
  };

  // Latest Recovery Data
  if (data.recovery && data.recovery.length > 0) {
    const latestRecovery = data.recovery[0];
    stats.latestRecovery = {
      recoveryScore: latestRecovery.recoveryScore,
      restingHeartRate: latestRecovery.restingHeartRate,
      hrvRmssd: latestRecovery.hrvRmssd,
      date: latestRecovery.createdAt,
    };

    // Calculate recovery trend (compare last 3 vs previous 3)
    if (data.recovery.length >= 6) {
      const recent = data.recovery
        .slice(0, 3)
        .map((r) => r.recoveryScore)
        .filter(Boolean);
      const previous = data.recovery
        .slice(3, 6)
        .map((r) => r.recoveryScore)
        .filter(Boolean);

      if (recent.length && previous.length) {
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const previousAvg =
          previous.reduce((a, b) => a + b, 0) / previous.length;
        const change = ((recentAvg - previousAvg) / previousAvg) * 100;

        stats.trends.recoveryTrend =
          change > 5 ? "up" : change < -5 ? "down" : "stable";
      }
    }
  }

  // Latest Sleep Data
  if (data.sleep && data.sleep.length > 0) {
    const latestSleep = data.sleep[0];
    stats.latestSleep = {
      sleepEfficiencyPercentage: latestSleep.sleepEfficiencyPercentage,
      sleepPerformancePercentage: latestSleep.sleepPerformancePercentage,
      totalInBedTime: latestSleep.totalInBedTime,
      date: latestSleep.start,
    };

    // Calculate sleep trend
    if (data.sleep.length >= 6) {
      const recent = data.sleep
        .slice(0, 3)
        .map((s) => s.sleepPerformancePercentage)
        .filter(Boolean);
      const previous = data.sleep
        .slice(3, 6)
        .map((s) => s.sleepPerformancePercentage)
        .filter(Boolean);

      if (recent.length && previous.length) {
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const previousAvg =
          previous.reduce((a, b) => a + b, 0) / previous.length;
        const change = ((recentAvg - previousAvg) / previousAvg) * 100;

        stats.trends.sleepTrend =
          change > 5 ? "up" : change < -5 ? "down" : "stable";
      }
    }
  }

  // Weekly Strain Data
  if (data.cycles && data.cycles.length > 0) {
    const weekCycles = data.cycles.slice(0, 7);
    const strainValues = weekCycles.map((c) => c.strain).filter(Boolean);

    if (strainValues.length > 0) {
      stats.weeklyStrain = {
        averageStrain:
          strainValues.reduce((a, b) => a + b, 0) / strainValues.length,
        maxStrain: Math.max(...strainValues),
        totalWorkouts: data.workouts?.length || 0,
      };

      // Calculate strain trend
      if (data.cycles.length >= 14) {
        const recentWeek = data.cycles
          .slice(0, 7)
          .map((c) => c.strain)
          .filter(Boolean);
        const previousWeek = data.cycles
          .slice(7, 14)
          .map((c) => c.strain)
          .filter(Boolean);

        if (recentWeek.length && previousWeek.length) {
          const recentAvg =
            recentWeek.reduce((a, b) => a + b, 0) / recentWeek.length;
          const previousAvg =
            previousWeek.reduce((a, b) => a + b, 0) / previousWeek.length;
          const change = ((recentAvg - previousAvg) / previousAvg) * 100;

          stats.trends.strainTrend =
            change > 10 ? "up" : change < -10 ? "down" : "stable";
        }
      }
    }
  }

  return stats;
}

// Function to revalidate cache (useful for webhooks or manual refresh)
export async function revalidateWhoopData() {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("whoop-data");
}

// Export for use in client components via useAction
export { getWhoopDataAction as default };

// Cursor rules applied correctly.
