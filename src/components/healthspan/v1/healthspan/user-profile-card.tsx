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

interface UserProfileCardProps {
  user: User | null;
  className?: string;
}

export function UserProfileCard({ user, className }: UserProfileCardProps) {
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
        "w-full mx-auto space-y-8 px-6 font-[family-name:var(--font-geist-sans)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
              Profile Overview
            </h1>
            <p className="text-[#085983]/60 text-sm mt-1">
              {formatDate(
                typeof user.createdAt === "string"
                  ? user.createdAt
                  : new Date().toISOString()
              )}
            </p>
          </div>
        </div>

        {/* Dropdown in header */}
        <div className="flex-shrink-0">
          <UserProfileDropdown data={profileData} />
        </div>
      </div>

      {/* Main Profile Section */}
      <div className="flex justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#085983] to-blue-600 p-1 mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <Image
                  src={profileData.avatar}
                  alt={profileData.name}
                  width={88}
                  height={88}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            {/* Online status indicator */}
            <div className="absolute bottom-1 right-1/2 translate-x-8 w-6 h-6 bg-green-500 border-3 border-white rounded-full"></div>
          </div>

          <h2 className="text-3xl font-bold text-[#085983] mb-2">
            {profileData.name}
          </h2>

          <div className="flex items-center justify-center gap-2 mb-4">
            <IconMail className="size-4 text-[#085983]/60" />
            <span className="text-[#085983]/80 text-sm">
              {profileData.email}
            </span>
          </div>

          {userTier?.tierNumber && (
            <div
              className={cn(
                "inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-4",
                getTierBgColor(userTier.tierNumber),
                getTierColor(userTier.tierNumber)
              )}
            >
              <IconShield className="size-4" />
              {getSubscriptionType(userTier.tierNumber)} Member
            </div>
          )}
        </div>
      </div>

      {/* Profile Insights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Health Overview
          </h2>
        </div>

        <div className="grid gap-4">
          {/* Health Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconTrendingUp className="size-5 text-[#085983]" />
              <h3 className="font-medium text-[#085983]">
                Overall Health Status
              </h3>
            </div>
            <p className="text-sm text-[#085983]/70">
              Your health metrics show <strong>excellent progress</strong>.
              You're maintaining consistent sleep patterns and your recovery
              indicators are in the optimal range. Keep up the great work!
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Personalized Tips
          </h2>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <IconUser className="size-5 text-[#085983]" />
            <h3 className="font-medium text-[#085983]">Keep It Up!</h3>
          </div>
          <p className="text-sm text-[#085983]/80">
            🎯 You're on track for your longevity goals this week. Continue
            monitoring your sleep and recovery patterns for optimal health.
          </p>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
