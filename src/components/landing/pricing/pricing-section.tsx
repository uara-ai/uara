"use client";

import { cn } from "@/lib/utils";
import { PricingCard } from "./pricing-card";
import { useState, useEffect } from "react";

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

interface PricingSectionProps {
  className?: string;
  redirectTo?: string;
}

export function PricingSection({ className, redirectTo }: PricingSectionProps) {
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);

  useEffect(() => {
    async function fetchTierInfo() {
      try {
        const response = await fetch("/api/pricing/tier");
        if (response.ok) {
          const data = await response.json();
          setTierInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch tier info:", error);
      }
    }

    fetchTierInfo();
  }, []);

  return (
    <section
      className={cn(
        "relative w-full py-16 lg:py-24 overflow-hidden",
        className
      )}
      id="pricing"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Mobile: Simple title without decorative lines */}
          <div className="block sm:hidden mb-4">
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl font-normal text-[#085983] leading-tight">
              Lifetime deal pricing
            </h2>
          </div>

          {/* Desktop: Decorative title with lines */}
          <div className="hidden sm:flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
            <h2 className="px-6 font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#085983]">
              Lifetime deal pricing
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
          </div>

          <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Pay once. Own Uara forever
          </p>
        </div>

        {/* Pricing Card Container */}
        <div className="flex justify-center">
          <PricingCard tierInfo={tierInfo} />
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .pricing-title {
            font-size: 28px !important;
          }
          .pricing-subtitle {
            font-size: 16px !important;
          }
        }

        @media (max-width: 430px) {
          .pricing-title {
            font-size: 24px !important;
          }
          .pricing-subtitle {
            font-size: 14px !important;
          }
        }
      `}</style>
    </section>
  );
}

// Cursor rules applied correctly.
