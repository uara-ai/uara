"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import {
  IconSettings,
  IconActivity,
  IconHealthRecognition,
} from "@tabler/icons-react";

// Routes configuration array - simplified for desktop sidebar
const routes = [
  {
    label: "Healthspan",
    href: "/healthspan",
    icon: IconHealthRecognition,
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Logo Section - just like Revolut */}
      <div className="flex justify-center my-4 mx-10">
        <Logo hidden className="justify-center" />
      </div>

      {/* Navigation - exactly like Revolut layout */}
      <nav className="flex-1">
        <div>
          {routes.map((route) => {
            const isActive = pathname === route.href;
            const Icon = route.icon;

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex flex-col items-center gap-2 px-3 py-4 text-sm font-medium transition-colors group",
                  isActive ? "text-[#085983]" : "text-muted-foreground"
                )}
              >
                {/* Icon with conditional background - centered like Revolut */}
                <div
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  )}
                >
                  <Icon className="size-6 flex-shrink-0" />
                </div>

                {/* Text label - centered below icon like Revolut */}
                <span className="text-[10px] font-medium font-[family-name:var(--font-geist-sans)] tracking-wider">
                  {route.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// Cursor rules applied correctly.
