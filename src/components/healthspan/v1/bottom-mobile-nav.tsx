"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconHome, IconActivity, IconSettings } from "@tabler/icons-react";

// Mobile navigation routes
const mobileRoutes = [
  {
    label: "Healthspan",
    href: "/healthspan",
    icon: IconHome,
  },
  {
    label: "Wearables",
    href: "/healthspan/wearables",
    icon: IconActivity,
  },
  {
    label: "Settings",
    href: "/healthspan/settings",
    icon: IconSettings,
  },
];

export function BottomMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t lg:hidden pb-safe-area-inset-bottom">
      <div className="safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 sm:px-6 py-2 sm:py-3 max-w-md mx-auto">
          {mobileRoutes.map((route) => {
            const isActive = pathname === route.href;
            const Icon = route.icon;

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex flex-col items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 min-w-0 flex-1 hover:scale-105 active:scale-95",
                  isActive
                    ? "text-[#085983] bg-accent/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 transition-colors",
                    isActive && "text-[#085983]"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] sm:text-xs font-medium truncate transition-colors",
                    isActive && "text-[#085983]"
                  )}
                >
                  {route.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

// Cursor rules applied correctly.
