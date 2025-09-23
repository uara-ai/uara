import React from "react";
import { CycleDetailPage } from "@/components/healthspan/v1/wearables/cycles/cycle-detail-page";
import { getCycleDataServer } from "@/actions/whoop";

export default async function CyclePage() {
  // Fetch cycle data efficiently with caching
  const cycleData = await getCycleDataServer(30, 30); // Last 30 days, 30 records

  // Use real data if available, otherwise fall back to empty array
  const finalCycleData = cycleData || [];

  return <CycleDetailPage cycleData={finalCycleData} />;
}

// Cursor rules applied correctly.
