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

interface PricingCardProps {
  tierInfo: TierInfo | null;
  className?: string;
}

export function PricingCard({ tierInfo, className }: PricingCardProps) {
  // Prepare data for the card flip component
  const currentTierTitle = tierInfo
    ? tierInfo.currentTier.name.toUpperCase()
    : "Loading...";
  const currentTierSubtitle = tierInfo
    ? `Lifetime access for ${tierInfo.currentTier.displayPrice}`
    : "Loading pricing information...";
  const currentTierDescription = tierInfo
    ? `Pay once, own Uara forever. ${
        tierInfo.spotsRemaining === Infinity
          ? "Unlimited"
          : tierInfo.spotsRemaining
      } spots remaining in the ${tierInfo.currentTier.name} tier.`
    : "Get lifetime access to Uara's health optimization platform.";

  const features = [
    "Complete health dashboard",
    "AI-powered insights",
    "Wearable integrations",
    "Lab result analysis",
    "Longevity coaching",
    "Progress tracking",
  ];

  return (
    <div
      className={cn("relative max-w-4xl mx-auto w-full", className)}
      data-fast-scroll="scroll_to_pricing"
    >
      {/* Header with spots remaining */}
      <div className="text-center mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <span className="font-geist-sans text-lg sm:text-xl lg:text-2xl font-normal text-[#085983]">
            Offer ends when the first
          </span>
          <div className="bg-[#085983]/10 backdrop-blur-sm rounded-full px-4 py-2 border border-[#085983]/20">
            <span className="font-geist-sans text-lg sm:text-xl lg:text-2xl font-semibold text-[#085983] tracking-wider">
              {tierInfo ? (
                tierInfo.spotsRemaining === Infinity ? (
                  "∞"
                ) : (
                  tierInfo.spotsRemaining
                )
              ) : (
                <div className="animate-pulse bg-[#085983]/20 rounded w-8 h-6"></div>
              )}
            </span>
          </div>
          <span className="font-geist-sans text-lg sm:text-xl lg:text-2xl font-normal text-[#085983]">
            spots are gone
          </span>
        </div>

        <div className="font-geist-sans text-base sm:text-lg text-[#085983]/80">
          {tierInfo ? (
            tierInfo.isLastTier ? (
              "This is the final tier."
            ) : (
              `${tierInfo.nextTier?.name} pricing will then be ${tierInfo.nextTier?.displayPrice}`
            )
          ) : (
            <div className="animate-pulse bg-[#085983]/10 rounded h-5 w-64 mx-auto"></div>
          )}
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
        {/* Current Tier Card */}
        <div className="relative">
          <PricingCardFlip
            title={currentTierTitle}
            subtitle={currentTierSubtitle}
            description={currentTierDescription}
            features={features}
            tierId={tierInfo?.currentTier.id}
            disabled={!tierInfo}
          />
        </div>

        {/* Next Tier Card (if exists) */}
        {tierInfo?.nextTier && (
          <div className="relative opacity-60 scale-95 transform rotate-2">
            <PricingCardFlip
              title={tierInfo.nextTier.name.toUpperCase()}
              subtitle={`Coming soon at ${tierInfo.nextTier.displayPrice}`}
              description={`The next pricing tier will be available once the current ${tierInfo.currentTier.name} tier is filled.`}
              features={[...features, "Priority support", "Beta features"]}
              disabled={true}
            />

            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="bg-[#085983]/90 text-white py-2 px-6 rounded-full text-center font-geist-sans text-sm font-semibold tracking-wider backdrop-blur-sm">
                COMING SOON
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
