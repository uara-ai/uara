"use server";

import { calculateCurrentTier, getTierById } from "@/lib/tier-calculator";
import { unstable_cache } from "next/cache";

/**
 * Get current tier information with 30-minute caching
 */
export const getCurrentTierInfo = unstable_cache(
  async () => {
    try {
      const tierInfo = await calculateCurrentTier();

      return {
        success: true,
        data: {
          currentTier: {
            id: tierInfo.currentTier.id,
            name: tierInfo.currentTier.name,
            price: tierInfo.currentTier.price,
            displayPrice: tierInfo.currentTier.displayPrice,
            maxUsers: tierInfo.currentTier.maxUsers,
          },
          nextTier: tierInfo.nextTier
            ? {
                id: tierInfo.nextTier.id,
                name: tierInfo.nextTier.name,
                price: tierInfo.nextTier.price,
                displayPrice: tierInfo.nextTier.displayPrice,
                maxUsers: tierInfo.nextTier.maxUsers,
              }
            : null,
          spotsRemaining: tierInfo.spotsRemaining,
          totalUsers: tierInfo.totalUsers,
          adjustedUserCount: tierInfo.adjustedUserCount,
          isLastTier: tierInfo.isLastTier,
        },
      };
    } catch (error) {
      console.error("Error fetching tier information:", error);
      return {
        success: false,
        error: "Failed to fetch tier information",
      };
    }
  },
  ["current-tier-info"], // Cache key
  {
    revalidate: 1800, // 30 minutes in seconds
    tags: ["tier-info"],
  }
);

/**
 * Get tier by ID
 */
export async function getTierInfo(tierId: string) {
  try {
    const tier = getTierById(tierId);

    if (!tier) {
      return {
        success: false,
        error: "Tier not found",
      };
    }

    return {
      success: true,
      data: tier,
    };
  } catch (error) {
    console.error("Error fetching tier by ID:", error);
    return {
      success: false,
      error: "Failed to fetch tier information",
    };
  }
}

// Cursor rules applied correctly.
