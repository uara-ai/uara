import React from "react";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { ScoreExplanationPage } from "@/components/healthspan/v1/score";
import { getHealthScoresServer } from "@/lib/health/server-actions";
import { markers } from "@/lib/health/markers";

export const dynamic = "force-dynamic";

export default async function HealthSpanScorePage() {
  // Fetch user data with authentication check
  const user = await withAuth({ ensureSignedIn: true });

  try {
    // Get current health scores for context
    const healthScoreResult = await getHealthScoresServer();

    return (
      <ScoreExplanationPage
        user={user.user}
        healthScoreResult={healthScoreResult}
        markers={markers}
      />
    );
  } catch (error) {
    console.error("Error in health score explanation page:", error);

    return (
      <ScoreExplanationPage
        user={user.user}
        healthScoreResult={null}
        markers={markers}
      />
    );
  }
}

// Cursor rules applied correctly.
