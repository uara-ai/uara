import { prisma } from "@/lib/prisma";
import { tiers, TEST_USER_COUNT } from "@/lib/stripe";

export interface TierInfo {
  currentTier: (typeof tiers)[0];
  nextTier: (typeof tiers)[0] | null;
  totalUsers: number;
  adjustedUserCount: number;
  spotsRemaining: number;
  isLastTier: boolean;
}

/**
 * Calculates the current pricing tier based on user count
 * Excludes test users from the calculation as specified
 */
export async function calculateCurrentTier(): Promise<TierInfo> {
  // Get total users with purchased tiers (lifetime customers)
  const totalUsers = await prisma.user.count({
    where: {
      tier: {
        not: null,
      },
    },
  });

  // Adjust count by removing test users
  const adjustedUserCount = Math.max(0, totalUsers - TEST_USER_COUNT);

  // Find current tier based on user count
  let currentTierIndex = 0;
  let cumulativeUsers = 0;

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    if (adjustedUserCount < cumulativeUsers + tier.maxUsers) {
      currentTierIndex = i;
      break;
    }
    cumulativeUsers += tier.maxUsers;
    if (i === tiers.length - 1) {
      currentTierIndex = i; // Last tier
    } else {
      currentTierIndex = i + 1;
    }
  }

  // Handle edge case where we've exceeded all tiers
  if (currentTierIndex >= tiers.length) {
    currentTierIndex = tiers.length - 1;
  }

  const currentTier = tiers[currentTierIndex];
  const nextTier =
    currentTierIndex < tiers.length - 1 ? tiers[currentTierIndex + 1] : null;
  const isLastTier = currentTierIndex === tiers.length - 1;

  // Calculate spots remaining in current tier
  let usersInCurrentTier: number;
  if (currentTierIndex === 0) {
    usersInCurrentTier = adjustedUserCount;
  } else {
    // Calculate cumulative users up to current tier
    let cumulativeUpToCurrent = 0;
    for (let i = 0; i < currentTierIndex; i++) {
      cumulativeUpToCurrent += tiers[i].maxUsers;
    }
    usersInCurrentTier = adjustedUserCount - cumulativeUpToCurrent;
  }

  const spotsRemaining =
    isLastTier && currentTier.maxUsers === Infinity
      ? Infinity
      : Math.max(0, currentTier.maxUsers - usersInCurrentTier);

  return {
    currentTier,
    nextTier,
    totalUsers,
    adjustedUserCount,
    spotsRemaining,
    isLastTier,
  };
}

/**
 * Gets the pricing information for a specific tier
 */
export function getTierById(tierId: string) {
  return tiers.find((tier) => tier.id === tierId);
}

/**
 * Gets all available tiers
 */
export function getAllTiers() {
  return tiers;
}

// Cursor rules applied correctly.
