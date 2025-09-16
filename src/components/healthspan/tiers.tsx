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
  "inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 hover:scale-105 shadow-lg border",
  {
    variants: {
      tier: {
        1: "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-900 border-amber-300 shadow-amber-200/50 hover:shadow-amber-300/60 animate-pulse",
        2: "bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500 text-white border-violet-400 shadow-violet-200/50 hover:shadow-violet-300/60",
        3: "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 text-white border-blue-400 shadow-blue-200/50 hover:shadow-blue-300/60",
        4: "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500 text-white border-emerald-400 shadow-emerald-200/50 hover:shadow-emerald-300/60",
        5: "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-white border-orange-400 shadow-orange-200/50 hover:shadow-orange-300/60",
        6: "bg-gradient-to-r from-slate-500 via-gray-500 to-slate-500 text-white border-slate-400 shadow-slate-200/50 hover:shadow-slate-300/60",
        7: "bg-gradient-to-r from-zinc-400 via-gray-400 to-zinc-400 text-gray-800 border-zinc-300 shadow-zinc-200/50 hover:shadow-zinc-300/60",
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
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <TierBadge tier={currentTier} size="sm" />
        <span className="text-xs text-muted-foreground">
          {spotsRemaining === Infinity
            ? "Unlimited"
            : `${spotsRemaining} spots left`}
        </span>
      </div>
      {spotsRemaining !== Infinity && (
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
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
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tiers.map((tier) => (
        <TierBadge
          key={tier}
          tier={tier}
          className={
            currentTier === tier
              ? "ring-2 ring-blue-500 ring-offset-2"
              : "opacity-60"
          }
        />
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
    <div className={cn("space-y-2", className)}>
      <TierBadge tier={tierNumber} />
      {showPurchaseDate && purchasedAt && (
        <p className="text-xs text-muted-foreground">
          Purchased: {new Date(purchasedAt).toLocaleDateString()}
        </p>
      )}
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
