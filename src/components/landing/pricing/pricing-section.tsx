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
    <div
      className={cn(
        "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
        className
      )}
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
        Pay once. Own Uara forever. Get ahead of the curve with lifetime access.
      </p>

      <div className="mt-12 sm:mt-16 lg:mt-20">
        <PricingCard tierInfo={tierInfo} />
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
