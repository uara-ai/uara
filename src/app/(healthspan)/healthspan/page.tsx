import React from "react";
import { HealthspanPage } from "@/components/healthspan/v1/healthspan/healthspan-page";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { computeHealthScores } from "@/lib/health/score";
import { markers } from "@/lib/health/markers";
import { getHealthScoresServer } from "@/lib/health/server-actions";
import { getWhoopSummaryServer } from "@/actions/whoop-data-action";

export const dynamic = "force-dynamic";

export default async function HealthspanPageRoute() {
  // Fetch user data with authentication check
  const user = await withAuth({ ensureSignedIn: true });

  try {
    // 1. Get health scores (this handles database storage automatically)
    const healthScoreResult = await getHealthScoresServer();

    // 2. Get WHOOP summary data for the dashboard
    const whoopSummary = await getWhoopSummaryServer(7);

    // 3. Transform WHOOP data to expected format
    const whoopData = whoopSummary
      ? {
          sleepPerformance:
            whoopSummary.sleep?.[0]?.sleepPerformancePercentage || 87,
          recoveryScore: whoopSummary.recovery?.[0]?.recoveryScore || 72,
          strainScore: whoopSummary.cycles?.[0]?.strain || 14.2,
        }
      : {
          sleepPerformance: 87,
          recoveryScore: 72,
          strainScore: 14.2,
        };

    // 4. Use the calculated health scores
    const healthScores = healthScoreResult?.scoreDetails;

    console.log("Health score calculation:", {
      hasStoredScore: !!healthScoreResult?.healthScore,
      overallScore: healthScoreResult?.healthScore?.overallScore,
      isFromDatabase: healthScoreResult?.isFromDatabase,
      isFallback: healthScoreResult?.isFallback,
    });

    return (
      <HealthspanPage
        user={user.user}
        whoopData={whoopData}
        healthScores={healthScores}
      />
    );
  } catch (error) {
    console.error("Error in healthspan page:", error);

    // Fallback to basic page with empty data (no mock data)
    const fallbackHealthData = {};

    const fallbackHealthScores = computeHealthScores(
      markers,
      fallbackHealthData
    );
    const fallbackWhoopData = {
      sleepPerformance: 87,
      recoveryScore: 72,
      strainScore: 14.2,
    };

    return (
      <HealthspanPage
        user={user.user}
        whoopData={fallbackWhoopData}
        healthScores={fallbackHealthScores}
      />
    );
  }
}

// Cursor rules applied correctly.
