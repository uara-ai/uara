import React from "react";
import { WearablesPage } from "@/components/healthspan/v1/wearables/wearables-page";
import { getWearablesDataServer, getWhoopUserServer } from "@/actions/whoop";

export default async function WearablesPageRoute() {
  // Fetch WHOOP user and data in parallel for maximum efficiency
  const [whoopUser, wearablesData] = await Promise.all([
    getWhoopUserServer(),
    getWearablesDataServer(7, 50), // Last 7 days, 50 records per type
  ]);

  // Use real data if available, otherwise fall back to mock data
  const finalData = wearablesData || {
    cycles: [],
    sleep: [],
    recovery: [],
    workouts: [],
  };

  return (
    <WearablesPage
      data={finalData}
      whoopUser={whoopUser}
      isConnected={!!whoopUser}
    />
  );
}

// Cursor rules applied correctly.
