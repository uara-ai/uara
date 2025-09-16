"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "../auth/user-menu";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { TierBadge } from "@/components/healthspan/tiers";
import { getUserTierAction } from "@/actions/user-tier-action";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const user = useAuth();
  const [userTier, setUserTier] = useState<{
    tierNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
  } | null>(null);

  const {
    execute: fetchUserTier,
    isPending,
    result,
  } = useAction(getUserTierAction, {
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

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          {isPending && user.user && (
            <div className="hidden sm:inline-flex animate-pulse bg-gray-200 h-6 w-16 rounded-full" />
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
