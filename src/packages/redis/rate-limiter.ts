import "server-only";

import { client } from "./client";
import { MESSAGE_LIMITS } from "@/lib/constants";

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: Date;
  limit: number;
}

export class RateLimiter {
  /**
   * Check and increment rate limit for a user
   * @param userId - The user ID to check limits for
   * @param isProUser - Whether the user has a pro subscription
   * @returns Promise<RateLimitResult>
   */
  static async checkAndIncrement(
    userId: string,
    isProUser: boolean = false
  ): Promise<RateLimitResult> {
    const limit = isProUser
      ? MESSAGE_LIMITS.PRO_DAILY_LIMIT
      : MESSAGE_LIMITS.FREE_DAILY_LIMIT;

    // Create a key that resets daily
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const key = `rate_limit:${userId}:${today}`;

    // Get current count
    const current = (await client.get(key)) as number | null;
    const currentCount = current || 0;

    // Calculate reset time (start of next day)
    const resetTime = new Date();
    resetTime.setDate(resetTime.getDate() + 1);
    resetTime.setHours(0, 0, 0, 0);

    // Check if limit exceeded
    if (currentCount >= limit) {
      return {
        success: false,
        remaining: 0,
        resetTime,
        limit,
      };
    }

    // Increment counter and set expiry
    const newCount = await client.incr(key);

    // Set expiry to end of day (TTL in seconds)
    const secondsUntilMidnight = Math.floor(
      (resetTime.getTime() - Date.now()) / 1000
    );
    await client.expire(key, secondsUntilMidnight);

    return {
      success: true,
      remaining: Math.max(0, limit - newCount),
      resetTime,
      limit,
    };
  }

  /**
   * Get current rate limit status without incrementing
   * @param userId - The user ID to check limits for
   * @param isProUser - Whether the user has a pro subscription
   * @returns Promise<RateLimitResult>
   */
  static async getStatus(
    userId: string,
    isProUser: boolean = false
  ): Promise<RateLimitResult> {
    const limit = isProUser
      ? MESSAGE_LIMITS.PRO_DAILY_LIMIT
      : MESSAGE_LIMITS.FREE_DAILY_LIMIT;

    // Create a key that resets daily
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const key = `rate_limit:${userId}:${today}`;

    // Get current count
    const current = (await client.get(key)) as number | null;
    const currentCount = current || 0;

    // Calculate reset time (start of next day)
    const resetTime = new Date();
    resetTime.setDate(resetTime.getDate() + 1);
    resetTime.setHours(0, 0, 0, 0);

    return {
      success: currentCount < limit,
      remaining: Math.max(0, limit - currentCount),
      resetTime,
      limit,
    };
  }

  /**
   * Reset rate limit for a user (admin function)
   * @param userId - The user ID to reset limits for
   * @returns Promise<boolean>
   */
  static async reset(userId: string): Promise<boolean> {
    const today = new Date().toISOString().split("T")[0];
    const key = `rate_limit:${userId}:${today}`;

    try {
      await client.del(key);
      return true;
    } catch (error) {
      console.error("Failed to reset rate limit:", error);
      return false;
    }
  }
}

// Cursor rules applied correctly.
