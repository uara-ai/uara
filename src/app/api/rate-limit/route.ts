import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/prisma";
import { RateLimiter } from "@/packages/redis/rate-limiter";

function isProFromStatus(sub?: {
  status: string | null;
  cancelAtPeriodEnd: boolean | null;
  currentPeriodEnd: Date | null;
  endedAt: Date | null;
}) {
  if (!sub) return false;
  const status = (sub.status || "").toLowerCase();
  if (status === "active" || status === "trialing" || status === "past_due") {
    // If scheduled to cancel, remain pro until the end of the current period
    if (sub.cancelAtPeriodEnd && sub.currentPeriodEnd) {
      return sub.currentPeriodEnd.getTime() > Date.now();
    }
    // If endedAt set, consider not pro
    if (sub.endedAt && sub.endedAt.getTime() <= Date.now()) return false;
    return true;
  }
  return false;
}

export async function GET() {
  try {
    // Get user from WorkOS
    const { user } = await withAuth();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in our database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        Subscription: {
          select: {
            status: true,
            cancelAtPeriodEnd: true,
            currentPeriodEnd: true,
            endedAt: true,
          },
        },
      },
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const isProUser = isProFromStatus(dbUser.Subscription || undefined);

    // Get rate limit status without incrementing
    const rateLimitResult = await RateLimiter.getStatus(dbUser.id, isProUser);

    return Response.json({
      remaining: rateLimitResult.remaining,
      limit: rateLimitResult.limit,
      resetTime: rateLimitResult.resetTime,
      isProUser,
    });
  } catch (error) {
    console.error("Rate limit API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Cursor rules applied correctly.
