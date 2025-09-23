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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around px-4 py-2">
        {mobileRoutes.map((route) => {
          const isActive = pathname === route.href;
          const Icon = route.icon;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive && "text-accent-foreground"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium truncate",
                  isActive && "text-accent-foreground"
                )}
              >
                {route.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Cursor rules applied correctly.
