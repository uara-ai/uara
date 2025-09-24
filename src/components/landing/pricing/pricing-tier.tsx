"use client";

import { cn } from "@/lib/utils";
import PricingCardFlip from "./pricing-card-flip";

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

interface PricingTierProps {
  tierInfo: TierInfo | null;
  className?: string;
  features?: string[];
  disabled?: boolean;
  onClaimClick?: () => void;
}

export function PricingTier({
  tierInfo,
  className,
  features = [
    "Complete health dashboard",
    "AI-powered insights",
    "Wearable integrations",
    "Lab result analysis",
  ],
  disabled = false,
  onClaimClick,
}: PricingTierProps) {
  const title = tierInfo
    ? tierInfo.currentTier.name.toUpperCase()
    : "Loading...";
  const subtitle = tierInfo
    ? `Lifetime access for ${tierInfo.currentTier.displayPrice}`
    : "Loading pricing information...";
  const description = tierInfo
    ? `Pay once, own Uara forever. ${
        tierInfo.spotsRemaining === Infinity
          ? "Unlimited"
          : tierInfo.spotsRemaining
      } spots remaining.`
    : "Get lifetime access to Uara's health optimization platform.";

  return (
    <div className={cn("relative", className)}>
      <PricingCardFlip
        title={title}
        subtitle={subtitle}
        description={description}
        features={features}
        tierId={tierInfo?.currentTier.id}
        disabled={disabled || !tierInfo}
        onClaimClick={onClaimClick}
      />
    </div>
  );
}

// Cursor rules applied correctly.
