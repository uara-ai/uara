"use client";

import Link from "next/link";
import { Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WipBannerProps {
  className?: string;
}

export function WipBanner({ className }: WipBannerProps) {
  return (
    <div
      className={cn(
        "relative mx-auto mt-10 sm:mt-16 lg:mt-20 max-w-3xl lg:max-w-4xl px-4 sm:px-6",
        className
      )}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/25 via-primary/15 to-accent/20 p-4 sm:p-6 shadow-sm ring-1 ring-ring/35">
        <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-secondary/15 blur-2xl" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-secondary/25 via-primary/20 to-accent/25 px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground ring-1 ring-ring/35 ring-offset-1 ring-offset-background mb-2">
          <Sparkles className="size-3.5" />
          beta
        </span>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
            <div className="space-y-1">
              <div className="text-sm sm:text-base font-medium text-foreground/90">
                We&apos;re building your Health OS — features shipping weekly
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Jump in early and help shape <strong>uara.ai</strong>. Limited
                early access: use code
                <button
                  onClick={() => navigator.clipboard.writeText("EARLY10")}
                  type="button"
                  aria-label="Copy discount code EARLY10"
                  className="mx-1 inline-flex items-center gap-1 rounded bg-foreground/10 px-1.5 py-0.5 font-semibold text-foreground hover:bg-foreground/15 transition-colors cursor-pointer"
                  title="Click to copy code"
                >
                  <span>EARLY10</span>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                to save $10.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/pricing" className="shrink-0 w-full sm:w-auto">
              <Button
                variant="default"
                size="sm"
                className="rounded-full w-full sm:w-auto"
              >
                <Brain className="mr-1.5 size-3.5" />
                Get early access
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:mt-5 sm:grid-cols-2 md:grid-cols-3">
          <FeaturePill label="AI health coach" status="beta" />
          <FeaturePill label="Lab uploads (CSV/PDF)" status="wip" />
          <FeaturePill label="Wearables integration" status="soon" />
        </div>
      </div>
    </div>
  );
}

function FeaturePill({
  label,
  status,
}: {
  label: string;
  status: "beta" | "soon" | "new" | "wip";
}) {
  const statusStyles =
    status === "beta"
      ? "from-amber-500/20 to-amber-500/10 text-amber-800 dark:text-amber-100"
      : status === "new"
      ? "from-emerald-500/20 to-emerald-500/10 text-emerald-800 dark:text-emerald-100"
      : status === "wip"
      ? "from-purple-500/20 to-purple-500/10 text-purple-800 dark:text-purple-100"
      : "from-cyan-500/20 to-cyan-500/10 text-cyan-800 dark:text-cyan-100";

  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-3 py-2">
      <span className="text-xs text-foreground/80">{label}</span>
      <span
        className={cn(
          "ml-2 inline-flex items-center gap-1 rounded-lg bg-gradient-to-br px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ring-1 ring-ring/35",
          statusStyles
        )}
      >
        {status}
      </span>
    </div>
  );
}

// Cursor rules applied correctly.
