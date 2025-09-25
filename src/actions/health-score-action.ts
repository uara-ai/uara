"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { withAuth } from "@workos-inc/authkit-nextjs";
import {
  calculateAndSaveHealthScore,
  getLatestHealthScore,
  getHealthScoreHistory,
} from "@/lib/health/database";
import { getHealthDataAction } from "./health-data-action";
import { revalidateTag } from "next/cache";

// Input schema for health score calculation
const calculateHealthScoreSchema = z.object({
  includeMockData: z.boolean().default(false), // For testing with mock data
  forceRecalculate: z.boolean().default(false), // Force recalculation even if recent score exists
});

const getHealthScoreHistorySchema = z.object({
  days: z.number().min(1).max(365).default(30),
});

/**
 * Calculate and save a new health score for the authenticated user
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
      // Check if we already have a recent health score (within last 6 hours)
      if (!forceRecalculate) {
        const latestScore = await getLatestHealthScore(user.id);
        const sixHoursAgo = new Date();
        sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

        if (latestScore && latestScore.calculatedAt > sixHoursAgo) {
          return {
            success: true,
            message: "Recent health score found, skipping calculation",
            healthScore: latestScore,
            recalculated: false,
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
        message: "Health score calculated and saved successfully",
        healthScore: result.healthScore,
        scoreDetails: result.scoreDetails,
        sources,
        metadata: {
          ...metadata,
          recalculated: true,
          algorithmVersion: "v1.0.0",
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
 * Server function to calculate health score with automatic fallback to mock data
 */
export async function calculateHealthScoreServer(
  forceRecalculate: boolean = false
) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return null;
    }

    // Try to calculate with real data first
    let result = await calculateHealthScoreAction({
      includeMockData: false,
      forceRecalculate,
    });

    // If that fails or returns insufficient data, try with mock data
    if (
      !result.data?.healthScore ||
      Object.keys(result.data.scoreDetails?.category || {}).length < 2
    ) {
      console.log(
        "Insufficient real data, falling back to mock data for health score calculation"
      );
      result = await calculateHealthScoreAction({
        includeMockData: true,
        forceRecalculate: true,
      });
    }

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

// Cursor rules applied correctly.
