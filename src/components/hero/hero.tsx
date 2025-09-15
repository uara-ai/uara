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

      {/* Main Content (Left Section) */}
      <MainSection />

      {/* Secondary Section (Right Section) */}
      <SecondarySection />

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
