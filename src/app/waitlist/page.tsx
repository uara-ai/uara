"use client";

import { Logo } from "@/components/logo";
import { useState, useEffect } from "react";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { PricingCard } from "@/components/landing/pricing/pricing-card";
import { SignOut } from "@/components/auth/sign-out";

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

export default function WaitlistPage() {
  const { user } = useAuth();
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);
  const [hasFetchedTiers, setHasFetchedTiers] = useState(false);

  // Only redirect once when we confirm user is null (not undefined/loading)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user === null && !hasRedirected) {
        setHasRedirected(true);
        window.location.replace("/login");
      }
    }, 100); // Small delay to ensure auth state is stable

    return () => clearTimeout(timer);
  }, [user, hasRedirected]);

  // Fetch tier info only once when component mounts - completely independent of user state
  useEffect(() => {
    if (hasFetchedTiers) return; // Prevent multiple fetches

    let mounted = true;

    const loadTierInfo = async () => {
      try {
        const response = await fetch("/api/pricing/tier");
        if (response.ok && mounted) {
          const data = await response.json();
          setTierInfo(data);
          setHasFetchedTiers(true); // Mark as fetched
        }
      } catch (error) {
        if (mounted) {
          console.error("Failed to fetch tier info:", error);
        }
      }
    };

    loadTierInfo();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#085983]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-12">
          <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-instrument-serif)] font-light tracking-tight text-[#085983]">
            Get Your Lifetime Access
          </h1>
          <p className="text-lg md:text-xl text-[#085983]/80 font-light max-w-2xl mx-auto">
            Join thousands of users who have already secured their spot.
            Limited-time lifetime deals available now.
          </p>

          <div className="flex flex-col items-center justify-center gap-2 text-[#085983]/60">
            <span className="text-sm">
              Signed in as{" "}
              <span className="text-[#085983] font-semibold">{user.email}</span>
            </span>
            <div className="items-center">
              <SignOut />
            </div>
          </div>
        </div>

        {/* Dynamic Pricing Card */}
        <div className="w-full max-w-6xl mx-auto">
          <PricingCard tierInfo={tierInfo} />
        </div>

        {/* User Stats */}
        <div className="mt-12 text-center text-[#085983]/60">
          <span className="text-sm">
            {tierInfo ? (
              `${tierInfo.totalUsers} users have already claimed their lifetime access`
            ) : (
              <div className="animate-pulse bg-[#085983]/20 rounded h-4 w-80 mx-auto"></div>
            )}
          </span>
        </div>

        {/* Navigation indicator */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2 text-[#085983]/40">
            <Logo hidden className="size-6" />
            <span className="text-sm">uara.ai</span>
          </div>
        </div>
      </div>
    </div>
  );
}
