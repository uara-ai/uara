"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCheckout } from "@/hooks/use-checkout";

interface TierInfo {
  currentTier: {
    id: string;
    name: string;
    price: number;
    displayPrice: string;
    maxUsers: number;
  };
  nextTier: {
    id: string;
    name: string;
    price: number;
    displayPrice: string;
    maxUsers: number;
  } | null;
  spotsRemaining: number;
  totalUsers: number;
  adjustedUserCount: number;
  isLastTier: boolean;
}

export function HeroCTA() {
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const { checkout, isLoading: checkoutLoading, error } = useCheckout();

  useEffect(() => {
    async function fetchTierInfo() {
      try {
        const response = await fetch("/api/pricing/tier");
        if (response.ok) {
          const data = await response.json();
          setTierInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch tier info:", error);
      }
    }

    fetchTierInfo();
  }, []);

  const handleClaimNow = async () => {
    if (tierInfo) {
      await checkout(tierInfo.currentTier.id);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-4 mb-12 sm:mb-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 max-w-xl justify-end">
        <ResultCard
          metric="3x"
          description="Spot health trends three times faster → before they become problems"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-trending-up"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 17l6 -6l4 4l8 -8" />
              <path d="M14 7l7 0l0 7" />
            </svg>
          }
        />
        <ResultCard
          metric="∞"
          description="Endless hours saved each month → no more spreadsheets or manual tracking"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-stopwatch"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 13a7 7 0 1 0 14 0a7 7 0 0 0 -14 0z" />
              <path d="M14.5 10.5l-2.5 2.5" />
              <path d="M17 8l1 -1" />
              <path d="M14 3h-4" />
            </svg>
          }
        />
        <ResultCard
          metric="4 weeks"
          description="See the first measurable improvements in just 4 weeks"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-week"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
              <path d="M16 3v4" />
              <path d="M8 3v4" />
              <path d="M4 11h16" />
              <path d="M7 14h.013" />
              <path d="M10.01 14h.005" />
              <path d="M13.01 14h.005" />
              <path d="M16.015 14h.005" />
              <path d="M13.015 17h.005" />
              <path d="M7.01 17h.005" />
              <path d="M10.01 17h.005" />
            </svg>
          }
        />
        <ResultCard
          metric="More years"
          description="Extend your healthspan by slowing down biological aging"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-heartbeat"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19.5 13.572l-7.5 7.428l-2.896 -2.868m-6.117 -8.104a5 5 0 0 1 9.013 -3.022a5 5 0 1 1 7.5 6.572" />
              <path d="M3 13h2l2 3l2 -6l1 3h3" />
            </svg>
          }
        />
      </div>

      <Button
        size="lg"
        className="w-full bg-gradient-to-b from-[#085983] via-[#0a6b99] to-[#085983] hover:from-[#074a6b] hover:via-[#085983] hover:to-[#074a6b] text-white font-[family-name:var(--font-geist-sans)] text-lg font-bold py-4 px-6 rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 tracking-wider border-2 border-[#085983]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{
          boxShadow:
            "0 8px 20px rgba(8, 89, 131, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
        }}
        onClick={handleClaimNow}
        disabled={checkoutLoading || !tierInfo}
        data-fast-goal="initiate_checkout"
      >
        {checkoutLoading
          ? "PROCESSING..."
          : !tierInfo
          ? "LOADING..."
          : "RESERVE YOUR SPOT for $49"}
      </Button>

      {error && (
        <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
      )}
    </div>
  );
}

interface ResultCardProps {
  metric: string;
  description: string;
  icon: React.ReactNode;
}

export function ResultCard({ metric, description, icon }: ResultCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-all duration-300 hover:bg-white/15 group">
      <div className="flex items-center justify-between mb-2">
        <div className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-bold text-blue-200 transition-all duration-300 group-hover:text-blue-100 tabular-nums">
          {metric}
        </div>
        <div className="text-blue-200 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-100">
          {icon}
        </div>
      </div>
      <p className="font-[family-name:var(--font-geist-sans)] text-sm font-normal text-white/90 leading-relaxed transition-colors group-hover:text-white">
        {description}
      </p>
    </div>
  );
}
