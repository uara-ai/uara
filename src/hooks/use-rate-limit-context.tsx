"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useRateLimit } from "./use-rate-limit";

interface RateLimitContextType {
  status: {
    remaining: number;
    limit: number;
    resetTime: string;
    isProUser: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
  isAnimating: boolean;
  refresh: () => void;
  updateFromHeaders: (headers: Headers) => void;
  decrementCounter: () => void;
}

const RateLimitContext = createContext<RateLimitContextType | null>(null);

interface RateLimitProviderProps {
  children: ReactNode;
  enabled?: boolean;
}

export function RateLimitProvider({
  children,
  enabled = true,
}: RateLimitProviderProps) {
  const rateLimitData = useRateLimit(enabled);

  return (
    <RateLimitContext.Provider value={rateLimitData}>
      {children}
    </RateLimitContext.Provider>
  );
}

export function useRateLimitContext() {
  const context = useContext(RateLimitContext);
  if (!context) {
    throw new Error(
      "useRateLimitContext must be used within a RateLimitProvider"
    );
  }
  return context;
}

// Cursor rules applied correctly.
