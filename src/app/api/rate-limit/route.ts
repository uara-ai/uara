import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/prisma";
import { RateLimiter } from "@/packages/redis/rate-limiter";

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
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Get rate limit status without incrementing
    // TODO: Add subscription check here when subscription system is implemented
    const isProUser = false; // Will be: dbUser.subscription?.status === 'active'
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
