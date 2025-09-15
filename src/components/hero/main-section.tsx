import { ArrowRight, CircleArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export function MainSection() {
  return (
    <div className="relative z-20 text-white w-full lg:w-1/2 px-6 lg:px-8 lg:text-left text-center mt-40">
      {/* Main Title */}
      <h1 className="text-center font-[family-name:var(--font-instrument-serif)] text-[48px] lg:text-[96px] md:text-[64px] sm:text-[32px] font-normal leading-tight mb-6">
        Uara
      </h1>

      {/* Subtitle */}
      <div className="mb-12 text-center">
        <p className="font-[family-name:var(--font-instrument-serif)] text-[24px] lg:text-[40px] md:text-[32px] sm:text-[20px] font-normal leading-relaxed">
          Live Younger, For Longer.
        </p>
        <p className="font-[family-name:var(--font-instrument-serif)] text-[24px] lg:text-[40px] md:text-[32px] sm:text-[20px] font-normal leading-relaxed">
          Engineered for Human Optimization.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-12 max-w-2xl lg:max-w-none lg:mx-0 mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask anything..."
            className="w-full px-6 py-4 rounded-full bg-white/10 border-2 border-[#085983] text-white placeholder-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#085983] font-[family-name:var(--font-instrument-serif)] text-lg tracking-wider"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#085983] to-[#1f88bd]/80 hover:from-[#085983]/90 hover:to-[#1f88bd]/60 rounded-full flex items-center justify-center transition-all duration-200 border-2 border-[#085983] shadow-lg">
            <Link href="/login">
              <CircleArrowOutUpRight className="w-5 h-5 text-white" />
            </Link>
          </button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16 max-w-3xl lg:max-w-none lg:mx-0 mx-auto">
        <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border-2 border-[#085983] rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
          <span className="font-[family-name:var(--font-instrument-serif)] text-[20px] font-normal text-white">
            Analyze My Sleep Patterns
          </span>
        </button>

        <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border-2 border-[#085983] rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
          <span className="text-2xl">🔄</span>
          <span className="font-[family-name:var(--font-instrument-serif)] text-[20px] font-normal text-white">
            Plan Longevity Routine
          </span>
        </button>

        <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border-2 border-[#085983] rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
          <span className="text-2xl">⚡</span>
          <span className="font-[family-name:var(--font-instrument-serif)] text-[20px] font-normal text-white">
            Optimize My Recovery
          </span>
        </button>

        <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border-2 border-[#085983] rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
          <span className="text-2xl">🧪</span>
          <span className="font-[family-name:var(--font-instrument-serif)] text-[20px] font-normal text-white">
            Review Lab Result
          </span>
        </button>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
