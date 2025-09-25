import { prisma } from "@/lib/prisma";
import { computeHealthScores } from "./score";
import { markers } from "./markers";
import { MarkerValues } from "./types";

// Category name to enum mapping
const categoryEnumMap: Record<string, string> = {
  Nutrition: "NUTRITION",
  SleepRecovery: "SLEEP_RECOVERY",
  MovementFitness: "MOVEMENT_FITNESS",
  MindStress: "MIND_STRESS",
  HealthChecks: "HEALTH_CHECKS",
};

/**
 * Helper functions for marker score creation
 */
function getCategoryEnum(categoryName: string): any {
  return categoryEnumMap[categoryName] || "HEALTH_CHECKS";
}

function getScoringType(markerId: string): string | null {
  // Find the marker in the config
  for (const [categoryName, categoryMarkers] of Object.entries(markers)) {
    const marker = categoryMarkers.find((m) => m.id === markerId);
    if (marker) {
      return marker.type;
    }
  }
  return null;
}

function getScoringRange(markerId: string): any {
  // Find the marker in the config
  for (const [categoryName, categoryMarkers] of Object.entries(markers)) {
    const marker = categoryMarkers.find((m) => m.id === markerId);
    if (marker) {
      return marker.range;
    }
  }
  return null;
}

function getDataSource(markerId: string, markerValues: MarkerValues): string {
  // Determine data source based on marker ID patterns
  if (
    markerId.includes("whoop") ||
    [
      "recoveryScore",
      "restingHeartRate",
      "hrvRmssd",
      "strain",
      "sleepEfficiencyPercentage",
    ].includes(markerId)
  ) {
    return "whoop";
  }
  if (["bmi", "weight", "height"].includes(markerId)) {
    return "manual";
  }
  if (markerId.includes("calculated") || markerId.includes("derived")) {
    return "calculated";
  }
  return "estimated";
}

function getDataQuality(
  value: number | null | undefined,
  score: number | null
): string {
  if (value === null || value === undefined) {
    return "poor";
  }
  if (score === null) {
    return "fair";
  }
  if (score >= 80) {
    return "excellent";
  }
  if (score >= 60) {
    return "good";
  }
  return "fair";
}

/**
 * Calculate and save health score to database (once per day)
 * @param userId - WorkOS user ID
 * @param markerValues - Object containing marker values by ID
 * @param dataSourceVersion - Optional version string for the scoring algorithm
 * @returns The saved health score record or existing daily score
 */
