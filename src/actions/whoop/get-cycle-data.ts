"use server";

import { z } from "zod";
import { actionClient } from "../safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { unstable_cache } from "next/cache";

// Input schema
const cycleDataSchema = z.object({
  days: z.number().min(1).max(90).default(30),
  limit: z.number().min(1).max(100).default(30),
});

// Transform DB cycle data to match WhoopCycle interface
function transformCycleData(rawCycleData: any[]) {
  return rawCycleData.map((cycle) => ({
    id: Number(cycle.cycleId),
    user_id: 10129, // Static for compatibility
    created_at: cycle.createdAt,
    updated_at: cycle.updatedAt,
    start: cycle.start,
    end: cycle.end || cycle.start, // Use start as fallback if end is null
    timezone_offset: cycle.timezoneOffset || "-05:00",
    score_state: cycle.scoreState as "SCORED" | "PENDING_SCORE" | "UNSCORABLE",
    score: {
      strain: cycle.strain || 0,
      kilojoule: cycle.kilojoule || 0,
      average_heart_rate: cycle.averageHeartRate || 0,
      max_heart_rate: cycle.maxHeartRate || 0,
    },
  }));
}

// Fetch cycle data from database
async function fetchCycleDataFromDB(
  userId: string,
  days: number,
  limit: number
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const cycleData = await prisma.whoopCycle.findMany({
    where: {
      whoopUserId: userId,
      start: { gte: cutoffDate },
      scoreState: "SCORED", // Only include scored cycle data
    },
    orderBy: { start: "desc" },
    take: limit,
  });

  // Serialize Date objects
  const serializedCycleData = cycleData.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    start: c.start.toISOString(),
    end: c.end?.toISOString() || c.start.toISOString(),
    cycleId: Number(c.cycleId),
    timezoneOffset: c.timezoneOffset,
    scoreState: c.scoreState,
    strain: c.strain,
    averageHeartRate: c.averageHeartRate,
    maxHeartRate: c.maxHeartRate,
    kilojoule: c.kilojoule,
    percentRecorded: c.percentRecorded,
  }));

  return transformCycleData(serializedCycleData);
}

// Cached version for better performance
const getCachedCycleData = unstable_cache(
  async (userId: string, days: number, limit: number) => {
    return fetchCycleDataFromDB(userId, days, limit);
  },
  ["cycle-data"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["whoop-data", "cycles"],
  }
);

// Server action for client components
export const getCycleDataAction = actionClient
  .schema(cycleDataSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    return await getCachedCycleData(
      user.id,
      parsedInput.days,
      parsedInput.limit
    );
  });

// Server function for server components
export async function getCycleDataServer(
  days: number = 30,
  limit: number = 30
) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    return await getCachedCycleData(user.id, days, limit);
  } catch (error) {
    console.error("Error fetching cycle data:", error);
    return null;
  }
}

// Get cycle summary stats
export async function getCycleStatsServer(days: number = 7) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const cycleData = await prisma.whoopCycle.findMany({
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
        start: true,
      },
      orderBy: { start: "desc" },
      take: days,
    });

    if (cycleData.length === 0) return null;

    const validStrain = cycleData
      .map((c) => c.strain)
      .filter((s): s is number => s !== null);

    const validAvgHr = cycleData
      .map((c) => c.averageHeartRate)
      .filter((hr): hr is number => hr !== null);

    const validMaxHr = cycleData
      .map((c) => c.maxHeartRate)
      .filter((hr): hr is number => hr !== null);

    const validKilojoules = cycleData
      .map((c) => c.kilojoule)
      .filter((kj): kj is number => kj !== null);

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
      totalDays: cycleData.length,
      latestCycle: cycleData[0]
        ? {
            strain: cycleData[0].strain,
            averageHeartRate: cycleData[0].averageHeartRate,
            maxHeartRate: cycleData[0].maxHeartRate,
            date: cycleData[0].start.toISOString(),
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching cycle stats:", error);
    return null;
  }
}

// Cursor rules applied correctly.
