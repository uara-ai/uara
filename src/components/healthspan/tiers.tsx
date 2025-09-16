import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Crown,
  Star,
  Diamond,
  Gem,
  Shield,
  Building2,
  Users,
} from "lucide-react";
import { getUserTierServer } from "@/actions/user-tier-action";

const tierBadgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 font-[family-name:var(--font-geist-sans)] text-xs font-medium transition-all duration-300 hover:scale-105",
  {
    variants: {
      tier: {
        1: "bg-[#085983] text-white border border-[#085983]/20 shadow-lg",
        2: "bg-[#085983]/90 text-white border border-[#085983]/20 shadow-lg",
        3: "bg-[#085983]/80 text-white border border-[#085983]/20 shadow-lg",
        4: "bg-[#085983]/70 text-white border border-[#085983]/20 shadow-lg",
        5: "bg-[#085983]/60 text-white border border-[#085983]/20 shadow-lg",
        6: "bg-[#085983]/50 text-white border border-[#085983]/20 shadow-lg",
        7: "bg-[#085983]/40 text-white border border-[#085983]/20 shadow-lg",
      },
    },
  }
);

const tierIcons = {
  1: Crown,
  2: Diamond,
  3: Star,
  4: Gem,
  5: Shield,
  6: Building2,
  7: Users,
} as const;

const tierNames = {
  1: "Angel",
  2: "From day 0",
  3: "Early Backer",
  4: "Seed Supporter",
  5: "Growth Supporter",
  6: "Scale Supporter",
  7: "Community Supporter",
} as const;

interface TierBadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof tierBadgeVariants> {
  tier: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  showName?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

function TierBadge({
  className,
  tier,
  showName = true,
  showIcon = true,
  size = "md",
  ...props
}: TierBadgeProps) {
  const IconComponent = tierIcons[tier];
  const tierName = tierNames[tier];

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-xs gap-1.5",
    lg: "px-4 py-2 text-sm gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <span
      className={cn(tierBadgeVariants({ tier }), sizeClasses[size], className)}
      {...props}
    >
      {showIcon && <IconComponent className={iconSizes[size]} />}
      {showName ? tierName : `Tier ${tier}`}
    </span>
  );
}

interface TierProgressProps {
  currentTier: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  spotsRemaining?: number;
  maxSpots?: number;
  className?: string;
}

