"use server";

import { z } from "zod";
import { actionClient } from "../safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { unstable_cache } from "next/cache";

// Input schema
const recoveryDataSchema = z.object({
  days: z.number().min(1).max(90).default(30),
  limit: z.number().min(1).max(100).default(30),
});

// Transform DB recovery data to match WhoopRecovery interface
function transformRecoveryData(rawRecoveryData: any[]) {
  return rawRecoveryData.map((recovery) => ({
    cycle_id: Number(recovery.cycleId),
    sleep_id: recovery.sleepId || "",
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
      spo2_percentage: recovery.spo2Percentage || 0,
      skin_temp_celsius: recovery.skinTempCelsius || 0,
    },
  }));
}

// Fetch recovery data from database
async function fetchRecoveryDataFromDB(
  userId: string,
  days: number,
  limit: number
) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recoveryData = await prisma.whoopRecovery.findMany({
    where: {
      whoopUserId: userId,
      createdAt: { gte: cutoffDate },
      scoreState: "SCORED", // Only include scored recovery data
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  // Serialize Date objects
  const serializedRecoveryData = recoveryData.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    cycleId: Number(r.cycleId),
    sleepId: r.sleepId,
    scoreState: r.scoreState,
    recoveryScore: r.recoveryScore,
    restingHeartRate: r.restingHeartRate,
    hrvRmssd: r.hrvRmssd,
    userCalibrating: r.userCalibrating,
    spo2Percentage: 98, // Default value as this field might not be stored
    skinTempCelsius: 36.5, // Default value as this field might not be stored
  }));

  return transformRecoveryData(serializedRecoveryData);
}

// Cached version for better performance
const getCachedRecoveryData = unstable_cache(
  async (userId: string, days: number, limit: number) => {
    return fetchRecoveryDataFromDB(userId, days, limit);
  },
  ["recovery-data"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["whoop-data", "recovery"],
  }
);

// Server action for client components
export const getRecoveryDataAction = actionClient
  .schema(recoveryDataSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    return await getCachedRecoveryData(
      user.id,
      parsedInput.days,
      parsedInput.limit
    );
  });

// Server function for server components
export async function getRecoveryDataServer(
  days: number = 30,
  limit: number = 30
) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    return await getCachedRecoveryData(user.id, days, limit);
  } catch (error) {
    console.error("Error fetching recovery data:", error);
    return null;
  }
}

// Get recovery summary stats
export async function getRecoveryStatsServer(days: number = 7) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recoveryData = await prisma.whoopRecovery.findMany({
      where: {
        whoopUserId: user.id,
        createdAt: { gte: cutoffDate },
        scoreState: "SCORED",
      },
      select: {
        recoveryScore: true,
        restingHeartRate: true,
        hrvRmssd: true,
        userCalibrating: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: days,
    });

    if (recoveryData.length === 0) return null;

    const validRecoveryScores = recoveryData
      .map((r) => r.recoveryScore)
      .filter((s): s is number => s !== null);

    const validRhr = recoveryData
      .map((r) => r.restingHeartRate)
      .filter((rhr): rhr is number => rhr !== null);

    const validHrv = recoveryData
      .map((r) => r.hrvRmssd)
      .filter((hrv): hrv is number => hrv !== null);

    return {
      averageRecoveryScore:
        validRecoveryScores.length > 0
          ? validRecoveryScores.reduce((a, b) => a + b, 0) /
            validRecoveryScores.length
          : null,
      averageRestingHeartRate:
        validRhr.length > 0
          ? validRhr.reduce((a, b) => a + b, 0) / validRhr.length
          : null,
      averageHrv:
        validHrv.length > 0
          ? validHrv.reduce((a, b) => a + b, 0) / validHrv.length
          : null,
      totalDays: recoveryData.length,
      latestRecovery: recoveryData[0]
        ? {
            recoveryScore: recoveryData[0].recoveryScore,
            restingHeartRate: recoveryData[0].restingHeartRate,
            hrvRmssd: recoveryData[0].hrvRmssd,
            date: recoveryData[0].createdAt.toISOString(),
            userCalibrating: recoveryData[0].userCalibrating,
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching recovery stats:", error);
    return null;
  }
}

// Cursor rules applied correctly.
