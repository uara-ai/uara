import React from "react";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";

import { LogoCloud } from "@/components/landing/new/logo-cloud";
import { SecondarySection } from "./secondary-section";
import CTAButton from "./cta-button";
import { GithubStars } from "./github-stars";
import { WearableStatsChart } from "@/components/healthspan/v1/healthspan/wearable-stats-chart";
import { MiniDemo } from "./mini-demo";
import { SubscribeInput } from "../subscribe-input";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

// Mock wearable data for the hero section
const mockWearableData = {
  sleep: Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    return {
      score: {
        sleep_performance_percentage: Math.round(
          75 + Math.sin(i * 0.1) * 10 + (Math.random() - 0.5) * 15
        ),
      },
      created_at: date.toISOString(),
    };
  }),
  recovery: Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    return {
      score: {
        recovery_score: Math.round(
          70 + Math.cos(i * 0.15) * 15 + (Math.random() - 0.5) * 20
        ),
      },
      created_at: date.toISOString(),
    };
  }),
  cycles: Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    return {
      score: {
        strain: Math.round(
          12 + Math.sin(i * 0.08) * 4 + (Math.random() - 0.5) * 6
        ),
      },
      created_at: date.toISOString(),
    };
  }),
};

export default function HeroSection() {
  return (
    <>
      <main className="overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-green-600)]">
        <section>
          <div className="relative mx-auto max-w-6xl px-6 sm:px-0 pb-20 pt-24 lg:pt-38 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="relative z-10 text-left">
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h1"
                className="text-balance text-5xl font-medium md:text-6xl font-geist-sans text-[#085983]"
              >
                Your Health, Finally in Sync
              </TextEffect>
              <TextEffect
                preset="fade-in-blur"
                speedSegment={0.3}
                as="h2"
                className="text-balance text-xl font-medium md:text-4xl font-geist-sans text-[#085983]/80 mt-4"
              >
                Engineered for human optimization.
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground"
              >
                We unify your wearables, blood tests, workouts, sleep, and
                nutrition into one intelligent dashboard, turning your data into
                daily guidance to optimize recovery, longevity, and performance.
              </TextEffect>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-6 max-w-2xl text-pretty text-md text-[#085983] font-medium"
              >
                No more scattered apps. Just one place to understand, improve,
                and extend your healthspan.
              </TextEffect>
              {/* <CTAButton /> */}
              <SubscribeInput />

              <SecondarySection />

              <GithubStars />
            </div>
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...transitionVariants.item,
                }}
                className="mt-0"
              >
                <div
                  aria-hidden
                  className="bg-radial from-primary/50 dark:from-primary/25 relative mx-auto mt-12 sm:mt-0 max-w-2xl to-transparent to-55% text-left"
                >
                  <div className="bg-background border-border/50 absolute inset-0 mx-auto w-80 -translate-x-3 -translate-y-12 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6">
                    <div className="relative h-96 overflow-hidden rounded-[1.5rem] border p-2 pb-12 before:absolute before:inset-0 before:bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] before:opacity-50"></div>
                  </div>
                  <div className="bg-muted dark:bg-background/50 border-border/50 mx-auto w-80 translate-x-4 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:translate-x-8">
                    <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] border p-2 shadow-xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                      <div className="p-2">
                        <WearableStatsChart data={mockWearableData} />
                      </div>

                      <div className="bg-muted rounded-[1rem] p-4 pb-16 dark:bg-white/5"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5"></div>
                </div>
              </AnimatedGroup>
            </div>
          </div>
        </section>
        <MiniDemo />
        <LogoCloud />
      </main>
    </>
  );
}
