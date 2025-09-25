"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { MarkerValues } from "@/lib/health/types";

// Input schema for health data fetching
const healthDataSchema = z.object({
  includeMockData: z.boolean().default(false), // For testing purposes
});

/**
 * Fetch user health data from various sources to calculate health score
 * This combines WHOOP data, user profile data, and manual inputs
 */
export const getHealthDataAction = actionClient
  .schema(healthDataSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    const { includeMockData } = parsedInput;

    try {
      // 1. Get user profile data
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          heightCm: true,
          weightKg: true,
          dateOfBirth: true,
          gender: true,
        },
      });

      // 2. Get latest WHOOP data if available
      const whoopUser = await prisma.whoopUser.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });

      let whoopData = null;
      if (whoopUser) {
        // Get latest WHOOP metrics (last 7 days)
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 7);

        const [latestRecovery, latestSleep, latestCycle, recentWorkouts] =
          await Promise.all([
            // Latest recovery data
            prisma.whoopRecovery.findFirst({
              where: {
                whoopUserId: user.id,
                createdAt: { gte: cutoffDate },
                scoreState: "SCORED",
              },
              orderBy: { createdAt: "desc" },
              select: {
                recoveryScore: true,
                restingHeartRate: true,
                hrvRmssd: true,
              },
            }),

            // Latest sleep data
            prisma.whoopSleep.findFirst({
              where: {
                whoopUserId: user.id,
                start: { gte: cutoffDate },
                nap: false,
                scoreState: "SCORED",
              },
              orderBy: { start: "desc" },
              select: {
                totalInBedTime: true,
                sleepEfficiencyPercentage: true,
                totalAwakeTime: true,
                totalRemSleepTime: true,
                totalSlowWaveSleepTime: true,
                sleepConsistencyPercentage: true,
                disturbanceCount: true,
                sleepPerformancePercentage: true,
                respiratoryRate: true,
              },
            }),

            // Latest cycle data
            prisma.whoopCycle.findFirst({
              where: {
                whoopUserId: user.id,
                start: { gte: cutoffDate },
                scoreState: "SCORED",
              },
              orderBy: { start: "desc" },
              select: {
                strain: true,
                averageHeartRate: true,
                maxHeartRate: true,
                kilojoule: true,
                percentRecorded: true,
              },
            }),

            // Recent workouts (last 7 days)
            prisma.whoopWorkout.findMany({
              where: {
                whoopUserId: user.id,
                start: { gte: cutoffDate },
                scoreState: "SCORED",
              },
              select: {
                distanceMeters: true,
                altitudeGainMeters: true,
              },
              take: 10,
            }),
          ]);

        // Calculate aggregated workout metrics
        const totalDistance = recentWorkouts.reduce(
          (sum, w) => sum + (w.distanceMeters || 0),
          0
        );
        const totalAltitudeGain = recentWorkouts.reduce(
          (sum, w) => sum + (w.altitudeGainMeters || 0),
          0
        );

        whoopData = {
          recovery: latestRecovery,
          sleep: latestSleep,
          cycle: latestCycle,
          workouts: {
            totalDistance,
            totalAltitudeGain,
          },
        };
      }

      // 3. Calculate BMI if height and weight are available
      let bmi = null;
      if (userProfile?.heightCm && userProfile?.weightKg) {
        const heightM = userProfile.heightCm / 100;
        bmi = userProfile.weightKg / (heightM * heightM);
      }

      // 4. Build health marker values
      const healthData: MarkerValues = {};

      // Add WHOOP-derived data
      if (whoopData) {
        // Sleep & Recovery markers
        if (whoopData.sleep) {
          healthData.totalInBedTime = whoopData.sleep.totalInBedTime;
          healthData.sleepEfficiencyPercentage =
            whoopData.sleep.sleepEfficiencyPercentage;
          healthData.totalAwakeTime = whoopData.sleep.totalAwakeTime;
          healthData.totalRemSleepTime = whoopData.sleep.totalRemSleepTime;
          healthData.totalSlowWaveSleepTime =
            whoopData.sleep.totalSlowWaveSleepTime;
          healthData.sleepConsistencyPercentage =
            whoopData.sleep.sleepConsistencyPercentage;
          healthData.disturbanceCount = whoopData.sleep.disturbanceCount;
          healthData.sleepPerformancePercentage =
            whoopData.sleep.sleepPerformancePercentage;
          healthData.respiratoryRate = whoopData.sleep.respiratoryRate;
        }

        if (whoopData.recovery) {
          healthData.recoveryScore = whoopData.recovery.recoveryScore;
          healthData.restingHeartRate = whoopData.recovery.restingHeartRate;
          healthData.hrvRmssd = whoopData.recovery.hrvRmssd;
        }

        // Movement & Fitness markers
        if (whoopData.cycle) {
          healthData.strain = whoopData.cycle.strain;
          healthData.averageHeartRate = whoopData.cycle.averageHeartRate;
          healthData.maxHeartRate = whoopData.cycle.maxHeartRate;
          healthData.kilojoule = whoopData.cycle.kilojoule;
          healthData.percentRecorded = whoopData.cycle.percentRecorded;
        }

        if (whoopData.workouts) {
          healthData.distanceMeters = whoopData.workouts.totalDistance;
          healthData.altitudeGainMeters = whoopData.workouts.totalAltitudeGain;
        }
      }

      // Add calculated health metrics
      if (bmi) {
        healthData.bmi = bmi;
      }

      // Add weight if available (for tracking, not scoring)
      if (userProfile?.weightKg) {
        healthData.weight = userProfile.weightKg;
      }

      // 5. Add mock data for missing markers if requested (for testing)
      if (includeMockData) {
        // Add mock nutrition data
        healthData.calories = healthData.calories || 2300;
        healthData.protein = healthData.protein || 120;
        healthData.carbs = healthData.carbs || 240;
        healthData.fat = healthData.fat || 80;
        healthData.fiber = healthData.fiber || 28;
        healthData.sugar = healthData.sugar || 35;
        healthData.water = healthData.water || 2.4;
        healthData.caffeine = healthData.caffeine || 180;
        healthData.alcohol = healthData.alcohol || 0;
        healthData.eatingWindow = healthData.eatingWindow || 11;

        // Add mock mind & stress data
        healthData.mood = healthData.mood || 4;
        healthData.stress = healthData.stress || 2;
        healthData.energy = healthData.energy || 4;
        healthData.focus = healthData.focus || 4;
        healthData.mindfulness = healthData.mindfulness || 12;
        healthData.journaling = healthData.journaling || 80;
        healthData.screenTime = healthData.screenTime || 3.5;
        healthData.socialQuality = healthData.socialQuality || 4;
        healthData.gratitude = healthData.gratitude || 1;
        healthData.workloadPerception = healthData.workloadPerception || 2;

        // Add mock health checks
        healthData.waistCircumference = healthData.waistCircumference || 86;
        healthData.bodyFat = healthData.bodyFat || 18;
        healthData.bloodPressureSys = healthData.bloodPressureSys || 118;
        healthData.bloodPressureDia = healthData.bloodPressureDia || 76;
        healthData.fastingGlucose = healthData.fastingGlucose || 90;
        healthData.hba1c = healthData.hba1c || 5.2;
        healthData.ldl = healthData.ldl || 95;
        healthData.hdl = healthData.hdl || 55;
        healthData.triglycerides = healthData.triglycerides || 110;
        healthData.totalCholesterol = healthData.totalCholesterol || 185;
        healthData.crp = healthData.crp || 0.7;
        healthData.vitaminD = healthData.vitaminD || 34;
      }

      return {
        success: true,
        data: {
          healthData,
          sources: {
            whoop: !!whoopData,
            userProfile: !!userProfile,
            mockData: includeMockData,
          },
          metadata: {
            availableMarkers: Object.keys(healthData).length,
            whoopLastSync: whoopUser ? await getLastWhoopSync(user.id) : null,
            calculatedAt: new Date().toISOString(),
          },
        },
      };
    } catch (error) {
      console.error("Error fetching health data:", error);
      throw new Error("Failed to fetch health data");
    }
  });

/**
 * Get the last sync time for WHOOP data
 */
async function getLastWhoopSync(userId: string): Promise<Date | null> {
  try {
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId },
      select: { lastSyncAt: true },
    });
    return whoopUser?.lastSyncAt || null;
  } catch {
    return null;
  }
}

/**
 * Server function to get health data (for server components)
 */
export async function getHealthDataServer(includeMockData: boolean = false) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    // Reuse the same logic as the action
    const result = await getHealthDataAction({
      includeMockData,
    });

    return result.data;
  } catch (error) {
    console.error("Error fetching health data from server:", error);
    return null;
  }
}

// Cursor rules applied correctly.
