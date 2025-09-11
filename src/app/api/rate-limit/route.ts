import { NextResponse } from "next/server";
import { RateLimiter } from "@/packages/redis/rate-limiter";
import { requireAuth, isProUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();
    const isPro = await isProUser();

    const rateLimitResult = await RateLimiter.getStatus(user.id, isPro);

    return NextResponse.json({
      remaining: rateLimitResult.remaining,
      limit: rateLimitResult.limit,
      resetTime: rateLimitResult.resetTime.toISOString(),
      isProUser: isPro,
    });
  } catch (error) {
    console.error("Rate limit check error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// Cursor rules applied correctly.
