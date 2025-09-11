"use client";

import Link from "next/link";
import { ArrowRight, Brain, Activity, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatars } from "./avatars";

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative mx-auto mt-20 sm:mt-24 lg:mt-32 max-w-4xl px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {/* Background Elements */}
      <div className="pointer-events-none absolute -left-10 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-secondary/8 blur-2xl" />

      <div className="relative text-center">
        {/* Beta Badge */}
        <div className="mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-secondary/20 via-primary/15 to-accent/20 px-4 py-2 text-xs font-medium uppercase tracking-wide text-foreground ring-1 ring-ring/20 ring-offset-1 ring-offset-background">
            <Brain className="size-3.5" />
            Early Access
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
          Your Health OS.{" "}
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Built for Founders.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10">
          Track, understand, and extend your healthspan. All your labs,
          wearables, and lifestyle data in one{" "}
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-sm opacity-60"></span>
            <span className="relative font-medium bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent px-2 py-1">
              AI-powered space.
            </span>
          </span>
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          <FeaturePill icon={Activity} label="Real-time insights" />
          <FeaturePill icon={TrendingUp} label="Longevity tracking" />
          <FeaturePill icon={Brain} label="AI health insights" />
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
          <Link href="/login" className="flex-1 sm:flex-none">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Live younger
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground">7-day free trial.</p>
        </div>

        {/* Social Proof */}
        <Avatars />
        {/* Bottom Spacing */}
        <div className="mt-16 sm:mt-20 lg:mt-24" />
      </div>
    </section>
  );
}

function FeaturePill({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-background/60 border border-border/60 px-3 py-1.5 text-xs font-medium text-foreground/80 ring-1 ring-ring/10">
      <Icon className="size-3.5 text-primary/70" />
      {label}
    </div>
  );
}

// Cursor rules applied correctly.
