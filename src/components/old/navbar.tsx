"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import { Brain, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/old/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// import { ShareButton } from "@/components/share";
import { cn } from "@/lib/utils";

import { useRouter, usePathname } from "next/navigation";
import { User } from "@/lib/user.type";
import { UserMenu } from "../auth/user-menu";
import { UserSummaryBadge } from "../auth/user-summary-badge";
import { useRateLimitContext } from "@/hooks/use-rate-limit-context";
import { AnimatedCounter } from "@/components/ui/animated-counter";

type VisibilityType = "public" | "private";

interface NavbarProps {
  isDialogOpen: boolean;
  chatId: string | null;
  selectedVisibilityType: VisibilityType;
  onVisibilityChange?: (visibility: VisibilityType) => void | Promise<void>;
  status: string;
  user: User | null;
  onHistoryClick?: () => void;
  isOwner?: boolean;
  subscriptionData?: any;
  isProUser?: boolean;
  isProStatusLoading?: boolean;
  isCustomInstructionsEnabled?: boolean;
  setIsCustomInstructionsEnabled?: (
    value: boolean | ((val: boolean) => boolean)
  ) => void;
}

const Navbar = memo(
  ({ isDialogOpen, status, user, isProStatusLoading }: NavbarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const isSearchWithId = useMemo(
      () => Boolean(pathname && /^\/search\/[^/]+/.test(pathname)),
      [pathname]
    );

    // Get rate limit status with animation support from context
    const {
      status: rateLimitStatus,
      isLoading: rateLimitLoading,
      isAnimating: rateLimitAnimating,
    } = useRateLimitContext();

    // Determine active subscription from rate limit pro flag
    const hasActiveSubscription = rateLimitStatus?.isProUser ?? false;
    const showProLoading = isProStatusLoading;

    return (
      <>
        <div
          className={cn(
            "fixed left-0 right-0 z-30 top-0 flex justify-between items-center px-2 py-2 sm:p-3 transition-colors duration-200",
            isDialogOpen
              ? "bg-transparent pointer-events-none"
              : status === "streaming" || status === "ready"
              ? "bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60"
              : "bg-background"
          )}
        >
          <div
            className={cn(
              "flex items-center gap-1.5 sm:gap-3",
              isDialogOpen ? "pointer-events-auto" : ""
            )}
          >
            <Link href="/">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-lg bg-accent hover:bg-accent/80 group transition-all hover:scale-105 pointer-events-auto h-8 w-8 sm:w-auto p-0 sm:px-3"
              >
                <Plus
                  size={16}
                  className="group-hover:rotate-90 transition-all"
                />
                <span className="text-sm ml-1.5 group-hover:block hidden sm:inline animate-in fade-in duration-300">
                  New
                </span>
              </Button>
            </Link>

            {/* Rate Limit Display */}
            {user && rateLimitStatus && !rateLimitLoading && (
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
                      {new Date(rateLimitStatus.resetTime).toLocaleTimeString()}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Mobile-only Upgrade (avoids overlap with share on small screens) */}
            {user && !hasActiveSubscription && !showProLoading && (
              <Button
                variant="default"
                size="sm"
                className="rounded-md h-7 px-2 text-xs sm:hidden min-w-0"
                onClick={() => router.push("/pricing")}
              >
                <Brain className="size-3.5" />
                Upgrade
              </Button>
            )}
          </div>

          {/* Centered Pro/Upgrade Indicator */}
          {user && !hasActiveSubscription && !showProLoading && (
            <div
              className={cn(
                "hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2",
                isDialogOpen ? "pointer-events-auto" : ""
              )}
            >
              <div className="flex items-center bg-muted/50 border border-border rounded-full">
                <span className="px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-muted-foreground">
                  Free Plan
                </span>
                <Button
                  variant="default"
                  size="sm"
                  className="mr-1.5 h-5 md:h-6 rounded-full text-xs px-2 md:px-3"
                  onClick={() => router.push("/pricing")}
                >
                  Upgrade
                </Button>
              </div>
            </div>
          )}
          {user && hasActiveSubscription && !showProLoading && (
            <div
              className={cn(
                "flex items-center justify-center",
                isDialogOpen ? "pointer-events-auto" : ""
              )}
            >
              <Link href="/healthspan" className="pointer-events-auto">
                <span className="font-baumans! px-3 py-1 inline-flex items-center gap-1.5 rounded-full shadow-sm ring-1 ring-ring/35 ring-offset-1 ring-offset-background bg-gradient-to-br from-secondary/25 via-primary/20 to-accent/25 text-foreground dark:bg-gradient-to-br dark:from-primary dark:via-secondary dark:to-primary dark:text-foreground">
                  <Brain className="size-3.5" />
                  <span className="uppercase tracking-wide text-xs hidden md:inline">
                    healthspan
                  </span>
                </span>
              </Link>
            </div>
          )}
          <div
            className={cn(
              "flex items-center gap-1 sm:gap-2",
              isDialogOpen ? "pointer-events-auto" : ""
            )}
          >
            {/* Subscription Status - show loading or Pro status only */}
            {user && isSearchWithId && (
              <div>
                {showProLoading ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="rounded-md pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 border border-border">
                        <div className="size-4 rounded-full bg-muted animate-pulse" />
                        <div className="w-8 h-3 bg-muted rounded animate-pulse hidden sm:block" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={4}>
                      Loading subscription status...
                    </TooltipContent>
                  </Tooltip>
                ) : hasActiveSubscription ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="pointer-events-auto mr-1">
                        <span className="font-baumans! px-2.5 pt-0.5 pb-1.75 sm:pt-1 leading-4 inline-flex items-center gap-1 rounded-lg shadow-sm border-transparent ring-1 ring-ring/35 ring-offset-1 ring-offset-background bg-gradient-to-br from-secondary/25 via-primary/20 to-accent/25 text-foreground  dark:bg-gradient-to-br dark:from-primary dark:via-secondary dark:to-primary dark:text-foreground">
                          <span>pro</span>
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" sideOffset={4}>
                      Pro Subscribed - Unlimited access
                    </TooltipContent>
                  </Tooltip>
                ) : null}
              </div>
            )}

            {/* User Summary Badge - health profile overview */}
            {user && <UserSummaryBadge />}
            {/* Navigation Menu - settings icon for general navigation */}
            <NavigationMenu />
            {/* User Profile - focused on authentication and account management */}
            <UserMenu user={user} />
          </div>
        </div>
      </>
    );
  }
);

Navbar.displayName = "Navbar";

export { Navbar };
