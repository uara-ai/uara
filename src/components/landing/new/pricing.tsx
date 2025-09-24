"use client";

import { useState, useEffect } from "react";
import CardFlip from "@/components/kokonutui/card-flip";
import { useRouter } from "next/navigation";

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

interface PricingCardFlipProps {
  tierInfo: TierInfo | null;
  onGetStarted: () => void;
}

function PricingCardFlip({ tierInfo, onGetStarted }: PricingCardFlipProps) {
  if (!tierInfo) {
    return (
      <div className="w-full">
        <CardFlip
          title="Loading..."
          subtitle="Fetching pricing information..."
          description="Please wait while we load the latest pricing details."
          features={["Loading pricing...", "Please wait..."]}
        />
      </div>
    );
  }

  const { currentTier, spotsRemaining } = tierInfo;

  const title = currentTier.name;
  const subtitle = `Lifetime access for ${currentTier.displayPrice}`;
  const description = `Get lifetime access to all features and future updates.`;

  const features = [
    "Performance optimization",
    "Social accountability",
    "Leaderboard",
    "Health dashboard",
    "AI-powered insights",
    "Wearable integrations",
    "Lab result analysis",
  ];

  return (
    <div onClick={onGetStarted} className="cursor-pointer w-full">
      <CardFlip
        title={title}
        subtitle={subtitle}
        description={description}
        features={features}
      />
    </div>
  );
}

export default function Pricing() {
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchTierInfo() {
      try {
        const response = await fetch("/api/pricing/tier");
        if (response.ok) {
          const data = await response.json();
          setTierInfo(data);
        } else {
          console.log("API response not ok:", response.status);
          // Fallback data for display
          setTierInfo({
            currentTier: {
              id: "tier_3",
              name: "Lifetime Deal",
              price: 9900,
              displayPrice: "$99",
              maxUsers: 50,
            },
            nextTier: {
              id: "tier_4",
              name: "Early Backer",
              price: 14900,
              displayPrice: "$149",
              maxUsers: 25,
            },
            spotsRemaining: 7,
            totalUsers: 43,
            adjustedUserCount: 43,
            isLastTier: false,
          });
        }
      } catch (error) {
        console.error("Failed to fetch tier info:", error);
        // Fallback data for display
        setTierInfo({
          currentTier: {
            id: "tier_3",
            name: "Lifetime Deal",
            price: 9900,
            displayPrice: "$99",
            maxUsers: 50,
          },
          nextTier: {
            id: "tier_4",
            name: "Early Backer",
            price: 14900,
            displayPrice: "$149",
            maxUsers: 50,
          },
          spotsRemaining: 7,
          totalUsers: 43,
          adjustedUserCount: 43,
          isLastTier: false,
        });
      }
    }

    fetchTierInfo();
  }, []);

  const handleGetStarted = () => {
    router.push("/login");
  };

  return (
    <div
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      id="pricing"
    >
      <div className="flex items-center justify-center px-4">
        <div className="hidden sm:flex flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
        <h2 className="px-2 sm:px-6 font-geist-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#085983] text-center">
          Lifetime deal pricing
        </h2>
        <div className="hidden sm:flex flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
      </div>
      <p className="text-center font-geist-sans text-sm sm:text-base md:text-lg lg:text-xl text-[#085983]/80 max-w-4xl mx-auto leading-relaxed px-4 mt-4 sm:mt-6">
        Take your keys now, only <strong>100</strong> lifetime deal spots.
      </p>

      {/* FOMO Section - Spots Remaining */}
      <div className="text-center mt-8 sm:mt-12 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <span className="font-geist-sans text-lg sm:text-xl lg:text-2xl font-normal text-[#085983]">
            Price increase when the first
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
              "This is the final lifetime deal price. After that, subscription pricing will apply."
            ) : (
              <span>
                Pricing will then be{" "}
                <strong>{tierInfo.nextTier?.displayPrice}</strong> for next 50
                spots.
              </span>
            )
          ) : (
            <div className="animate-pulse bg-[#085983]/10 rounded h-5 w-64 mx-auto"></div>
          )}
        </div>
      </div>

      <div className="mt-12 sm:mt-16 lg:mt-20 flex justify-center">
        <div className="w-full max-w-sm">
          <PricingCardFlip
            tierInfo={tierInfo}
            onGetStarted={handleGetStarted}
          />
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
