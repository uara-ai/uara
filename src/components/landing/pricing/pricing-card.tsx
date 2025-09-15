"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PricingTier } from "./pricing-tier";
import Image from "next/image";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn("relative max-w-6xl mx-auto w-full", className)}>
      {/* Background Image Container */}
      <div
        className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/pricing.jpg"
            alt="Scenic landscape background"
            className={cn(
              "w-full h-full object-cover transition-transform duration-700"
            )}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#085983]/10 via-[#085983]/30 to-[#085983]/60"></div>
          {/* Additional overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[400px] sm:min-h-[500px]">
            {/* Left Side - Offer Details */}
            <div className="text-white space-y-6 lg:space-y-8 text-center">
              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-center">
                  <span className="font-[family-name:var(--font-geist-sans)] text-xl sm:text-2xl lg:text-3xl font-normal">
                    Offer end when the first
                  </span>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border-2 border-[#085983]">
                    <span className="font-[family-name:var(--font-instrument-serif)] text-lg sm:text-xl lg:text-2xl font-semibold text- tracking-wider">
                      {tierInfo ? (
                        tierInfo.spotsRemaining === Infinity ? (
                          "∞"
                        ) : (
                          tierInfo.spotsRemaining
                        )
                      ) : (
                        <div className="animate-pulse bg-white/30 rounded w-8 h-6"></div>
                      )}
                    </span>
                  </div>
                </div>

                <p className="font-[family-name:var(--font-geist-sans)] text-xl sm:text-2xl lg:text-3xl font-normal">
                  spots are gone.
                </p>

                <div className="font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl lg:text-2xl font-normal text-white/90">
                  {tierInfo ? (
                    tierInfo.isLastTier ? (
                      "This is the final tier."
                    ) : (
                      `${tierInfo.nextTier?.name} pricing will then be ${tierInfo.nextTier?.displayPrice}.`
                    )
                  ) : (
                    <div className="animate-pulse bg-white/20 rounded h-6 w-64 mx-auto"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Pricing Card */}
            <PricingTier tierInfo={tierInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
