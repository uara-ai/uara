"use client";

import { ArrowRight } from "lucide-react";

export function MainSection() {
  return (
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

      {/* Bottom Text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white max-w-4xl px-6">
        <p className="font-[family-name:var(--font-instrument-serif)] text-[20px] font-normal text-white/90 leading-relaxed">
          Your health data is fragmented. Your potential is not. uara.ai is the
          operating system that unifies your wearables, labs, and logs,
          translating raw data into an actionable longevity protocol.
        </p>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