function TierProgress({
  currentTier,
  spotsRemaining = 0,
  maxSpots = 100,
  className,
}: TierProgressProps) {
  const progress =
    spotsRemaining === Infinity
      ? 100
      : ((maxSpots - spotsRemaining) / maxSpots) * 100;

  return (
    <div
      className={cn(
        "space-y-3 p-4 bg-white rounded-xl border border-[#085983]/10 shadow-lg",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <TierBadge tier={currentTier} size="sm" />
        <span className="font-[family-name:var(--font-geist-sans)] text-xs text-[#085983]/60">
          {spotsRemaining === Infinity
            ? "Unlimited"
            : `${spotsRemaining} spots left`}
        </span>
      </div>
      {spotsRemaining !== Infinity && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
              Progress
            </span>
            <span className="font-medium text-[#085983] font-[family-name:var(--font-geist-sans)]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-[#085983]/10 rounded-full h-2">
            <div
              className="bg-[#085983] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface TierListProps {
  currentTier?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  className?: string;
  showAll?: boolean;
}

function TierList({ currentTier, className, showAll = false }: TierListProps) {
  const allTiers: Array<1 | 2 | 3 | 4 | 5 | 6 | 7> = [1, 2, 3, 4, 5, 6, 7];
  const tiers = showAll ? allTiers : currentTier ? [currentTier] : [];

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {tiers.map((tier) => (
        <div
          key={tier}
          className={cn(
            "p-4 bg-white rounded-xl border border-[#085983]/10 shadow-lg hover:shadow-xl transition-all duration-300",
            currentTier === tier
              ? "ring-2 ring-[#085983] ring-offset-2"
              : "opacity-80 hover:opacity-100"
          )}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <TierBadge tier={tier} size="sm" />
              <span className="font-[family-name:var(--font-geist-sans)] text-xs text-[#085983]/60">
                Tier {tier}
              </span>
            </div>
            <div className="text-center">
              <h3 className="font-[family-name:var(--font-instrument-serif)] text-lg font-normal text-[#085983]">
                {tierNames[tier]}
              </h3>
              <p className="font-[family-name:var(--font-geist-sans)] text-sm text-[#085983]/70 mt-1">
                {currentTier === tier ? "Your current tier" : "Available tier"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Server Components for fetching user tier data

interface UserTierBadgeProps {
  className?: string;
  showName?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  fallbackTier?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

async function UserTierBadge({
  className,
  showName = true,
  showIcon = true,
  size = "md",
  fallbackTier = 7,
}: UserTierBadgeProps) {
  const userTier = await getUserTierServer();
  const tierNumber = userTier?.tierNumber || fallbackTier;

  return (
    <TierBadge
      tier={tierNumber}
      className={className}
      showName={showName}
      showIcon={showIcon}
      size={size}
    />
  );
}

interface UserTierProgressProps {
  spotsRemaining?: number;
  maxSpots?: number;
  className?: string;
  fallbackTier?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

async function UserTierProgress({
  spotsRemaining = 0,
  maxSpots = 100,
  className,
  fallbackTier = 7,
}: UserTierProgressProps) {
  const userTier = await getUserTierServer();
  const tierNumber = userTier?.tierNumber || fallbackTier;

  return (
    <TierProgress
      currentTier={tierNumber}
      spotsRemaining={spotsRemaining}
      maxSpots={maxSpots}
      className={className}
    />
  );
}

interface UserTierDisplayProps {
  className?: string;
  showPurchaseDate?: boolean;
  fallbackTier?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
}

async function UserTierDisplay({
  className,
  showPurchaseDate = false,
  fallbackTier = 7,
}: UserTierDisplayProps) {
  const userTier = await getUserTierServer();
  const tierNumber = userTier?.tierNumber || fallbackTier;
  const purchasedAt = userTier?.tierPurchasedAt;

  return (
    <div
      className={cn(
        "p-4 bg-white rounded-xl border border-[#085983]/10 shadow-lg space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#085983]/10">
            {(() => {
              const IconComponent = tierIcons[tierNumber];
              return <IconComponent className="h-4 w-4 text-[#085983]" />;
            })()}
          </div>
          <span className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983]/80">
            Your Tier
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-normal text-[#085983]">
          {tierNames[tierNumber]}
        </h3>
        <div className="flex items-center gap-2">
          <TierBadge tier={tierNumber} size="sm" />
          {showPurchaseDate && purchasedAt && (
            <span className="font-[family-name:var(--font-geist-sans)] text-xs text-[#085983]/60">
              Since {new Date(purchasedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-[#085983]/10">
        <div className="flex justify-between text-xs">
          <span className="text-[#085983]/60 font-[family-name:var(--font-geist-sans)]">
            Status:
          </span>
          <span className="font-medium text-[#085983] font-[family-name:var(--font-geist-sans)]">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}

// Client Components (existing)
export {
  TierBadge,
  TierProgress,
  TierList,
  tierBadgeVariants,
  tierNames,
  tierIcons,
};

// Server Components
export { UserTierBadge, UserTierProgress, UserTierDisplay };

// Cursor rules applied correctly.

/**
 * Tier Badge Usage Examples
 *
 * This file demonstrates how to properly use the tier badge components
 * in different contexts (client vs server components).


import {
  TierBadge,
  TierProgress,
  TierList,
  UserTierBadge,
  UserTierProgress,
  UserTierDisplay,
} from "./tiers";
import { getUserTierAction } from "@/actions/user-tier-action";
import { useAction } from "next-safe-action/hooks";
import { useState, useEffect } from "react";
 */
// ===========================
// CLIENT COMPONENT EXAMPLES
// ===========================

/**
 * Example 1: Static tier badges (client component)
 * Use when you know the tier number and want to display it statically
 */
export function StaticTierExamples() {
  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Static Tier Badges</h3>
      <div className="flex flex-wrap gap-2">
        <TierBadge tier={1} />
        <TierBadge tier={2} />
        <TierBadge tier={3} />
        <TierBadge tier={4} />
        <TierBadge tier={5} />
        <TierBadge tier={6} />
        <TierBadge tier={7} />
      </div>

      <h4 className="text-md font-medium">Different Sizes</h4>
      <div className="flex items-center gap-2">
        <TierBadge tier={1} size="sm" />
        <TierBadge tier={1} size="md" />
        <TierBadge tier={1} size="lg" />
      </div>

      <h4 className="text-md font-medium">Customization Options</h4>
      <div className="flex flex-wrap gap-2">
        <TierBadge tier={1} showIcon={false} />
        <TierBadge tier={1} showName={false} />
        <TierBadge tier={1} showIcon={false} showName={false} />
      </div>
    </div>
  );
}

/**
 * Example 2: Dynamic tier badges with user data (client component)
 * Use in client components where you need to fetch user tier data

export function DynamicUserTierExample() {
  const [userTier, setUserTier] = useState<{
    tierNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
    tierPurchasedAt: Date | null;
  } | null>(null);

  const { execute: fetchUserTier, isPending } = useAction(getUserTierAction, {
    onSuccess: (result) => {
      if (result.data) {
        setUserTier({
          tierNumber: result.data.tierNumber,
          tierPurchasedAt: result.data.tierPurchasedAt,
        });
      }
    },
  });

  useEffect(() => {
    fetchUserTier({});
  }, [fetchUserTier]);

  if (isPending) {
    return <div className="animate-pulse bg-gray-200 h-6 w-16 rounded-full" />;
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">
        Dynamic User Tier (Client Component)
      </h3>
      {userTier?.tierNumber && (
        <>
          <TierBadge tier={userTier.tierNumber} />
          <TierProgress
            currentTier={userTier.tierNumber}
            spotsRemaining={5}
            maxSpots={25}
          />
          {userTier.tierPurchasedAt && (
            <p className="text-sm text-muted-foreground">
              Purchased:{" "}
              {new Date(userTier.tierPurchasedAt).toLocaleDateString()}
            </p>
          )}
        </>
      )}
    </div>
  );
}
 */

/**
 * Example 3: Tier list with current user's tier highlighted

export function TierListExample() {
  const [currentTier, setCurrentTier] = useState<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | null
  >(null);

  const { execute: fetchUserTier } = useAction(getUserTierAction, {
    onSuccess: (result) => {
      if (result.data) {
        setCurrentTier(result.data.tierNumber);
      }
    },
  });

  useEffect(() => {
    fetchUserTier({});
  }, [fetchUserTier]);

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">
        All Tiers with Current Highlighted
      </h3>
      <TierList currentTier={currentTier || undefined} showAll={true} />
    </div>
  );
}

 */

// ===========================
// SERVER COMPONENT EXAMPLES
// ===========================

/**
 * Example 4: Server component with automatic user tier fetching
 * Use in server components (.tsx files without "use client")
 */
export async function ServerTierExamples() {
  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Server Components</h3>

      <div className="space-y-2">
        <h4 className="text-md font-medium">User Tier Badge (Server)</h4>
        <UserTierBadge fallbackTier={7} />
      </div>

      <div className="space-y-2">
        <h4 className="text-md font-medium">User Tier Progress (Server)</h4>
        <UserTierProgress spotsRemaining={10} maxSpots={25} fallbackTier={7} />
      </div>

      <div className="space-y-2">
        <h4 className="text-md font-medium">
          User Tier Display with Purchase Date (Server)
        </h4>
        <UserTierDisplay showPurchaseDate={true} fallbackTier={7} />
      </div>
    </div>
  );
}

// ===========================
// USAGE GUIDELINES
// ===========================

/**
 * WHEN TO USE EACH COMPONENT:
 *
 * CLIENT COMPONENTS (use in "use client" files):
 * - TierBadge: Static tier display when you know the tier
 * - TierProgress: Progress bars with known tier data
 * - TierList: List of tiers with optional highlighting
 * - Dynamic fetching with useAction hook for user data
 *
 * SERVER COMPONENTS (use in server-side files):
 * - UserTierBadge: Automatically fetches and displays user's tier
 * - UserTierProgress: User's tier with progress information
 * - UserTierDisplay: Full tier info with purchase date
 *
 * COMMON PATTERNS:
 *
 * 1. In Navigation/Headers (client components):
 *    - Use TierBadge with useAction to fetch tier
 *    - Add loading states and error handling
 *
 * 2. In Server Pages/Layouts:
 *    - Use UserTierBadge/UserTierDisplay directly
 *    - No need for loading states (server-side)
 *
 * 3. In Dashboards:
 *    - Mix of both depending on interactivity needs
 *    - Server components for initial render
 *    - Client components for dynamic updates
 */

// Cursor rules applied correctly.
