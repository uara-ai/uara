"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { SignOut } from "@/components/dashboard/sign-out";
import { ThemeSwitch } from "@/components/dashboard/theme-switch";
import { useAuth } from "@/contexts/auth-context";

type Props = {
  onlySignOut?: boolean;
};

export function UserMenu({ onlySignOut }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Extract user info from Supabase user object
  const userMetadata = user.user_metadata || {};
  const fullName =
    userMetadata.full_name ||
    `${userMetadata.first_name || ""} ${userMetadata.last_name || ""}`.trim();
  const firstName = userMetadata.first_name || "";
  const lastName = userMetadata.last_name || "";
  const avatarUrl = userMetadata.avatar_url || userMetadata.picture;
  const email = user.email || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-full w-8 h-8 cursor-pointer border border-border">
          {avatarUrl && (
            <AvatarImage
              src={avatarUrl}
              alt={fullName || email}
              width={32}
              height={32}
            />
          )}
          <AvatarFallback>
            <span className="text-xs">
              {(firstName || lastName || fullName)?.charAt(0)?.toUpperCase() ||
                "U"}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" sideOffset={10} align="end">
        {!onlySignOut && (
          <>
            <DropdownMenuLabel>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="truncate line-clamp-1 max-w-[155px] block">
                    {fullName || email}
                  </span>
                  <span className="truncate text-xs text-[#606060] font-normal">
                    {email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Link prefetch href="/account">
                <DropdownMenuItem>Account</DropdownMenuItem>
              </Link>

              <Link prefetch href="/account/support">
                <DropdownMenuItem>Support</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <div className="flex flex-row justify-between items-center p-2">
              <p className="text-sm">Theme</p>
              <ThemeSwitch />
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <SignOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
