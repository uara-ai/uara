"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  ArrowRight,
  Lightbulb,
  AlertTriangle,
  Target,
} from "lucide-react";
import Link from "next/link";

interface QuickTip {
  category: string;
  title: string;
  priority: "high" | "medium" | "low";
  timeframe: "immediate" | "daily" | "weekly" | "monthly";
}

interface AiTipsQuickProps {
  className?: string;
}

// Generate fallback tips for when no real data is available
const generateFallbackTips = (): QuickTip[] => {
  const tips = [
    {
      category: "sleep",
      title: "Maintain consistent bedtime",
      priority: "high" as const,
      timeframe: "daily" as const,
    },
    {
      category: "nutrition",
      title: "Increase protein intake",
      priority: "high" as const,
      timeframe: "daily" as const,
    },
    {
      category: "recovery",
      title: "Add 10min meditation",
      priority: "medium" as const,
      timeframe: "daily" as const,
    },
    {
      category: "movement",
      title: "Take walking breaks",
      priority: "medium" as const,
      timeframe: "immediate" as const,
    },
    {
      category: "hydration",
      title: "Drink more water",
      priority: "low" as const,
      timeframe: "immediate" as const,
    },
    {
      category: "stress",
      title: "Practice deep breathing",
      priority: "low" as const,
      timeframe: "weekly" as const,
    },
  ];

  return tips;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600";
    case "medium":
      return "text-amber-600";
    case "low":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return AlertTriangle;
    case "medium":
      return Target;
    case "low":
      return Lightbulb;
    default:
      return Lightbulb;
  }
};

export function AiTipsQuick({ className }: AiTipsQuickProps) {
  const [tips, setTips] = useState<QuickTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuickTips = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call AI tips API to get full data, then extract quick tips
      const response = await fetch("/api/ai-tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tips");
      }

      const result = await response.json();

      // Extract 6 quick tips from the full response
      const quickTips =
        result.tips?.slice(0, 6).map((tip: any) => ({
          category: tip.category,
          title: tip.title,
          priority: tip.priority,
          timeframe: tip.timeframe,
        })) || generateFallbackTips();

      setTips(quickTips);
    } catch (error) {
      console.error("Failed to fetch quick tips:", error);
      setError("Unable to load tips");
      // Use fallback tips on error
      setTips(generateFallbackTips());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuickTips();
  }, []);

  const displayTips = tips.length > 0 ? tips : generateFallbackTips();

  return (
    <div className={cn("w-full max-w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-[#085983] text-base">
              Health Tips
            </span>
          </div>
          <p className="text-xs text-[#085983]/60">
            Personalized recommendations
          </p>
        </div>
        <Link
          href="/healthspan/tips"
          className="flex items-center gap-1 text-xs text-[#085983]/60 hover:text-[#085983] transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Chart container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 w-full">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {displayTips.slice(0, 6).map((tip, index) => {
              const PriorityIcon = getPriorityIcon(tip.priority);

              return (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-gray-50/50 dark:bg-gray-800/50 rounded hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {/* Priority Icon */}
                  <div className="flex-shrink-0">
                    <PriorityIcon
                      className={cn("size-3", getPriorityColor(tip.priority))}
                    />
                  </div>

                  {/* Tip Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-[#085983] leading-tight truncate">
                      {tip.title}
                    </p>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex-shrink-0">
                    <span
                      className={cn(
                        "text-[8px] px-1.5 py-0.5 rounded-full font-medium uppercase",
                        tip.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : tip.priority === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      )}
                    >
                      {tip.priority}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Show more indicator if we have more tips */}
            {displayTips.length > 6 && (
              <div className="text-center pt-1">
                <Link
                  href="/healthspan/tips"
                  className="text-[10px] text-[#085983]/60 hover:text-[#085983] font-medium"
                >
                  +{displayTips.length - 6} more tips
                </Link>
              </div>
            )}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-2">
            <p className="text-[10px] text-amber-600 mb-1">{error}</p>
            <p className="text-[9px] text-[#085983]/60">
              Showing example recommendations
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
