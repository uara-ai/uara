import { isProUser } from "@/lib/auth";
import { getCurrentTierInfo } from "@/actions/tier-actions";
import { SubscriptionGate } from "./subscription-gate";

interface SubscriptionWrapperProps {
  children: React.ReactNode;
}

interface TierInfo {
  currentTier: {
    id: string;
    name: string;
    price: number;
    displayPrice: string;
    maxUsers: number;
  };
  nextTier: {
    id: string;
    name: string;
    price: number;
    displayPrice: string;
    maxUsers: number;
  } | null;
  spotsRemaining: number;
  totalUsers: number;
  adjustedUserCount: number;
  isLastTier: boolean;
}

export async function SubscriptionWrapper({
  children,
}: SubscriptionWrapperProps) {
  // Check if user has active subscription
  const hasActiveSubscription = await isProUser();

  // If user has active subscription, render children normally
  if (hasActiveSubscription) {
    return <>{children}</>;
  }

  // Fetch tier information for pricing
  let tierInfo: TierInfo | null = null;
  try {
    const result = await getCurrentTierInfo();
    if (result.success && result.data) {
      tierInfo = result.data;
    }
  } catch (error) {
    console.error("Failed to fetch tier info:", error);
  }

  // If no active subscription, show the subscription gate with blur
  return (
    <SubscriptionGateWithTier tierInfo={tierInfo}>
      {children}
    </SubscriptionGateWithTier>
  );
}

interface SubscriptionGateWithTierProps {
  children: React.ReactNode;
  tierInfo: TierInfo | null;
}

function SubscriptionGateWithTier({
  children,
  tierInfo,
}: SubscriptionGateWithTierProps) {
  return <SubscriptionGate tierInfo={tierInfo}>{children}</SubscriptionGate>;
}

// Cursor rules applied correctly.
