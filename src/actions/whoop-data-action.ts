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
  latestWorkout?: {
    strain: number | null;
    averageHeartRate: number | null;
    maxHeartRate: number | null;
    distanceMeters: number | null;
    kilojoule: number | null;
    duration: number | null;
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
    workoutTrend: "up" | "down" | "stable";
  };
}

// Optimized function to fetch minimal WHOOP data for dashboard
async function fetchWhoopSummaryFromDB(
  userId: string,
  days: number = 7 // Reduced default to 7 days for faster loading
): Promise<WhoopDataResponse> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Fetch only essential fields for dashboard with strict limits
  const [recoveryData, cyclesData, sleepData, workoutsData] = await Promise.all(
    [
      // Recovery data - minimal fields, latest 10 records
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
          recoveryScore: true,
          restingHeartRate: true,
          hrvRmssd: true,
          scoreState: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10, // Only last 10 for summary
      }),

      // Cycles data - minimal fields, latest 10 records
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
          strain: true,
          averageHeartRate: true,
          maxHeartRate: true,
          scoreState: true,
        },
        orderBy: {
          start: "desc",
        },
        take: 10,
      }),

      // Sleep data - minimal fields, latest 7 records
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
          sleepPerformancePercentage: true,
          sleepEfficiencyPercentage: true,
          totalInBedTime: true,
          scoreState: true,
        },
        orderBy: {
          start: "desc",
        },
        take: 7,
      }),

      // Workouts data - minimal fields, latest 10 records
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
          strain: true,
          averageHeartRate: true,
          maxHeartRate: true,
          distanceMeters: true,
          scoreState: true,
        },
        orderBy: {
          start: "desc",
        },
        take: 10,
      }),
    ]
  );

  // Optimized serialization for smaller data sets
  const serializeData = (data: any[]) => {
    return data.map((item) => ({
      ...item,
      cycleId: item.cycleId ? item.cycleId.toString() : item.cycleId,
      createdAt: item.createdAt?.toISOString?.() || item.createdAt,
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

// Cached version for better performance
const getCachedWhoopData = unstable_cache(
  async (userId: string, days: number) => {
    return fetchWhoopSummaryFromDB(userId, days);
  },
  ["whoop-summary"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["whoop-data"],
  }
);

// Full data fetch function for detailed views (used by table)
async function fetchFullWhoopDataFromDB(
  userId: string,
  days: number = 30,
  limit: number = 100
): Promise<WhoopDataResponse> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Fetch full data with all fields when needed
  const [recoveryData, cyclesData, sleepData, workoutsData] = await Promise.all(
    [
      prisma.whoopRecovery.findMany({
        where: {
          whoopUserId: userId,
          createdAt: {
            gte: cutoffDate,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: Math.min(limit, 100),
      }),

      prisma.whoopCycle.findMany({
        where: {
          whoopUserId: userId,
          start: {
            gte: cutoffDate,
          },
        },
        orderBy: {
          start: "desc",
        },
        take: Math.min(limit, 100),
      }),

      prisma.whoopSleep.findMany({
        where: {
          whoopUserId: userId,
          start: {
            gte: cutoffDate,
          },
        },
        orderBy: {
          start: "desc",
        },
        take: Math.min(limit, 50),
      }),

      prisma.whoopWorkout.findMany({
        where: {
          whoopUserId: userId,
          start: {
            gte: cutoffDate,
          },
        },
        orderBy: {
          start: "desc",
        },
        take: Math.min(limit, 50),
      }),
    ]
  );

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

// Server action for client components
export const getWhoopDataAction = actionClient
  .schema(whoopDataSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    return await fetchFullWhoopDataFromDB(
      user.id,
      parsedInput.days,
      parsedInput.limit
    );
  });

// Fast summary data for dashboard cards
export async function getWhoopSummaryServer(
  days: number = 7
): Promise<WhoopDataResponse | null> {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    return await getCachedWhoopData(user.id, days);
  } catch (error) {
    console.error("Error fetching WHOOP summary:", error);
    return null;
  }
}

// Full data for detailed views (table)
export async function getWhoopDataServer(
  days: number = 30,
  limit: number = 100
): Promise<WhoopDataResponse | null> {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    return await fetchFullWhoopDataFromDB(user.id, days, limit);
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
      workoutTrend: "stable",
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

  // Latest Workout Data
  if (data.workouts && data.workouts.length > 0) {
    const latestWorkout = data.workouts[0];
    const duration =
      latestWorkout.end && latestWorkout.start
        ? new Date(latestWorkout.end).getTime() -
          new Date(latestWorkout.start).getTime()
        : null;

    stats.latestWorkout = {
      strain: latestWorkout.strain,
      averageHeartRate: latestWorkout.averageHeartRate,
      maxHeartRate: latestWorkout.maxHeartRate,
      distanceMeters: latestWorkout.distanceMeters,
      kilojoule: latestWorkout.kilojoule,
      duration: duration,
      date: latestWorkout.start,
    };

    // Calculate workout trend (compare recent workouts strain)
    if (data.workouts.length >= 6) {
      const recent = data.workouts
        .slice(0, 3)
        .map((w) => w.strain)
        .filter(Boolean);
      const previous = data.workouts
        .slice(3, 6)
        .map((w) => w.strain)
        .filter(Boolean);

      if (recent.length && previous.length) {
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const previousAvg =
          previous.reduce((a, b) => a + b, 0) / previous.length;
        const change = ((recentAvg - previousAvg) / previousAvg) * 100;

        stats.trends.workoutTrend =
          change > 10 ? "up" : change < -10 ? "down" : "stable";
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

// Get WHOOP user information
export async function getWhoopUserServer(): Promise<{
  firstName?: string;
  lastName?: string;
  email?: string;
  lastSyncAt?: Date | null;
} | null> {
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

// Export for use in client components via useAction
export { getWhoopDataAction as default };

// Cursor rules applied correctly.