export async function calculateAndSaveHealthScore(
  userId: string,
  markerValues: MarkerValues,
  dataSourceVersion?: string
) {
  // Check if we already have a score for today
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );

  const existingScore = await prisma.healthScore.findFirst({
    where: {
      userId,
      calculatedAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: { calculatedAt: "desc" },
  });

  // If we already have a score for today, check if it has marker scores
  if (existingScore) {
    // Check if marker scores exist for this health score
    const existingMarkerScores = await prisma.healthMarkerScore.findMany({
      where: { healthScoreId: existingScore.id },
    });

    // If no marker scores exist, we need to create them
    if (existingMarkerScores.length === 0) {
      // Calculate the scores for marker creation
      const scoreResult = computeHealthScores(markers, markerValues);

      // Create marker scores for the existing health score
      const markerScoreData = scoreResult.perMarker.map((marker) => ({
        healthScoreId: existingScore.id,
        userId,
        markerId: marker.id,
        markerLabel: marker.label,
        category: getCategoryEnum(marker.category),
        categoryName: marker.category,
        rawValue: marker.value,
        normalizedValue: marker.value,
        score: marker.score,
        scoringType: getScoringType(marker.id),
        scoringRange: getScoringRange(marker.id),
        dataSource: getDataSource(marker.id, markerValues),
        dataQuality: getDataQuality(marker.value, marker.score),
        measuredAt: new Date(),
      }));

      // Batch create marker scores
      await prisma.healthMarkerScore.createMany({
        data: markerScoreData,
        skipDuplicates: true,
      });

      return {
        healthScore: existingScore,
        scoreDetails: scoreResult,
        isNewRecord: false,
        message: "Daily score exists, added missing marker scores",
      };
    }

    // Both health score and marker scores exist, just return with calculation
    const scoreResult = computeHealthScores(markers, markerValues);
    return {
      healthScore: existingScore,
      scoreDetails: scoreResult,
      isNewRecord: false,
      message: "Daily score already exists for today",
    };
  }

  // Calculate the health scores using the scoring algorithm
  const scoreResult = computeHealthScores(markers, markerValues);

  // Count how many markers were actually used
  const totalMarkersUsed = scoreResult.perMarker.filter(
    (marker) => marker.score !== null && marker.value !== null
  ).length;

  // Calculate data quality score (percentage of expected markers that were available)
  const totalExpectedMarkers = scoreResult.perMarker.filter(
    (marker) => marker.value !== null
  ).length;
  const totalPossibleMarkers = scoreResult.perMarker.length;
  const dataQualityScore = (totalExpectedMarkers / totalPossibleMarkers) * 100;

  // Use transaction to save health score and marker scores separately
  const result = await prisma.$transaction(async (tx) => {
    // First, create the health score
    const healthScore = await tx.healthScore.create({
      data: {
        userId,
        overallScore: isFinite(scoreResult.overall) ? scoreResult.overall : 0,
        nutritionScore: isFinite(scoreResult.category.Nutrition)
          ? scoreResult.category.Nutrition
          : null,
        sleepRecoveryScore: isFinite(scoreResult.category.SleepRecovery)
          ? scoreResult.category.SleepRecovery
          : null,
        movementFitnessScore: isFinite(scoreResult.category.MovementFitness)
          ? scoreResult.category.MovementFitness
          : null,
        mindStressScore: isFinite(scoreResult.category.MindStress)
          ? scoreResult.category.MindStress
          : null,
        healthChecksScore: isFinite(scoreResult.category.HealthChecks)
          ? scoreResult.category.HealthChecks
          : null,
        dataSourceVersion,
        totalMarkersUsed,
        dataQualityScore,
      },
    });

    // Then, create marker scores using the health score ID
    const markerScoreData = scoreResult.perMarker.map((marker) => ({
      healthScoreId: healthScore.id,
      userId,
      markerId: marker.id,
      markerLabel: marker.label,
      category: getCategoryEnum(marker.category),
      categoryName: marker.category,
      rawValue: marker.value,
      normalizedValue: marker.value,
      score: marker.score,
      scoringType: getScoringType(marker.id),
      scoringRange: getScoringRange(marker.id),
      dataSource: getDataSource(marker.id, markerValues),
      dataQuality: getDataQuality(marker.value, marker.score),
      measuredAt: new Date(),
    }));

    // Batch create marker scores
    await tx.healthMarkerScore.createMany({
      data: markerScoreData,
      skipDuplicates: true,
    });

    return healthScore;
  });

  const healthScore = result;

  return {
    healthScore,
    scoreDetails: scoreResult,
    isNewRecord: true,
    message: "New daily health score saved successfully",
  };
}

/**
 * Get the latest health score for a user
 * @param userId - WorkOS user ID
 * @returns The most recent health score record or null if none exists
 */
export async function getLatestHealthScore(userId: string) {
  return prisma.healthScore.findFirst({
    where: { userId },
    orderBy: { calculatedAt: "desc" },
  });
}

/**
 * Get today's health score for a user
 * @param userId - WorkOS user ID
 * @returns Today's health score record or null if none exists
 */
export async function getTodaysHealthScore(userId: string) {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999
  );

  return prisma.healthScore.findFirst({
    where: {
      userId,
      calculatedAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: { calculatedAt: "desc" },
  });
}

/**
 * Get health score history for a user within a date range
 * @param userId - WorkOS user ID
 * @param startDate - Start date for the range
 * @param endDate - End date for the range
 * @returns Array of health score records
 */
export async function getHealthScoreHistory(
  userId: string,
  startDate?: Date,
  endDate?: Date
) {
  const where: any = { userId };

  if (startDate || endDate) {
    where.calculatedAt = {};
    if (startDate) where.calculatedAt.gte = startDate;
    if (endDate) where.calculatedAt.lte = endDate;
  }

  return prisma.healthScore.findMany({
    where,
    orderBy: { calculatedAt: "desc" },
  });
}

