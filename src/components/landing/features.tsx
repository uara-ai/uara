"use client";

import {
  Heart,
  FileText,
  BarChart3,
  TrendingUp,
  Brain,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturesProps {
  className?: string;
}

const features = [
  {
    icon: Shield,
    title: "Data Privacy & Ownership",
    description:
      "Your data is encrypted. We don't sell or share. This is your Notion for health, not your data broker.",
    image: "/placeholder-privacy.jpg",
  },
  {
    icon: Heart,
    title: "Wearable Integrations",
    description:
      "Sync with Whoop (and soon Oura, Fitbit, Apple Health, Garmin) to track HRV, recovery, sleep, and stress in one place.",
    comingSoon: true,
    image: "/placeholder-wearables.jpg",
  },
  {
    icon: FileText,
    title: "Weekly AI Reports",
    description:
      'Receive concise, personalized reports: "Your aging pace slowed this week thanks to consistent sleep."',
    comingSoon: true,
    image: "/placeholder-reports.jpg",
  },
  {
    icon: BarChart3,
    title: "Unified Health Dashboard",
    description:
      "One clean interface for labs, lifestyle, and wearable data. Stop jumping between papers.",
    comingSoon: true,
    image: "/placeholder-dashboard.jpg",
  },
  {
    icon: TrendingUp,
    title: "Longevity Gamification",
    description:
      "Earn milestones for lowering biological age and improving healthspan. Longevity becomes a game.",
    comingSoon: true,
    image: "/placeholder-gamification.jpg",
  },
  {
    icon: Brain,
    title: "Nutrition Correlations",
    description:
      "Log meals and instantly see the impact of food on HRV, glucose, and sleep.",
    comingSoon: true,
    image: "/placeholder-nutrition.jpg",
  },
  {
    icon: Zap,
    title: "Recovery Optimizer",
    description:
      "AI recommends when to train harder, when to rest, and which supplements may help.",
    comingSoon: true,
    image: "/placeholder-recovery.jpg",
  },
  {
    icon: BarChart3,
    title: "Peer Benchmarks",
    description:
      "See how your healthspan compares with other founders and builders. Share your progress publicly on X with one click.",
    comingSoon: true,
    image: "/placeholder-benchmarks.jpg",
  },
];

export function Features({ className }: FeaturesProps) {
  return (
    <section
      className={cn(
        "relative mx-auto mt-24 sm:mt-32 lg:mt-40 max-w-7xl px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="relative">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            All{" "}
            <span className="relative inline-block">
              <span className="relative bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent px-2 py-1">
                features
              </span>
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to transform your health data into actionable
            insights for longevity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom Spacing */}
        <div className="mt-24 sm:mt-32 lg:mt-40" />
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background/80 to-background/40 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 delay-${
        (index * 100) % 600
      }`}
    >
      {/* Coming soon badge */}
      {feature.comingSoon && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-600 ring-1 ring-orange-500/20 backdrop-blur-sm">
            <Clock className="size-3" />
            Coming Soon
          </span>
        </div>
      )}

      {/* Image/Video Slot */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10">
        {/* Placeholder for image/video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-xl bg-background/60 border border-border/40 flex items-center justify-center">
            <Icon className="size-8 text-primary/70" />
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Corner accent */}
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}

// Cursor rules applied correctly.
