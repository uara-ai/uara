"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/auth/user-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconApps } from "@tabler/icons-react";
import { User } from "@/lib/user.type";

// Apps configuration array
const apps = [
  {
    name: "Banking",
    href: "/healthspan/banking",
    icon: "💳",
    description: "Manage your finances",
    color: "bg-white text-black",
  },
  {
    name: "Business",
    href: "/healthspan/business",
    icon: "💼",
    description: "Business tools",
    color: "bg-black text-white",
  },
  {
    name: "Invest",
    href: "/healthspan/invest",
    icon: "📈",
    description: "Investment platform",
    color: "bg-orange-500 text-white",
  },
  {
    name: "Revolut X",
    href: "/healthspan/revolut-x",
    icon: "🌟",
    description: "Premium experience",
    color: "bg-gradient-to-br from-blue-400 to-purple-600 text-white",
  },
  {
    name: "People",
    href: "/healthspan/people",
    icon: "👥",
    description: "Connect with others",
    color: "bg-gray-600 text-white",
  },
];

interface HeaderProps {
  user: User | null;
  title?: string;
}

export function Header({ user, title }: HeaderProps) {
  const pathname = usePathname();
  const [appsOpen, setAppsOpen] = useState(false);

  // Get page title from pathname if not provided
  const getPageTitle = () => {
    if (title) return title;

    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];

    if (lastSegment === "healthspan") return "Home";

    return lastSegment
      ? lastSegment.charAt(0).toUpperCase() +
          lastSegment.slice(1).replace("-", " ")
      : "Home";
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
      <div className="flex h-16 items-center justify-between">
        {/* Left side - Page title */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-foreground">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right side - Apps dropdown and User menu */}
        <div className="flex items-center gap-3">
          {/* Apps Dropdown */}
          <DropdownMenu open={appsOpen} onOpenChange={setAppsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 rounded-full hover:bg-accent"
              >
                <IconApps className="h-5 w-5" />
                <span className="sr-only">Open apps menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-80 p-6"
              align="end"
              sideOffset={8}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Apps</h3>
              </div>

              {/* Apps Grid */}
              <div className="grid grid-cols-2 gap-4">
                {apps.map((app) => (
                  <Link
                    key={app.name}
                    href={app.href}
                    className="group relative"
                    onClick={() => setAppsOpen(false)}
                  >
                    <div className="flex flex-col items-center gap-3 rounded-lg p-4 transition-colors hover:bg-accent">
                      {/* App Icon */}
                      <div
                        className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl shadow-sm",
                          app.color
                        )}
                      >
                        <span className="text-2xl">{app.icon}</span>
                      </div>

                      {/* App Info */}
                      <div className="text-center">
                        <p className="font-medium text-sm text-foreground">
                          {app.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {app.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  More apps coming soon
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}

// Cursor rules applied correctly.
