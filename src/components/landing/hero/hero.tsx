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
      <div className="relative z-20 w-full max-w-8xl mx-auto px-2 lg:px-12 flex flex-col min-h-screen">
        {/* Main Hero Content */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center">
          {/* Main Content (Left Section) */}
          <MainSection />

          {/* Secondary Section (Right Section) */}
          <SecondarySection />
        </div>

        {/* Bottom Text */}
        <div className="w-full text-center text-white pb-8 px-4 lg:px-6">
          <p className="bottom-text font-[family-name:var(--font-geist-sans)] text-base sm:text-lg md:text-xl lg:text-[20px] font-normal text-white/90 leading-relaxed max-w-6xl mx-auto">
            Your health data is fragmented. Your potential is not. uara.ai is
            the operating system that unifies your wearables, labs, and logs,
            translating raw data into an actionable longevity protocol.
          </p>
        </div>
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
          .quick-action-text {
            font-size: 10px !important;
          }
        }

        @media (max-width: 640px) {
          .bottom-text {
            font-size: 14px !important;
            line-height: 1.4 !important;
            padding: 0 16px !important;
          }
        }

        @media (max-width: 430px) {
          .bottom-text {
            font-size: 12px !important;
            line-height: 1.3 !important;
          }
        }
      `}</style>
    </section>
  );
}

// Cursor rules applied correctly.
