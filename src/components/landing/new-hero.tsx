"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Brain, Activity, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { Avatars } from "./avatars";
import { SubscribeInput } from "./subscribe-input";
import { AnimatedGroup } from "../motion-primitives/animated-group";
import { Variants } from "motion/react";
import { SecondarySection } from "./new/secondary-section";

interface HeroProps {
  className?: string;
}

export function NewHero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative w-full min-h-screen flex items-center justify-center overflow-hidden mb-24",
        className
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
      </div>

      <div className="relative text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mt-28">
        {/* Beta Badge */}
        <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0 mb-8">
          <AnimatedGroup>
            <Link
              href="/waitlist"
              className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
            >
              <span className="text-primary font-semibold text-sm">
                Beta Access is now live!
              </span>
              <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

              <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                  <span className="flex size-6 text-primary">
                    <ArrowRight className="m-auto size-3" />
                  </span>
                  <span className="flex size-6 text-primary">
                    <ArrowRight className="m-auto size-3" />
                  </span>
                </div>
              </div>
            </Link>
          </AnimatedGroup>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
          Build smarter habits with{" "}
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            connected health data.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10">
          AI turns your{" "}
          <span className="font-medium text-primary">wearables</span>,{" "}
          <span className="font-medium text-primary">labs</span>, and{" "}
          <span className="font-medium text-primary">lifestyle data</span> into
          daily insights to help you recover, improve, and extend your{" "}
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-sm opacity-60"></span>
            <span className="relative font-medium bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent px-2 py-1">
              healthspan.
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
          <SubscribeInput />
          <SecondarySection />
        </div>

        {/* Social Proof 
        <Avatars />*/}
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
