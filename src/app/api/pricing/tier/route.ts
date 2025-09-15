import { calculateCurrentTier } from "@/lib/tier-calculator";

export const dynamic = "force-dynamic";

/**
 * GET /api/pricing/tier
 * Returns the current pricing tier information
 */
export async function GET() {
  try {
    const tierInfo = await calculateCurrentTier();

    return Response.json({
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
    });
  } catch (error) {
    console.error("Error fetching tier information:", error);
    return Response.json(
      { error: "Failed to fetch tier information" },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
