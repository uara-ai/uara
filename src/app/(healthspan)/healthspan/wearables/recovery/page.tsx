import React from "react";
import { RecoveryDetailPage } from "@/components/healthspan/v1/wearables/recovery/recovery-detail-page";
import { getRecoveryDataServer } from "@/actions/whoop";

export const dynamic = "force-dynamic";

export default async function RecoveryPage() {
  // Fetch recovery data efficiently with caching
  const recoveryData = await getRecoveryDataServer(30, 30); // Last 30 days, 30 records

  // Use real data if available, otherwise fall back to empty array
  const finalRecoveryData = recoveryData || [];

  return <RecoveryDetailPage recoveryData={finalRecoveryData} />;
}

// Cursor rules applied correctly.
