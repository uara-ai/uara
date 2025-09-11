"use client";

import { Activity, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmallCTA } from "./cta";

interface HowItWorksProps {
  className?: string;
}

const heroFeatures = [
  {
    icon: BarChart3,
    title: "Biological Age Tracking",
    subtitle: "Your real age, not your birthday.",
    description:
      "Get your biological age from labs and wearable data so you can see how fast you're actually aging, and how to slow it down.",
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: FileText,
    title: "AI Lab Explanations",
    subtitle: "Blood tests, decoded.",
    description:
      "Upload a lab result and we translate complex markers into actionable insights. No more Googling strange terms or guessing what.",
    gradient: "from-purple-500/20 to-indigo-500/10",
    iconColor: "text-purple-500",
  },
  {
    icon: Activity,
    title: "Recovery & Stress",
    subtitle: "Know when to push, know when to rest.",
    description:
      "By syncing your health data from wearables, you can see your recovery trends and alerts you before burnout hits. Clear and simple.",
    gradient: "from-green-500/20 to-emerald-500/10",
    iconColor: "text-green-500",
  },
];

export function HowItWorks({ className }: HowItWorksProps) {
  return (
    <section
      className={cn(
        "relative mx-auto mt-24 sm:mt-32 lg:mt-40 max-w-6xl px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="relative text-center">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            How it{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur-sm opacity-60"></span>
              <span className="relative bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent px-2 py-1">
                works
              </span>
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Three simple steps to transform your health data into actionable
            longevity insights.
          </p>
        </div>

        {/* Hero Features - 3 Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {heroFeatures.map((feature, index) => (
            <HeroFeatureCard
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Spacing */}
        <div className="mt-4 sm:mt-6 lg:mt-40" />
      </div>
      <SmallCTA />
    </section>
  );
}

function HeroFeatureCard({
  feature,
  index,
}: {
  feature: (typeof heroFeatures)[0];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background/80 to-background/40 p-6 sm:p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 delay-${
        index * 100
      }`}
    >
      {/* Background gradient */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          feature.gradient
        )}
      />

      <div className="relative space-y-4">
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-xl bg-background/60 border border-border/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
            feature.gradient
          )}
        >
          <Icon className={cn("size-6", feature.iconColor)} />
        </div>

        {/* Content */}
        <div className="space-y-3 text-left">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">
            {feature.title}
          </h3>
          <p className="text-sm font-medium text-primary/80">
            {feature.subtitle}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}

// Cursor rules applied correctly.
