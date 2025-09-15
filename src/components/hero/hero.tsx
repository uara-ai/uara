"use client";

import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <nav className="absolute top-0 left-0 right-0 z-30 p-6 lg:p-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full border-2 border-white/30 flex items-center justify-center">
              <div className="w-4 h-4 bg-white/60 rounded-full" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/pricing"
              className="text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className="text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal"
            >
              FAQ
            </Link>
            <Link
              href="/reviews"
              className="text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal"
            >
              Reviews
            </Link>
            <Link
              href="/blog"
              className="text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal"
            >
              Blog
            </Link>
          </div>

          {/* Login Button */}
          <Link href="/login">
            <Button
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal px-6 py-3 h-auto backdrop-blur-sm"
            >
              Login
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-20 text-center text-white max-w-6xl mx-auto px-6 lg:px-8">
        {/* Main Title */}
        <h1 className="font-[family-name:var(--font-instrument-serif)] text-[96px] lg:text-[96px] md:text-[72px] sm:text-[48px] font-normal leading-tight mb-6">
          Uara Ai
        </h1>

        {/* Subtitle */}
        <div className="mb-12">
          <p className="font-[family-name:var(--font-instrument-serif)] text-[40px] lg:text-[40px] md:text-[32px] sm:text-[20px] font-normal leading-relaxed mb-2">
            Live Younger, For Longer.
          </p>
          <p className="font-[family-name:var(--font-instrument-serif)] text-[40px] lg:text-[40px] md:text-[32px] sm:text-[20px] font-normal leading-relaxed">
            Engineered for Human Optimization.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask anything..."
              className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 font-[family-name:var(--font-instrument-serif)] text-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16 max-w-3xl mx-auto">
          <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border border-white/30 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
            <span className="text-2xl">💤</span>
            <span className="font-[family-name:var(--font-instrument-serif)] text-[20px] font-normal text-white">
              Analyze My Sleep Patterns
            </span>
          </button>

          <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border border-white/30 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
            <span className="text-2xl">🔄</span>
            <span className="font-[family-name:var(--font-instrument-serif)] text-[20px] font-normal text-white">
              Plan Longevity Routine
            </span>
          </button>

          <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border border-white/30 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
            <span className="text-2xl">⚡</span>
            <span className="font-[family-name:var(--font-instrument-serif)] text-[20px] font-normal text-white">
              Optimize My Recovery
            </span>
          </button>

          <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border border-white/30 rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
            <span className="text-2xl">🧪</span>
            <span className="font-[family-name:var(--font-instrument-serif)] text-[20px] font-normal text-white">
              Review Lab Result
            </span>
          </button>
        </div>
      </div>

      {/* Right Side - Trusted By Section */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden xl:block">
        <div className="text-right text-white">
          <p className="font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal mb-4">
            Trusted by
          </p>

          {/* Avatar Circles */}
          <div className="flex flex-col items-end space-y-2 mb-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center text-white/70"
                >
                  <Users className="w-6 h-6" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center">
                <span className="text-white/70 text-sm font-medium">200+</span>
              </div>
            </div>
          </div>

          <p className="font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal mb-6">
            Clients
          </p>

          {/* Stats */}
          <div className="space-y-3 text-right">
            <p className="font-[family-name:var(--font-instrument-serif)] text-[16px] font-normal text-white/80">
              5+ Hours/Time saved per month on manual data analysis and research
              for actionable insights.
            </p>
            <p className="font-[family-name:var(--font-instrument-serif)] text-[16px] font-normal text-white/80">
              78% Improvement in self-reported energy levels after just 3 weeks
              on the platform.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center text-white max-w-4xl px-6">
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
