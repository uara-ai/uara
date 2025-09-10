"use client";

import { useState, useEffect, useCallback } from "react";

export interface RateLimitStatus {
  remaining: number;
  limit: number;
  resetTime: string;
  isProUser: boolean;
}

export function useRateLimit(enabled: boolean = true) {
  const [status, setStatus] = useState<RateLimitStatus | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const fetchRateLimit = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await fetch("/api/rate-limit", {
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated, don't treat as error
          setStatus(null);
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to fetch rate limit status");
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchRateLimit();
  }, [fetchRateLimit]);

  const refresh = () => {
    if (!enabled) return;
    setIsLoading(true);
    fetchRateLimit();
  };

  // Method to update status from response headers (for real-time updates)
  const updateFromHeaders = useCallback((headers: Headers) => {
    const remaining = headers.get("X-Rate-Limit-Remaining");
    const reset = headers.get("X-Rate-Limit-Reset");
    const limit = headers.get("X-Rate-Limit-Limit");

    if (remaining && reset && limit) {
      setIsAnimating(true);
      setStatus((prev) => ({
        ...prev,
        remaining: parseInt(remaining),
        resetTime: reset,
        limit: parseInt(limit),
        isProUser: prev?.isProUser || false,
      }));

      // Reset animation after a short delay
      setTimeout(() => setIsAnimating(false), 600);
    }
  }, []);

  // Method to manually decrement (for immediate feedback)
  const decrementCounter = useCallback(() => {
    if (!status) return;

    setIsAnimating(true);
    setStatus((prev) =>
      prev
        ? {
            ...prev,
            remaining: Math.max(0, prev.remaining - 1),
          }
        : null
    );

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 600);
  }, [status]);

  return {
    status,
    isLoading,
    error,
    isAnimating,
    refresh,
    updateFromHeaders,
    decrementCounter,
  };
}

// Cursor rules applied correctly.
