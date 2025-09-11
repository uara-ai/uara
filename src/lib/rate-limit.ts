import { RateLimiter } from "@/packages/redis/rate-limiter";
import { isProUser } from "@/lib/auth";

export async function checkRateLimit(userId: string) {
  const isPro = await isProUser();
  const rateLimitResult = await RateLimiter.checkAndIncrement(userId, isPro);

  if (!rateLimitResult.success) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  return {
    remaining: rateLimitResult.remaining,
    limit: rateLimitResult.limit,
    resetTime: rateLimitResult.resetTime,
    isProUser: isPro,
  };
}

export function createRateLimitHeaders(rateLimitData: {
  remaining: number;
  limit: number;
  resetTime: Date;
}) {
  return {
    "X-Rate-Limit-Remaining": rateLimitData.remaining.toString(),
    "X-Rate-Limit-Limit": rateLimitData.limit.toString(),
    "X-Rate-Limit-Reset": rateLimitData.resetTime.toISOString(),
  };
}

// Cursor rules applied correctly.
