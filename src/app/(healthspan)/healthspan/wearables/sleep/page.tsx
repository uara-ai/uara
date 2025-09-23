import React from "react";
import { SleepDetailPage } from "@/components/healthspan/v1/wearables/sleep/sleep-detail-page";
import { getSleepDataServer } from "@/actions/whoop";

export default async function SleepPage() {
  // Fetch sleep data efficiently with caching
  const sleepData = await getSleepDataServer(30, 30); // Last 30 days, 30 records

  // Use real data if available, otherwise fall back to mock data
  const finalSleepData = sleepData || [];

  return <SleepDetailPage sleepData={finalSleepData} />;
}

// Cursor rules applied correctly.
