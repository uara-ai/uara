"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";

// Input schema for WHOOP analysis requests
const whoopAnalysisSchema = z.object({
  analysisType: z.enum(["recovery", "sleep", "strain", "workout"]),
  days: z.number().min(1).max(90).default(30),
});

export const getWhoopAnalysisDataAction = actionClient
  .schema(whoopAnalysisSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    // Check if user has WHOOP connection
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: { id: true, userId: true },
    });

    if (!whoopUser) {
      throw new Error(
        "WHOOP account not connected. Please connect your WHOOP account first."
      );
    }

    const { analysisType, days } = parsedInput;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const dateRange = {
      start: cutoffDate.toISOString().split("T")[0],
      end: new Date().toISOString().split("T")[0],
    };

    try {
      switch (analysisType) {
        case "recovery":
          return await fetchRecoveryData(user.id, cutoffDate, dateRange);
        case "sleep":
          return await fetchSleepData(user.id, cutoffDate, dateRange);
        case "strain":
          return await fetchStrainData(user.id, cutoffDate, dateRange);
        case "workout":
          return await fetchWorkoutData(user.id, cutoffDate, dateRange);
        default:
          throw new Error("Invalid analysis type");
      }
    } catch (error) {
      console.error(`Error fetching WHOOP ${analysisType} data:`, error);
      throw new Error(`Failed to fetch WHOOP ${analysisType} data`);
    }
  });

// Recovery data fetcher
async function fetchRecoveryData(
  userId: string,
  cutoffDate: Date,
  dateRange: any
) {
  const recoveryData = await prisma.whoopRecovery.findMany({
    where: {
      whoopUserId: userId,
      createdAt: { gte: cutoffDate },
    },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return {
    userId,
    dateRange,
    recoveryData: recoveryData.map((data) => ({
      date: data.createdAt.toISOString().split("T")[0],
      recoveryScore: data.recoveryScore,
      hrvRmssd: data.hrvRmssd,
      restingHeartRate: data.restingHeartRate,
      userCalibrating: data.userCalibrating,
      scoreState: data.scoreState,
    })),
  };
}

// Sleep data fetcher
async function fetchSleepData(
  userId: string,
  cutoffDate: Date,
  dateRange: any
) {
  const sleepData = await prisma.whoopSleep.findMany({
    where: {
      whoopUserId: userId,
      start: { gte: cutoffDate },
    },
    orderBy: { start: "desc" },
    take: 25,
  });

  return {
    userId,
    dateRange,
    sleepData: sleepData.map((data) => ({
      date: data.start.toISOString().split("T")[0],
      sleepPerformancePercentage: data.sleepPerformancePercentage,
      sleepEfficiencyPercentage: data.sleepEfficiencyPercentage,
      totalInBedTime: data.totalInBedTime,
      totalAwakeTime: data.totalAwakeTime,
      totalRemSleepTime: data.totalRemSleepTime,
      totalSlowWaveSleepTime: data.totalSlowWaveSleepTime,
      totalLightSleepTime: data.totalLightSleepTime,
      sleepCycleCount: data.sleepCycleCount,
      disturbanceCount: data.disturbanceCount,
      respiratoryRate: data.respiratoryRate,
      sleepConsistencyPercentage: data.sleepConsistencyPercentage,
    })),
  };
}

// Strain data fetcher
async function fetchStrainData(
  userId: string,
  cutoffDate: Date,
  dateRange: any
) {
  const [strainData, recoveryData] = await Promise.all([
    prisma.whoopCycle.findMany({
      where: {
        whoopUserId: userId,
        start: { gte: cutoffDate },
      },
      orderBy: { start: "desc" },
      take: 25,
    }),
    // Get recovery data for strain-recovery balance analysis
    prisma.whoopRecovery.findMany({
      where: {
        whoopUserId: userId,
        createdAt: { gte: cutoffDate },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return {
    userId,
    dateRange,
    strainData: strainData.map((data) => ({
      date: data.start.toISOString().split("T")[0],
      strain: data.strain,
      kilojoule: data.kilojoule,
      averageHeartRate: data.averageHeartRate,
      maxHeartRate: data.maxHeartRate,
      percentRecorded: data.percentRecorded,
      scoreState: data.scoreState,
    })),
    recoveryData: recoveryData.map((data) => ({
      date: data.createdAt.toISOString().split("T")[0],
      recoveryScore: data.recoveryScore,
    })),
  };
}

// Workout data fetcher
async function fetchWorkoutData(
  userId: string,
  cutoffDate: Date,
  dateRange: any
) {
  const [workoutData, recoveryData] = await Promise.all([
    prisma.whoopWorkout.findMany({
      where: {
        whoopUserId: userId,
        start: { gte: cutoffDate },
      },
      orderBy: { start: "desc" },
      take: 25,
    }),
    // Get recovery data for optimal workout timing analysis
    prisma.whoopRecovery.findMany({
      where: {
        whoopUserId: userId,
        createdAt: { gte: cutoffDate },
      },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  return {
    userId,
    dateRange,
    workoutData: workoutData.map((data) => ({
      date: data.start.toISOString().split("T")[0],
      workoutId: data.workoutId,
      sportId: data.sportId,
      strain: data.strain,
      start: data.start.toISOString(),
      end: data.end.toISOString(),
      duration: data.end.getTime() - data.start.getTime(), // Calculate duration
      kilojoule: data.kilojoule,
      averageHeartRate: data.averageHeartRate,
      maxHeartRate: data.maxHeartRate,
      percentRecorded: data.percentRecorded,
      distanceMeters: data.distanceMeters,
      altitudeGainMeters: data.altitudeGainMeters,
      altitudeChangeMeters: data.altitudeChangeMeters,
      scoreState: data.scoreState,
    })),
    recoveryData: recoveryData.map((data) => ({
      date: data.createdAt.toISOString().split("T")[0],
      recoveryScore: data.recoveryScore,
    })),
  };
}

// Cursor rules applied correctly.
