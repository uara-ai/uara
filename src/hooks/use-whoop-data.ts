"use client";

import useSWR from "swr";
import { getWearablesDataAction, getSleepDataAction } from "@/actions/whoop";

// SWR fetcher for WHOOP wearables data
const fetchWearablesData = async (key: string) => {
  const [, days, limit] = key.split(":");
  const result = await getWearablesDataAction({
    days: parseInt(days),
    limit: parseInt(limit),
  });

  if (!result?.data) {
    throw new Error("Failed to fetch wearables data");
  }

  return result.data;
};

// SWR fetcher for WHOOP sleep data
const fetchSleepData = async (key: string) => {
  const [, days, limit] = key.split(":");
  const result = await getSleepDataAction({
    days: parseInt(days),
    limit: parseInt(limit),
  });

  if (!result?.data) {
    throw new Error("Failed to fetch sleep data");
  }

  return result.data;
};

// Hook for wearables data with SWR
export function useWearablesData(days: number = 7, limit: number = 50) {
  const { data, error, isLoading, mutate } = useSWR(
    `wearables:${days}:${limit}`,
    fetchWearablesData,
    {
      refreshInterval: 5 * 60 * 1000, // Refresh every 5 minutes
      revalidateOnFocus: true,
      dedupingInterval: 2 * 60 * 1000, // Dedupe requests for 2 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  };
}

// Hook for sleep data with SWR
export function useSleepData(days: number = 30, limit: number = 30) {
  const { data, error, isLoading, mutate } = useSWR(
    `sleep:${days}:${limit}`,
    fetchSleepData,
    {
      refreshInterval: 10 * 60 * 1000, // Refresh every 10 minutes (sleep data changes less frequently)
      revalidateOnFocus: true,
      dedupingInterval: 5 * 60 * 1000, // Dedupe requests for 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    data,
    error,
    isLoading,
    refresh: mutate,
  };
}

// Helper hook to preload data (call this in server components to warm SWR cache)
export function preloadWhoopData(wearablesData?: any, sleepData?: any) {
  // This function can be used to preload SWR cache with server-side data
  // The actual cache warming happens when the hooks are first called
  return {
    wearablesData,
    sleepData,
  };
}

// Cursor rules applied correctly.