/**
 * Get weekly health scores count for a user (should be max 7 scores per week)
 * @param userId - WorkOS user ID
 * @param weeks - Number of weeks to look back (default: 1)
 * @returns Array of weekly score counts
 */
export async function getWeeklyScoreCounts(userId: string, weeks: number = 1) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - weeks * 7);

  const scores = await prisma.healthScore.findMany({
    where: {
      userId,
      calculatedAt: {
        gte: startDate,
      },
    },
    select: {
      calculatedAt: true,
    },
    orderBy: { calculatedAt: "desc" },
  });

  // Group by week
  const weeklyGroups: { [key: string]: number } = {};

  scores.forEach((score: any) => {
    const weekStart = new Date(score.calculatedAt);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const weekKey = weekStart.toISOString().split("T")[0];
    weeklyGroups[weekKey] = (weeklyGroups[weekKey] || 0) + 1;
  });

  return Object.entries(weeklyGroups)
    .map(([weekStart, count]) => ({
      weekStart,
      count,
      isValid: count <= 7, // Should never exceed 7 scores per week
    }))
    .sort((a, b) => b.weekStart.localeCompare(a.weekStart));
}

/**
 * Get average scores for a user over the last N days
 * @param userId - WorkOS user ID
 * @param days - Number of days to look back (default: 30)
 * @returns Average scores for each category and overall
 */
export async function getAverageHealthScores(
  userId: string,
  days: number = 30
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const scores = await prisma.healthScore.findMany({
    where: {
      userId,
      calculatedAt: {
        gte: startDate,
      },
    },
    select: {
      overallScore: true,
      nutritionScore: true,
      sleepRecoveryScore: true,
      movementFitnessScore: true,
      mindStressScore: true,
      healthChecksScore: true,
    },
  });

  if (scores.length === 0) {
    return null;
  }

  // Calculate averages, filtering out null values
  const averages = {
    overall: scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length,
    nutrition:
      scores
        .filter((s) => s.nutritionScore !== null)
        .reduce((sum, s) => sum + (s.nutritionScore || 0), 0) /
        scores.filter((s) => s.nutritionScore !== null).length || null,
    sleepRecovery:
      scores
        .filter((s) => s.sleepRecoveryScore !== null)
        .reduce((sum, s) => sum + (s.sleepRecoveryScore || 0), 0) /
        scores.filter((s) => s.sleepRecoveryScore !== null).length || null,
    movementFitness:
      scores
        .filter((s) => s.movementFitnessScore !== null)
        .reduce((sum, s) => sum + (s.movementFitnessScore || 0), 0) /
        scores.filter((s) => s.movementFitnessScore !== null).length || null,
    mindStress:
      scores
        .filter((s) => s.mindStressScore !== null)
        .reduce((sum, s) => sum + (s.mindStressScore || 0), 0) /
        scores.filter((s) => s.mindStressScore !== null).length || null,
    healthChecks:
      scores
        .filter((s) => s.healthChecksScore !== null)
        .reduce((sum, s) => sum + (s.healthChecksScore || 0), 0) /
        scores.filter((s) => s.healthChecksScore !== null).length || null,
  };

  return {
    averages,
    sampleSize: scores.length,
    periodDays: days,
  };
}

/**
 * Get detailed marker scores for a specific health score
 * @param healthScoreId - Health score ID
 * @returns Array of marker scores with details
 */
export async function getMarkerScoresForHealthScore(healthScoreId: string) {
  return prisma.healthMarkerScore.findMany({
    where: { healthScoreId },
    orderBy: [{ category: "asc" }, { markerId: "asc" }],
  });
}

/**
 * Get marker scores by category for a user's latest health score
 * @param userId - WorkOS user ID
 * @param category - Optional category filter
 * @returns Object with marker scores grouped by category
 */
