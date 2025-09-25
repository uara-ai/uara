import { prisma } from "@/lib/prisma";
import { computeHealthScores } from "./score";
import { markers } from "./markers";
import { MarkerValues } from "./types";

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

  // If we already have a score for today, return it with updated calculation
  if (existingScore) {
    // Still calculate the scores for return value, but don't save a new record
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

  // Save new daily score to database
  const healthScore = await prisma.healthScore.create({
    data: {
      userId,
      overallScore: scoreResult.overall,
      nutritionScore: scoreResult.category.Nutrition || null,
      sleepRecoveryScore: scoreResult.category.SleepRecovery || null,
      movementFitnessScore: scoreResult.category.MovementFitness || null,
      mindStressScore: scoreResult.category.MindStress || null,
      healthChecksScore: scoreResult.category.HealthChecks || null,
      dataSourceVersion,
      totalMarkersUsed,
      dataQualityScore,
    },
  });

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

  scores.forEach((score) => {
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

// Cursor rules applied correctly.
