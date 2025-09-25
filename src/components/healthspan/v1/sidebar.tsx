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
    <div className="flex h-full flex-col bg-background border-r border-border/50">
      {/* Logo Section - improved spacing */}
      <div className="flex justify-center my-6 px-4">
        <Logo hidden className="justify-center" />
      </div>

      {/* Navigation - enhanced Revolut-style layout */}
      <nav className="flex-1 px-2">
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            const Icon = route.icon;

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex flex-col items-center gap-2 px-3 py-4 text-sm font-medium transition-all duration-200 group rounded-lg hover:scale-[1.02] active:scale-[0.98]",
                  isActive
                    ? "text-[#085983] bg-accent/30"
                    : "text-muted-foreground hover:text-[#085983] hover:bg-accent/20"
                )}
              >
                {/* Icon with enhanced styling */}
                <div
                  className={cn(
                    "p-2.5 rounded-xl transition-all duration-200",
                    isActive
                      ? "text-[#085983]"
                      : "group-hover:scale-110 hover:text-[#085983]"
                  )}
                >
                  <Icon className="size-6 flex-shrink-0" />
                </div>

                {/* Text label with better typography */}
                <span
                  className={cn(
                    "text-[10px] font-medium font-[family-name:var(--font-geist-sans)] tracking-wider transition-colors",
                    isActive && "text-[#085983]"
                  )}
                >
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
