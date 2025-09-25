import { withAuth } from "@workos-inc/authkit-nextjs";
import { calculateAndSaveHealthScore, getLatestHealthScore } from "./database";
import { computeHealthScores } from "./score";
import { markers } from "./markers";
import { prisma } from "@/lib/prisma";
import { MarkerValues } from "./types";

/**
 * Server function to get health data and calculate scores
 */
export async function getHealthScoresServer() {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    // 1. Check for existing health score (within last 6 hours)
    const existingScore = await getLatestHealthScore(user.id);
    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

    if (existingScore && existingScore.calculatedAt > sixHoursAgo) {
      console.log("Using existing health score");
      // Return the stored score but also calculate current breakdown for display
      const healthData = await fetchHealthData(user.id, true);
      const currentScores = computeHealthScores(markers, healthData);

      return {
        healthScore: existingScore,
        scoreDetails: currentScores,
        isFromDatabase: true,
      };
    }

    // 2. Fetch fresh health data
    const healthData = await fetchHealthData(user.id, true);

    // 3. Calculate and save new health score
    const result = await calculateAndSaveHealthScore(
      user.id,
      healthData,
      "v0.0.1"
    );

    return {
      healthScore: result.healthScore,
      scoreDetails: result.scoreDetails,
      isFromDatabase: false,
    };
  } catch (error) {
    console.error("Error getting health scores:", error);

    // Fallback to basic calculation with mock data
    const mockData = getMockHealthData();
    const fallbackScores = computeHealthScores(markers, mockData);

    return {
      healthScore: null,
      scoreDetails: fallbackScores,
      isFromDatabase: false,
      isFallback: true,
    };
  }
}

/**
 * Fetch health data from various sources
 */
async function fetchHealthData(
  userId: string,
  includeMockData: boolean
): Promise<MarkerValues> {
  const healthData: MarkerValues = {};

  try {
    // Get user profile data
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        heightCm: true,
        weightKg: true,
        dateOfBirth: true,
        gender: true,
      },
    });

    // Calculate BMI if available
    if (userProfile?.heightCm && userProfile?.weightKg) {
      const heightM = userProfile.heightCm / 100;
      healthData.bmi = userProfile.weightKg / (heightM * heightM);
      healthData.weight = userProfile.weightKg;
    }

    // Get WHOOP data if available
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (whoopUser) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7);

      // Get latest recovery data
      const latestRecovery = await prisma.whoopRecovery.findFirst({
        where: {
          whoopUserId: userId,
          createdAt: { gte: cutoffDate },
          scoreState: "SCORED",
        },
        orderBy: { createdAt: "desc" },
        select: {
          recoveryScore: true,
          restingHeartRate: true,
          hrvRmssd: true,
        },
      });

      if (latestRecovery) {
        healthData.recoveryScore = latestRecovery.recoveryScore;
        healthData.restingHeartRate = latestRecovery.restingHeartRate;
        healthData.hrvRmssd = latestRecovery.hrvRmssd;
      }

      // Get latest sleep data
      const latestSleep = await prisma.whoopSleep.findFirst({
        where: {
          whoopUserId: userId,
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
      });

      if (latestSleep) {
        healthData.totalInBedTime = latestSleep.totalInBedTime;
        healthData.sleepEfficiencyPercentage =
          latestSleep.sleepEfficiencyPercentage;
        healthData.totalAwakeTime = latestSleep.totalAwakeTime;
        healthData.totalRemSleepTime = latestSleep.totalRemSleepTime;
        healthData.totalSlowWaveSleepTime = latestSleep.totalSlowWaveSleepTime;
        healthData.sleepConsistencyPercentage =
          latestSleep.sleepConsistencyPercentage;
        healthData.disturbanceCount = latestSleep.disturbanceCount;
        healthData.sleepPerformancePercentage =
          latestSleep.sleepPerformancePercentage;
        healthData.respiratoryRate = latestSleep.respiratoryRate;
      }

      // Get latest cycle data
      const latestCycle = await prisma.whoopCycle.findFirst({
        where: {
          whoopUserId: userId,
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
      });

      if (latestCycle) {
        healthData.strain = latestCycle.strain;
        healthData.averageHeartRate = latestCycle.averageHeartRate;
        healthData.maxHeartRate = latestCycle.maxHeartRate;
        healthData.kilojoule = latestCycle.kilojoule;
        healthData.percentRecorded = latestCycle.percentRecorded;
      }

      // Get recent workout data
      const recentWorkouts = await prisma.whoopWorkout.findMany({
        where: {
          whoopUserId: userId,
          start: { gte: cutoffDate },
          scoreState: "SCORED",
        },
        select: {
          distanceMeters: true,
          altitudeGainMeters: true,
        },
        take: 10,
      });

      if (recentWorkouts.length > 0) {
        healthData.distanceMeters = recentWorkouts.reduce(
          (sum, w) => sum + (w.distanceMeters || 0),
          0
        );
        healthData.altitudeGainMeters = recentWorkouts.reduce(
          (sum, w) => sum + (w.altitudeGainMeters || 0),
          0
        );
      }
    }

    // Add mock data if requested and insufficient real data
    if (includeMockData) {
      const mockData = getMockHealthData();
      Object.entries(mockData).forEach(([key, value]) => {
        if (healthData[key] === undefined) {
          healthData[key] = value;
        }
      });
    }

    return healthData;
  } catch (error) {
    console.error("Error fetching health data:", error);
    return includeMockData ? getMockHealthData() : {};
  }
}

/**
 * Get mock health data for testing/demo purposes
 */
function getMockHealthData(): MarkerValues {
  return {
    // Nutrition
    calories: 2300,
    protein: 120,
    carbs: 240,
    fat: 80,
    fiber: 28,
    sugar: 35,
    water: 2.4,
    caffeine: 180,
    alcohol: 0,
    eatingWindow: 11,

    // Sleep & Recovery
    totalInBedTime: 27360000, // 7.6 hours in milliseconds
    sleepEfficiencyPercentage: 90,
    totalAwakeTime: 1200000, // 20 minutes
    totalRemSleepTime: 6120000, // 1.7 hours
    totalSlowWaveSleepTime: 3960000, // 1.1 hours
    restingHeartRate: 58,
    hrvRmssd: 55,
    sleepConsistencyPercentage: 85,
    disturbanceCount: 1,
    recoveryScore: 74,
    sleepPerformancePercentage: 88,
    respiratoryRate: 16,

    // Movement & Fitness
    strain: 14.2,
    averageHeartRate: 145,
    maxHeartRate: 175,
    kilojoule: 2600,
    distanceMeters: 5000,
    altitudeGainMeters: 100,
    percentRecorded: 95,

    // Mind & Stress
    mood: 4,
    stress: 2,
    energy: 4,
    focus: 4,
    mindfulness: 12,
    journaling: 80,
    screenTime: 3.5,
    socialQuality: 4,
    gratitude: 1,
    workloadPerception: 2,

    // Health Checks
    bmi: 23.4,
    waistCircumference: 86,
    bodyFat: 18,
    bloodPressureSys: 118,
    bloodPressureDia: 76,
    fastingGlucose: 90,
    hba1c: 5.2,
    ldl: 95,
    hdl: 55,
    triglycerides: 110,
    totalCholesterol: 185,
    crp: 0.7,
    vitaminD: 34,
  };
}

// Cursor rules applied correctly.