export async function getLatestMarkerScoresByCategory(
  userId: string,
  category?: string
) {
  const latestHealthScore = await getLatestHealthScore(userId);
  if (!latestHealthScore) {
    return null;
  }

  const where: any = { healthScoreId: latestHealthScore.id };
  if (category) {
    where.category = category
      .toUpperCase()
      .replace(/([A-Z])/g, "_$1")
      .substring(1);
  }

  const markerScores = await prisma.healthMarkerScore.findMany({
    where,
    orderBy: [{ category: "asc" }, { score: "desc" }],
  });

  // Group by category
  const groupedScores: Record<string, typeof markerScores> = {};
  markerScores.forEach((score: any) => {
    if (!groupedScores[score.categoryName]) {
      groupedScores[score.categoryName] = [];
    }
    groupedScores[score.categoryName].push(score);
  });

  return {
    healthScoreId: latestHealthScore.id,
    calculatedAt: latestHealthScore.calculatedAt,
    markerScores: groupedScores,
    totalMarkers: markerScores.length,
  };
}

/**
 * Get marker score trends over time for specific markers
 * @param userId - WorkOS user ID
 * @param markerIds - Array of marker IDs to track
 * @param days - Number of days to look back
 * @returns Trends data for specified markers
 */
export async function getMarkerScoreTrends(
  userId: string,
  markerIds: string[],
  days: number = 30
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const scores = await prisma.healthMarkerScore.findMany({
    where: {
      userId,
      markerId: { in: markerIds },
      calculatedAt: { gte: startDate },
    },
    include: {
      healthScore: {
        select: {
          id: true,
          calculatedAt: true,
        },
      },
    },
    orderBy: { calculatedAt: "desc" },
  });

  // Group by marker ID
  const trends: Record<string, any[]> = {};
  scores.forEach((score: any) => {
    if (!trends[score.markerId]) {
      trends[score.markerId] = [];
    }
    trends[score.markerId].push({
      date: score.calculatedAt,
      value: score.rawValue,
      score: score.score,
      dataQuality: score.dataQuality,
    });
  });

  return {
    trends,
    periodDays: days,
    markerIds,
    totalDataPoints: scores.length,
  };
}

/**
 * Get category performance summary for a user
 * @param userId - WorkOS user ID
 * @param days - Number of days to analyze
 * @returns Summary of performance by category
 */
export async function getCategoryPerformanceSummary(
  userId: string,
  days: number = 30
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const markerScores = await prisma.healthMarkerScore.findMany({
    where: {
      userId,
      calculatedAt: { gte: startDate },
      score: { not: null },
    },
    select: {
      category: true,
      categoryName: true,
      score: true,
      calculatedAt: true,
    },
    orderBy: { calculatedAt: "desc" },
  });

  // Group by category and calculate averages
  const categoryStats: Record<
    string,
    {
      name: string;
      scores: number[];
      average: number;
      trend: string;
      dataPoints: number;
    }
  > = {};

  markerScores.forEach((score: any) => {
    if (!categoryStats[score.categoryName]) {
      categoryStats[score.categoryName] = {
        name: score.categoryName,
        scores: [],
        average: 0,
        trend: "stable",
        dataPoints: 0,
      };
    }
    if (score.score !== null) {
      categoryStats[score.categoryName].scores.push(score.score);
    }
  });

  // Calculate averages and trends
  Object.values(categoryStats).forEach((category) => {
    if (category.scores.length > 0) {
      category.average =
        category.scores.reduce((sum, s) => sum + s, 0) / category.scores.length;
      category.dataPoints = category.scores.length;

      // Simple trend calculation (first half vs second half)
      if (category.scores.length >= 4) {
        const mid = Math.floor(category.scores.length / 2);
        const firstHalf = category.scores.slice(0, mid);
        const secondHalf = category.scores.slice(mid);

        const firstAvg =
          firstHalf.reduce((sum, s) => sum + s, 0) / firstHalf.length;
        const secondAvg =
          secondHalf.reduce((sum, s) => sum + s, 0) / secondHalf.length;

        const diff = secondAvg - firstAvg;
        category.trend =
          diff > 2 ? "improving" : diff < -2 ? "declining" : "stable";
      }
    }
  });

  return {
    categories: categoryStats,
    periodDays: days,
    totalDataPoints: markerScores.length,
  };
}

// Cursor rules applied correctly.
