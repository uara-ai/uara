"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";
import { Logo } from "@/components/logo";
import { Feather, Lock, Shield, Users, Zap } from "lucide-react";
import { SignOut } from "../auth/sign-out";

interface SubscriptionGateProps {
  children: React.ReactNode;
  tierInfo: TierInfo | null;
  className?: string;
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

export function SubscriptionGate({
  children,
  tierInfo,
  className,
}: SubscriptionGateProps) {
  const { checkout, isLoading, error } = useCheckout();

  // Fallback tier info if not provided
  const defaultTierInfo: TierInfo = {
    currentTier: {
      id: "tier_1",
      name: "FOUNDER",
      price: 9700,
      displayPrice: "$97",
      maxUsers: 100,
    },
    nextTier: {
      id: "tier_2",
      name: "EARLY",
      price: 19700,
      displayPrice: "$197",
      maxUsers: 500,
    },
    spotsRemaining: 23,
    totalUsers: 77,
    adjustedUserCount: 77,
    isLastTier: false,
  };

  const activeTierInfo = tierInfo || defaultTierInfo;

  const handleUpgrade = async () => {
    await checkout(activeTierInfo.currentTier.id);
  };

  return (
    <div className={cn("relative min-h-screen", className)}>
      {/* Blurred background content */}
      <div className="absolute inset-0 blur-xs select-none pointer-events-none opacity-80">
        {children}
      </div>

      {/* Gradient overlay matching waitlist page */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50/30" />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Header section */}
        <div className="max-w-2xl mx-auto text-center space-y-6 mb-8">
          <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-geist-sans)] font-light tracking-tight text-[#085983]">
            Unlock Your Dashboard
          </h1>

          <p className="text-lg md:text-xl text-[#085983]/80 font-light max-w-xl mx-auto">
            Get lifetime access to your personalized longevity insights and
            AI-powered health analytics.
          </p>
        </div>

        {/* Compact pricing card */}
        <div className="w-full max-w-lg mx-auto">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            {/* Glass background with blue tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/90 via-white/85 to-blue-50/80 backdrop-blur-md border border-[#085983]/20"></div>

            {/* Content */}
            <div className="relative z-10 p-8 text-center">
              {/* Tier badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#085983]/10 rounded-full mb-6">
                <Feather className="size-4 text-[#085983]" />
                <span className="text-sm font-medium text-[#085983] uppercase tracking-wider">
                  {activeTierInfo.currentTier.name} TIER
                </span>
              </div>

              {/* Price */}
              <div className="space-y-3 mb-6">
                <div className="font-[family-name:var(--font-instrument-serif)] text-5xl font-bold text-[#085983] tracking-wider">
                  {activeTierInfo.currentTier.displayPrice}
                </div>
                <p className="text-[#085983]/70 text-lg">
                  One-time payment • Lifetime access
                </p>
              </div>

              {/* Spots remaining */}
              <div className="flex items-center justify-center gap-2 text-sm mb-6 px-4 py-2 bg-lime-100 rounded-full border border-lime-500">
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse" />
                <span className="text-[#085983]/80">
                  Only{" "}
                  <span className="font-semibold text-[#085983]">
                    {activeTierInfo.spotsRemaining}
                  </span>{" "}
                  spots available at this price
                </span>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleUpgrade}
                disabled={isLoading}
                size="lg"
                className="w-full bg-gradient-to-b from-[#085983] via-[#0a6b99] to-[#085983] hover:from-[#074a6b] hover:via-[#085983] hover:to-[#074a6b] text-white font-[family-name:var(--font-instrument-serif)] text-xl font-bold py-6 px-8 rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 tracking-widest border-2 border-[#085983]/50"
                style={{
                  boxShadow:
                    "0 8px 20px rgba(8, 89, 131, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    PROCESSING...
                  </div>
                ) : (
                  "CLAIM NOW"
                )}
              </Button>

              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

              {/* Trust signals */}
              <div className="mt-6 pt-6 border-t border-[#085983]/10">
                <div className="grid grid-cols-1 gap-3 text-xs text-[#085983]/60">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="size-3" />
                    <span>Secure payment via Stripe</span>
                  </div>
                  {activeTierInfo.totalUsers > 5 && (
                    <div className="flex items-center justify-center gap-2">
                      <Users className="size-3" />
                      <span>
                        {activeTierInfo.totalUsers}+ users secured their spot
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="items-center mt-4">
          <SignOut />
        </div>

        {/* Bottom branding */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2 text-[#085983]/40">
            <Logo hidden className="size-5" />
            <span className="text-sm">uara.ai</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
