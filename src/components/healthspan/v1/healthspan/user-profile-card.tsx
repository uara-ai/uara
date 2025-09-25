"use client";

import * as React from "react";
import { User } from "@/lib/user.type";
import { UserProfileDropdown } from "@/components/healthspan/v1/healthspan/user-profile-dropdown";
import { getUserTierAction } from "@/actions/user-tier-action";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  IconUser,
  IconTrendingUp,
  IconClock,
  IconCalendar,
  IconMail,
  IconShield,
} from "@tabler/icons-react";
import { TierBadge } from "@/components/healthspan/tiers";
import { cn } from "@/lib/utils";
import { ContributionChart } from "./contribution-chart";
import { TwitterUsername } from "./twitter-username";
import { HealthStats } from "./health-stats";
import { ScoreOutput } from "@/lib/health/types";

interface UserProfileCardProps {
  user: User | null;
  healthScores?: ScoreOutput;
  className?: string;
}

export function UserProfileCard({
  user,
  healthScores,
  className,
}: UserProfileCardProps) {
  const [userTier, setUserTier] = useState<{
    tierNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
    tierPurchasedAt: Date | null;
  } | null>(null);

  const { execute: fetchUserTier } = useAction(getUserTierAction, {
    onSuccess: (data) => {
      if (data) {
        setUserTier({
          tierNumber: data?.data?.tierNumber || null,
          tierPurchasedAt: data?.data?.tierPurchasedAt || null,
        });
      }
    },
  });

  useEffect(() => {
    if (user) {
      fetchUserTier({});
    }
  }, [user, fetchUserTier]);

  // If no user, return null or a placeholder
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 font-[family-name:var(--font-geist-sans)]">
          No user data available
        </p>
      </div>
    );
  }

  // Extract user info from WorkOS user object
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const email = user.email || "";
  const avatarUrl = user.profilePictureUrl || "";

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Map user tier to subscription string
  const getSubscriptionType = (tier: number | null) => {
    if (!tier) return "FREE";

    switch (tier) {
      case 1:
      case 2:
      case 3:
        return "BASIC";
      case 4:
      case 5:
        return "PRO";
      case 6:
      case 7:
        return "PREMIUM";
      default:
        return "FREE";
    }
  };

  const getTierColor = (tier: number | null) => {
    if (!tier) return "text-gray-600";

    switch (tier) {
      case 1:
      case 2:
      case 3:
        return "text-blue-600";
      case 4:
      case 5:
        return "text-purple-600";
      case 6:
      case 7:
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  const getTierBgColor = (tier: number | null) => {
    if (!tier) return "bg-gray-100";

    switch (tier) {
      case 1:
      case 2:
      case 3:
        return "bg-blue-100";
      case 4:
      case 5:
        return "bg-purple-100";
      case 6:
      case 7:
        return "bg-amber-100";
      default:
        return "bg-gray-100";
    }
  };

  // Calculate days since joining
  const daysSinceJoined = Math.floor(
    (Date.now() - new Date(user.createdAt || Date.now()).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Prepare profile data for the dropdown component
  const profileData = {
    name: fullName || email.split("@")[0] || "User",
    email: email,
    avatar:
      avatarUrl ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        fullName || email
      )}`,
    subscription: getSubscriptionType(userTier?.tierNumber || null),
    model: "Uara AI Coach",
    tierNumber: userTier?.tierNumber,
  };

  return (
    <div
      className={cn(
        "w-full mx-auto space-y-8 font-[family-name:var(--font-geist-sans)]",
        className
      )}
    >
      {/* Minimal Profile Section - Responsive Layout */}
      <div className="w-full">
        {/* Desktop Layout - Horizontal */}
        <div className="hidden lg:flex items-center gap-4 sm:gap-6">
          {/* Profile Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br p-0.5">
              <div className="w-full h-full rounded-full overflow-hidden bg-white border border-[#085983]/50">
                <Image
                  src={profileData.avatar}
                  alt={profileData.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-[#085983] mb-1 truncate">
              {profileData.name}
            </h2>

            {/* Twitter Username */}
            <div className="mb-2">
              <TwitterUsername />
            </div>
          </div>

          {/* Health Stats Section - Aligned to the right */}
          {healthScores && (
            <div className="flex-shrink-0">
              <HealthStats
                categoryScores={healthScores.category}
                overallScore={healthScores.overall}
              />
            </div>
          )}
        </div>

        {/* Mobile/Tablet Layout - Vertical */}
        <div className="lg:hidden">
          {/* Profile Section */}
          <div className="flex items-center gap-4 sm:gap-6 mb-4">
            {/* Profile Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-white border border-[#085983]/50">
                  <Image
                    src={profileData.avatar}
                    alt={profileData.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-[#085983] mb-1 truncate">
                {profileData.name}
              </h2>

              {/* Twitter Username */}
              <div className="mb-2">
                <TwitterUsername />
              </div>
            </div>
          </div>

          {/* Health Stats Section - Below profile info */}
          {healthScores && (
            <div className="w-full">
              <HealthStats
                categoryScores={healthScores.category}
                overallScore={healthScores.overall}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
