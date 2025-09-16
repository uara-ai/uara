import type { User } from "@/lib/db/schema";
import type {
  WhoopDataResponse,
  WhoopStats,
} from "@/actions/whoop-data-action";
import type { ToolContext } from "@/components/ai/context";
import {
  calculateAge,
  calculateBMI,
  parseJsonField,
  calculateDataCompleteness,
} from "@/components/ai/context";

interface ContextBuilderOptions {
  user: User;
  whoopData?: WhoopDataResponse | null;
  whoopStats?: WhoopStats | null;
  whoopUser?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    heightMeter?: number;
    weightKilogram?: number;
    maxHeartRate?: number;
    lastSyncAt?: Date;
  } | null;
  // Future data sources can be added here
  labData?: any;
  nutritionData?: any;
  exerciseData?: any;
}

/**
 * Builds a comprehensive ToolContext from available user data
 * This function aggregates data from all available sources and
 * calculates derived metrics for AI tools to use
 */
export function buildToolContext(options: ContextBuilderOptions): ToolContext {
  const { user, whoopData, whoopStats, whoopUser } = options;

  // Build user profile section
  const userAge = calculateAge(user.dateOfBirth || undefined);
  const userBMI = calculateBMI(
    user.heightCm || undefined,
    user.weightKg || undefined
  );

  const context: ToolContext = {
    user: {
      id: user.id,
      age: userAge,
      gender: user.gender || undefined,
      ethnicity: user.ethnicity || undefined,
      heightCm: user.heightCm || undefined,
      weightKg: user.weightKg || undefined,
      bmi: userBMI,
      bloodType: user.bloodType || undefined,

      medicalConditions: parseJsonField<string>(user.medicalConditions),
      allergies: parseJsonField<string>(user.allergies),
      medications: parseJsonField<string>(user.medications),

      profileCompleted: user.profileCompleted,
      dataProcessingConsent: user.dataProcessingConsent,
      researchConsent: user.researchConsent || false,
    },

    metadata: {
      lastUpdated: new Date(),
      dataCompleteness: 0, // Will be calculated below
      reliability: 85, // Base reliability score
      sources: ["user_profile"],
      engagement: {
        lastActivity: new Date(),
      },
    },
  };

  // Add WHOOP data if available
  if (whoopData && whoopStats && whoopUser) {
    context.metadata.sources.push("whoop");
    context.whoop = {
      user: {
        firstName: whoopUser.firstName,
        lastName: whoopUser.lastName,
        email: whoopUser.email,
        heightMeter: whoopUser.heightMeter,
        weightKilogram: whoopUser.weightKilogram,
        maxHeartRate: whoopUser.maxHeartRate,
        lastSyncAt: whoopUser.lastSyncAt,
      },

      data: whoopData,
      stats: whoopStats,

      insights: calculateWhoopInsights(whoopData, whoopStats),
    };

    // Update metadata
    context.metadata.reliability += 10; // WHOOP data increases reliability
  }

  // Add health scores calculation
  context.scores = calculateHealthScores(context);

  // Calculate final data completeness
  context.metadata.dataCompleteness = calculateDataCompleteness(context);

  return context;
}

/**
 * Calculate insights from WHOOP data
 */
function calculateWhoopInsights(data: WhoopDataResponse, stats: WhoopStats) {
  const insights: any = {
    recoveryTrend: mapTrend(stats.trends.recoveryTrend),
    sleepTrend: mapTrend(stats.trends.sleepTrend),
    strainTrend: mapActivityTrend(stats.trends.strainTrend),
    hrvTrend: "stable" as const,
    restingHRTrend: "stable" as const,
  };

  // Calculate averages from recent data
  if (data.recovery.length > 0) {
    const recentRecovery = data.recovery.slice(0, 7);
    insights.avgRecoveryScore = calculateAverage(
      recentRecovery.map((r) => r.recoveryScore).filter(Boolean)
    );
    insights.avgHRV = calculateAverage(
      recentRecovery.map((r) => r.hrvRmssd).filter(Boolean)
    );
    insights.avgRestingHR = calculateAverage(
      recentRecovery.map((r) => r.restingHeartRate).filter(Boolean)
    );

    // Calculate variability (coefficient of variation)
    const recoveryScores = recentRecovery
      .map((r) => r.recoveryScore)
      .filter(Boolean);
    if (recoveryScores.length > 1) {
      insights.recoveryVariability = calculateVariability(recoveryScores);
    }

    const hrvValues = recentRecovery.map((r) => r.hrvRmssd).filter(Boolean);
    if (hrvValues.length > 1) {
      insights.hrvVariability = calculateVariability(hrvValues);
    }
  }

  if (data.sleep.length > 0) {
    const recentSleep = data.sleep.slice(0, 7);
    insights.avgSleepEfficiency = calculateAverage(
      recentSleep.map((s) => s.sleepEfficiencyPercentage).filter(Boolean)
    );

    // Calculate average sleep duration in hours
    const sleepDurations = recentSleep
      .map((s) => s.totalInBedTime)
      .filter(Boolean)
      .map((duration) => duration / (1000 * 60 * 60)); // Convert ms to hours
    insights.avgSleepDuration = calculateAverage(sleepDurations);

    // Calculate sleep consistency (lower variability = better consistency)
    if (sleepDurations.length > 1) {
      const variability = calculateVariability(sleepDurations);
      insights.sleepConsistency = Math.max(0, 100 - variability * 10); // Scale to 0-100
    }
  }

  if (data.cycles.length > 0) {
    const recentCycles = data.cycles.slice(0, 7);
    insights.avgDailyStrain = calculateAverage(
      recentCycles.map((c) => c.strain).filter(Boolean)
    );
  }

  if (data.workouts.length > 0) {
    const recentWorkouts = data.workouts.filter((w) => {
      const workoutDate = new Date(w.start);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate >= weekAgo;
    });
    insights.workoutFrequency = recentWorkouts.length;
  }

  return insights;
}

