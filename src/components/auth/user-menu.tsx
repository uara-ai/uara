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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { SignOut } from "@/components/auth/sign-out";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { User } from "@/lib/user.type";

type Props = {
  user: User | null;
  onlySignOut?: boolean;
};

export function UserMenu({ user, onlySignOut }: Props) {
  // If user is not logged in, show login button
  if (!user) {
    return (
      <Link href="/login">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="rounded-lg bg-accent hover:bg-accent/80 group transition-all hover:scale-105"
        >
          <LogIn size={16} className="group-hover:rotate-12 transition-all" />
          <span className="text-sm ml-1.5 font-semibold ">Log in</span>
        </Button>
      </Link>
    );
  }

  // Extract user info from WorkOS user object
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const avatarUrl = user.profilePictureUrl;
  const email = user.email || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-full w-8 h-8 cursor-pointer border border-border">
          {avatarUrl ? (
            <AvatarImage
              src={avatarUrl}
              alt={fullName || email}
              width={32}
              height={32}
            />
          ) : null}
          <AvatarFallback>
            <span className="text-xs">
              {(firstName || lastName || fullName)?.charAt(0)?.toUpperCase() ||
                email?.charAt(0)?.toUpperCase() ||
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
            <div className="flex flex-row justify-between items-center px-2 py-1.5">
              <div className="flex items-center">
                <p className="text-sm font-medium">Theme</p>
              </div>
              <ThemeSwitcher />
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        <SignOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Cursor rules applied correctly.
