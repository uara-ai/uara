"use client";

import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";
import { MainSection } from "./main-section";
import { SecondarySection } from "./secondary-section";

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative min-h-screen w-full overflow-hidden flex items-center justify-center",
        className
      )}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Navigation Bar */}
      <Navbar />

      {/* Content Layout Container */}
      <div className="relative z-20 w-full max-w-8xl mx-auto px-2 lg:px-12 min-h-screen flex flex-col lg:flex-row items-center justify-center">
        {/* Main Content (Left Section) */}
        <MainSection />

        {/* Secondary Section (Right Section) */}
        <SecondarySection />
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 text-center text-white max-w-7xl px-6 mt-16 w-full">
        <p className="font-[family-name:var(--font-instrument-serif)] text-[20px] font-normal text-white/90 leading-relaxed">
          Your health data is fragmented. Your potential is not. uara.ai is the
          operating system that unifies your wearables, labs, and logs,
          translating raw data into an actionable longevity protocol.
        </p>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 430px) {
          .hero-title {
            font-size: 48px !important;
          }
          .hero-subtitle {
            font-size: 20px !important;
          }
          .nav-options {
            font-size: 16px !important;
          }
          .trusted-text {
            font-size: 16px !important;
          }
          .stats-text {
            font-size: 8px !important;
          }
          .bottom-text {
            font-size: 10px !important;
          }
          .quick-action-text {
            font-size: 10px !important;
          }
        }
      `}</style>
    </section>
  );
}

// Cursor rules applied correctly.