/**
 * Calculate health scores based on available data
 */
function calculateHealthScores(context: ToolContext) {
  const scores: any = {};

  // Calculate recovery score from WHOOP data
  if (context.whoop?.stats.latestRecovery?.recoveryScore) {
    scores.recovery = context.whoop.stats.latestRecovery.recoveryScore;
  }

  // Calculate sleep score from WHOOP data
  if (context.whoop?.stats.latestSleep?.sleepPerformancePercentage) {
    scores.sleep = context.whoop.stats.latestSleep.sleepPerformancePercentage;
  }

  // Calculate cardiovascular score based on RHR and HRV
  if (context.whoop?.insights.avgRestingHR && context.whoop?.insights.avgHRV) {
    const rhr = context.whoop.insights.avgRestingHR;
    const hrv = context.whoop.insights.avgHRV;

    // Simple cardiovascular score calculation
    // Lower RHR and higher HRV are better
    let cvScore = 50; // Base score

    // Age-adjusted RHR targets
    const userAge = context.user.age || 35;
    const targetRHR = 50 + (userAge - 25) * 0.5; // Rough age adjustment

    if (rhr < targetRHR) {
      cvScore += (targetRHR - rhr) * 2; // 2 points per bpm below target
    } else {
      cvScore -= (rhr - targetRHR) * 1.5; // 1.5 points per bpm above target
    }

    // HRV contribution (values vary widely, so use percentile approach)
    if (hrv > 30) cvScore += 10; // Good HRV
    if (hrv > 50) cvScore += 10; // Excellent HRV
    if (hrv < 20) cvScore -= 10; // Low HRV

    scores.cardiovascular = Math.max(0, Math.min(100, cvScore));
  }

  // Calculate overall score as weighted average
  const availableScores = Object.values(scores).filter(Boolean);
  if (availableScores.length > 0) {
    scores.overall = calculateAverage(availableScores as number[]);
  }

  return scores;
}

// Helper functions
function mapTrend(
  trend: "up" | "down" | "stable"
): "improving" | "declining" | "stable" {
  switch (trend) {
    case "up":
      return "improving";
    case "down":
      return "declining";
    case "stable":
      return "stable";
  }
}

function mapActivityTrend(
  trend: "up" | "down" | "stable"
): "increasing" | "decreasing" | "stable" {
  switch (trend) {
    case "up":
      return "increasing";
    case "down":
      return "decreasing";
    case "stable":
      return "stable";
  }
}

function calculateAverage(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  return (
    Math.round(
      (values.reduce((sum, val) => sum + val, 0) / values.length) * 10
    ) / 10
  );
}

function calculateVariability(values: number[]): number {
  if (values.length < 2) return 0;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    values.length;
  const standardDeviation = Math.sqrt(variance);

  // Return coefficient of variation (CV) as percentage
  return Math.round((standardDeviation / mean) * 100 * 10) / 10;
}

/**
 * Get health data context for a specific user
 * This function fetches and aggregates all available health data
 */
export async function getUserHealthContext(
  userId: string
): Promise<ToolContext | null> {
  try {
    // Import functions here to avoid circular dependencies
    const { getUserById } = await import("@/lib/db/queries");
    const { getWhoopDataAction, processWhoopDataToStats } = await import(
      "@/actions/whoop-data-action"
    );

    // Fetch user data
    const user = await getUserById(userId);
    if (!user) return null;

    // Fetch WHOOP data if available
    let whoopData: WhoopDataResponse | null = null;
    let whoopStats: WhoopStats | null = null;
    let whoopUser = null;

    try {
      const whoopDataResult = await getWhoopDataAction({ days: 30 });
      if (whoopDataResult.data) {
        whoopData = whoopDataResult.data;
      }

      // Process WHOOP data to stats if data is available
      if (whoopData) {
        const whoopStatsResult = await processWhoopDataToStats(whoopData);
        if (whoopStatsResult) {
          whoopStats = whoopStatsResult;
          whoopUser = {
            firstName: whoopData._metadata.userId,
            lastName: whoopData._metadata.userId,
            email: whoopData._metadata.userId,
            heightMeter: undefined,
            weightKilogram: undefined,
            maxHeartRate: undefined,
            lastSyncAt: new Date(whoopData._metadata.fetchedAt),
          };
        }
      }
    } catch (error) {
      console.log("WHOOP data not available for user:", userId);
    }

    // Build and return context
    return buildToolContext({
      user,
      whoopData,
      whoopStats,
      whoopUser,
    });
  } catch (error) {
    console.error("Error building user health context:", error);
    return null;
  }
}

// Cursor rules applied correctly.
