"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "../auth/user-menu";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { TierBadge } from "@/components/healthspan/tiers";
import { getUserTierAction } from "@/actions/user-tier-action";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { useRateLimitContext } from "@/hooks/use-rate-limit-context";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { cn } from "@/lib/utils";
export function SiteHeader() {
  const user = useAuth();
  const [userTier, setUserTier] = useState<{
    tierNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
  } | null>(null);

  const { execute: fetchUserTier, isPending } = useAction(getUserTierAction, {
    onSuccess: (result) => {
      console.log("Tier fetch success:", result);
      if (result.data) {
        setUserTier({
          tierNumber: result.data.tierNumber,
        });
      }
    },
    onError: (error) => {
      console.error("Tier fetch error:", error);
    },
  });

  useEffect(() => {
    if (user.user) {
      fetchUserTier({});
    }
  }, [user.user, fetchUserTier]);
  // Get rate limit status with animation support from context
  const {
    status: rateLimitStatus,
    isLoading: rateLimitLoading,
    isAnimating: rateLimitAnimating,
    error: rateLimitError,
  } = useRateLimitContext();

  // Debug: log rate limit data
  useEffect(() => {
    console.log("Rate limit debug:", {
      rateLimitStatus,
      rateLimitLoading,
      rateLimitError,
      userExists: !!user.user,
    });
  }, [rateLimitStatus, rateLimitLoading, rateLimitError, user.user]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-[#085983]" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium font-[family-name:var(--font-geist)] text-[#085983] dark:text-foreground tracking-wider flex items-center gap-2">
          <Brain className="size-4" />
          Healthspan
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {isPending && user.user && (
            <div className="hidden sm:inline-flex animate-pulse bg-gray-200 h-6 w-16 rounded-full" />
          )}
          {/* Rate Limit Display */}
          {user.user && (
            <>
              {rateLimitLoading ? (
                <div className="animate-pulse bg-gray-200 h-6 w-12 rounded-lg" />
              ) : rateLimitStatus ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 py-1 sm:px-2.5 sm:py-1.5 bg-muted/50 border border-border rounded-lg text-xs pointer-events-auto">
                      <AnimatedCounter
                        value={rateLimitStatus.remaining}
                        isAnimating={rateLimitAnimating}
                        className={cn(
                          "font-medium text-xs",
                          rateLimitStatus.remaining <= 1
                            ? "text-destructive"
                            : rateLimitStatus.remaining <= 3
                            ? "text-orange-500"
                            : "text-muted-foreground"
                        )}
                      />
                      <span className="text-muted-foreground/70 text-xs">
                        / {rateLimitStatus.limit}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={4}>
                    <div className="text-xs">
                      <div>
                        Messages remaining today: {rateLimitStatus.remaining}
                      </div>
                      <div className="text-xs mt-1">
                        Resets:{" "}
                        {new Date(
                          rateLimitStatus.resetTime
                        ).toLocaleTimeString()}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : rateLimitError ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="px-2 py-1 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                      Error
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={4}>
                    <div className="text-xs text-red-600">
                      Failed to load rate limit: {rateLimitError}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : null}
            </>
          )}
          {userTier?.tierNumber && !isPending && (
            <TierBadge
              tier={userTier.tierNumber}
              size="sm"
              className="hidden sm:inline-flex"
            />
          )}
          {!userTier?.tierNumber && !isPending && user.user && (
            <span className="hidden sm:inline-flex text-xs text-muted-foreground px-2 py-1 bg-gray-100 rounded-full">
              No tier
            </span>
          )}
          <UserMenu user={user.user} />
        </div>
      </div>
    </header>
  );
}
