"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
// Extract tier number from tier string (e.g., "tier_1" -> 1)
function extractTierNumber(
  tierString: string | null
): 1 | 2 | 3 | 4 | 5 | 6 | 7 | null {
  if (!tierString) return null;
  const match = tierString.match(/tier_(\d)/);
  if (!match) return null;
  const tierNum = parseInt(match[1]);
  return tierNum >= 1 && tierNum <= 7
    ? (tierNum as 1 | 2 | 3 | 4 | 5 | 6 | 7)
    : null;
}

// Static function to get user tier - no caching to avoid client/server conflicts
async function getUserTierData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      tier: true,
      tierPurchasedAt: true,
    },
  });

  if (!user) return null;

  const tierNumber = extractTierNumber(user.tier);

  return {
    userId: user.id,
    tier: user.tier,
    tierNumber,
    tierPurchasedAt: user.tierPurchasedAt,
  };
}

export const getUserTierAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    const { user } = await withAuth();
    if (!user?.id) throw new Error("Not authenticated");

    return await getUserTierData(user.id);
  });

// Get any user's tier by ID (for admin purposes or public display)
export const getUserTierByIdAction = actionClient
  .schema(z.object({ userId: z.string() }))
  .action(async ({ parsedInput }) => {
    const result = await getUserTierData(parsedInput.userId);

    // Return only public information
    return result
      ? {
          tierNumber: result.tierNumber,
          tierPurchasedAt: result.tierPurchasedAt,
        }
      : null;
  });

// Server function to get user tier without authentication (for server components)
export async function getUserTierServer(): Promise<{
  tierNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
  tierPurchasedAt: Date | null;
} | null> {
  try {
    const { user } = await withAuth();
    if (!user?.id) return null;

    const result = await getUserTierData(user.id);
    return result
      ? {
          tierNumber: result.tierNumber,
          tierPurchasedAt: result.tierPurchasedAt,
        }
      : null;
  } catch {
    return null;
  }
}

// Static function to get user tier by ID - for use in other server functions
export async function getUserTierById(userId: string): Promise<{
  tierNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
  tierPurchasedAt: Date | null;
} | null> {
  try {
    const result = await getUserTierData(userId);
    return result
      ? {
          tierNumber: result.tierNumber,
          tierPurchasedAt: result.tierPurchasedAt,
        }
      : null;
  } catch {
    return null;
  }
}

// Cursor rules applied correctly.
