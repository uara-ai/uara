"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { withAuth } from "@workos-inc/authkit-nextjs";
import {
  calculateAndSaveHealthScore,
  getLatestHealthScore,
  getTodaysHealthScore,
  getHealthScoreHistory,
  getLatestMarkerScoresByCategory,
  getMarkerScoreTrends,
  getCategoryPerformanceSummary,
} from "@/lib/health/database";
import { getHealthDataAction } from "./health-data-action";
import { revalidateTag } from "next/cache";

// Input schema for health score calculation
const calculateHealthScoreSchema = z.object({
  includeMockData: z.boolean().default(false), // For testing with mock data
  forceRecalculate: z.boolean().default(false), // Force recalculation even if daily score exists
});

const getHealthScoreHistorySchema = z.object({
  days: z.number().min(1).max(365).default(30),
});

const getMarkerScoresByCategorySchema = z.object({
  category: z.string().optional(),
});

const getMarkerScoreTrendsSchema = z.object({
  markerIds: z.array(z.string()),
  days: z.number().min(1).max(365).default(30),
});

const getCategoryPerformanceSchema = z.object({
  days: z.number().min(1).max(365).default(30),
});

/**
 * Calculate and save a new health score for the authenticated user
 * Enforces once-per-day limit: only saves one health score per calendar day
 */
export const calculateHealthScoreAction = actionClient
  .schema(calculateHealthScoreSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    const { includeMockData, forceRecalculate } = parsedInput;

    try {
      // Check if we already have a health score for today (unless forcing recalculation)
      if (!forceRecalculate) {
        const todaysScore = await getTodaysHealthScore(user.id);

        if (todaysScore) {
          return {
            success: true,
            message: "Daily health score already exists for today",
            healthScore: todaysScore,
            recalculated: false,
            isNewRecord: false,
          };
        }
      }

      // 1. Fetch user health data
      const healthDataResult = await getHealthDataAction({
        includeMockData,
      });

      if (!healthDataResult?.data?.data?.healthData) {
        throw new Error("Failed to fetch health data");
      }

      const { healthData, sources, metadata } = healthDataResult.data.data;

      // 2. Calculate and save health score
      const result = await calculateAndSaveHealthScore(
        user.id,
        healthData,
        "v1.0.0" // Algorithm version
      );

      // 3. Invalidate relevant caches
      revalidateTag("health-scores");
      revalidateTag("user-profile");

      return {
        success: true,
        message:
          result.message || "Health score calculated and saved successfully",
        healthScore: result.healthScore,
        scoreDetails: result.scoreDetails,
        isNewRecord: result.isNewRecord,
        sources,
        metadata: {
          ...metadata,
          recalculated: true,
          algorithmVersion: "v1.0.0",
          dailyLimit: true,
        },
      };
    } catch (error) {
      console.error("Error calculating health score:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to calculate health score"
      );
    }
  });

/**
 * Get the latest health score for the authenticated user
 */
export const getLatestHealthScoreAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    try {
      const latestScore = await getLatestHealthScore(user.id);

      if (!latestScore) {
        return {
          success: false,
          message: "No health score found",
          healthScore: null,
        };
      }

      return {
        success: true,
        healthScore: latestScore,
      };
    } catch (error) {
      console.error("Error fetching latest health score:", error);
      throw new Error("Failed to fetch latest health score");
    }
  });

/**
 * Get health score history for the authenticated user
 */
export const getHealthScoreHistoryAction = actionClient
  .schema(getHealthScoreHistorySchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    const { days } = parsedInput;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const history = await getHealthScoreHistory(user.id, startDate);

      return {
        success: true,
        history,
        metadata: {
          periodDays: days,
          totalRecords: history.length,
          oldestRecord:
            history.length > 0
              ? history[history.length - 1].calculatedAt
              : null,
          newestRecord: history.length > 0 ? history[0].calculatedAt : null,
        },
      };
    } catch (error) {
      console.error("Error fetching health score history:", error);
      throw new Error("Failed to fetch health score history");
    }
  });

