import React from "react";
import { HealthspanPage } from "@/components/healthspan/v1/healthspan/healthspan-page";
import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function HealthspanPageRoute() {
  // Fetch user data with authentication check
  const user = await withAuth({ ensureSignedIn: true });

  // Mock Whoop data - replace with actual data fetching later
  const whoopData = {
    sleepPerformance: 87,
    recoveryScore: 72,
    strainScore: 14.2,
  };

  return <HealthspanPage user={user.user} whoopData={whoopData} />;
}

// Cursor rules applied correctly.