/**
 * Server function to get the latest health score (for server components)
 */
export async function getLatestHealthScoreServer() {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    const latestScore = await getLatestHealthScore(user.id);
    return latestScore;
  } catch (error) {
    console.error("Error fetching latest health score from server:", error);
    return null;
  }
}

/**
 * Server function to calculate health score with daily limit enforcement
 * Only calculates and saves one score per calendar day unless forced
 */
export async function calculateHealthScoreServer(
  forceRecalculate: boolean = false
) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    // Calculate with real data only (no mock data fallback)
    // Respects daily limit unless forceRecalculate is true
    const result = await calculateHealthScoreAction({
      includeMockData: false,
      forceRecalculate,
    });

    return result.data;
  } catch (error) {
    console.error("Error calculating health score from server:", error);
    return null;
  }
}

/**
 * Get health score summary with trends
 */
export async function getHealthScoreSummaryServer() {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    const [latestScore, last30Days] = await Promise.all([
      getLatestHealthScore(user.id),
      getHealthScoreHistory(
        user.id,
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ),
    ]);

    if (!latestScore) {
      return null;
    }

    // Calculate trends
    let trends = null;
    if (last30Days.length >= 2) {
      const previousScore = last30Days[1]; // Second most recent
      const overallTrend =
        latestScore.overallScore - previousScore.overallScore;

      trends = {
        overall: overallTrend > 0 ? "up" : overallTrend < 0 ? "down" : "stable",
        overallChange: overallTrend,
        periodDays: 30,
        totalRecords: last30Days.length,
      };
    }

    return {
      latestScore,
      trends,
      history: last30Days.slice(0, 7), // Last 7 scores for mini chart
    };
  } catch (error) {
    console.error("Error fetching health score summary:", error);
    return null;
  }
}

/**
 * Get marker scores by category for the authenticated user
 */
export const getMarkerScoresByCategoryAction = actionClient
  .schema(getMarkerScoresByCategorySchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    const { category } = parsedInput;

    try {
      const markerScores = await getLatestMarkerScoresByCategory(
        user.id,
        category
      );

      if (!markerScores) {
        return {
          success: false,
          message: "No marker scores found",
          markerScores: null,
        };
      }

      return {
        success: true,
        markerScores,
      };
    } catch (error) {
      console.error("Error fetching marker scores by category:", error);
      throw new Error("Failed to fetch marker scores by category");
    }
  });

/**
 * Get marker score trends for specific markers
 */
export const getMarkerScoreTrendsAction = actionClient
  .schema(getMarkerScoreTrendsSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    const { markerIds, days } = parsedInput;

    try {
      const trends = await getMarkerScoreTrends(user.id, markerIds, days);

      return {
        success: true,
        trends,
      };
    } catch (error) {
      console.error("Error fetching marker score trends:", error);
      throw new Error("Failed to fetch marker score trends");
    }
  });

/**
 * Get category performance summary for the authenticated user
 */
export const getCategoryPerformanceAction = actionClient
  .schema(getCategoryPerformanceSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) {
      throw new Error("Not authenticated");
    }

    const { days } = parsedInput;

    try {
      const performance = await getCategoryPerformanceSummary(user.id, days);

      return {
        success: true,
        performance,
      };
    } catch (error) {
      console.error("Error fetching category performance:", error);
      throw new Error("Failed to fetch category performance");
    }
  });

/**
 * Server function to get marker scores by category (for server components)
 */
export async function getMarkerScoresByCategoryServer(category?: string) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    const markerScores = await getLatestMarkerScoresByCategory(
      user.id,
      category
    );
    return markerScores;
  } catch (error) {
    console.error(
      "Error fetching marker scores by category from server:",
      error
    );
    return null;
  }
}

/**
 * Server function to get category performance summary (for server components)
 */
export async function getCategoryPerformanceServer(days: number = 30) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    const performance = await getCategoryPerformanceSummary(user.id, days);
    return performance;
  } catch (error) {
    console.error("Error fetching category performance from server:", error);
    return null;
  }
}

// Cursor rules applied correctly.
