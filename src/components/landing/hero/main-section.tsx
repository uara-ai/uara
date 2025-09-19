import { ArrowRight, CircleArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export function MainSection() {
  return (
    <div className="relative z-20 text-white w-full lg:w-1/2 px-6 lg:px-8 lg:text-left text-center mt-20">
      {/* Main Title */}
      <h1 className="text-center font-[family-name:var(--font-instrument-serif)] text-[48px] lg:text-[96px] md:text-[64px] sm:text-[32px] font-normal leading-tight mb-6">
        <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
          Uara{" "}
        </span>
        <span className="bg-gradient-to-r from-[#d5f1ff] via-[#a2e0ff] to-[#4ec4ff] bg-clip-text text-transparent animate-shimmer">
          AI
        </span>
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
            className="w-full px-6 py-4 rounded-full bg-white/10 border-2 border-[#085983] text-white placeholder-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#085983] font-[family-name:var(--font-geist-sans)] text-lg tracking-wider"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#085983] to-[#1f88bd]/80 hover:from-[#085983]/90 hover:to-[#1f88bd]/60 rounded-full flex items-center justify-center transition-all duration-200 border-2 border-[#085983] shadow-lg">
            <Link href="/login">
              <CircleArrowOutUpRight className="w-5 h-5 text-white" />
            </Link>
          </button>
        </div>
      </div>
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16 max-w-3xl lg:max-w-none lg:mx-0 mx-auto tracking-wider">
        <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border-2 border-[#085983] rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-zzz"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 12h6l-6 8h6" />
            <path d="M14 4h6l-6 8h6" />
          </svg>
          <span className="font-[family-name:var(--font-geist-sans)] text-base font-normal text-white">
            Analyze My Sleep Patterns
          </span>
        </button>

        <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border-2 border-[#085983] rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-route-square"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 17h4v4h-4z" />
            <path d="M17 3h4v4h-4z" />
            <path d="M11 19h5.5a3.5 3.5 0 0 0 0 -7h-8a3.5 3.5 0 0 1 0 -7h4.5" />
          </svg>
          <span className="font-[family-name:var(--font-geist-sans)] text-base font-normal text-white">
            Plan Longevity Routine
          </span>
        </button>

        <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border-2 border-[#085983] rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-gymnastics"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M7 7a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
            <path d="M13 21l1 -9l7 -6" />
            <path d="M3 11h6l5 1" />
            <path d="M11.5 8.5l4.5 -3.5" />
          </svg>
          <span className="font-[family-name:var(--font-geist-sans)] text-base font-normal text-white">
            Optimize My Recovery
          </span>
        </button>

        <button className="flex items-center space-x-3 px-6 py-3 bg-white/10 border-2 border-[#085983] rounded-full hover:bg-white/20 transition-colors backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-stereo-glasses"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 3h-2l-3 9" />
            <path d="M16 3h2l3 9" />
            <path d="M3 12v7a1 1 0 0 0 1 1h4.586a1 1 0 0 0 .707 -.293l2 -2a1 1 0 0 1 1.414 0l2 2a1 1 0 0 0 .707 .293h4.586a1 1 0 0 0 1 -1v-7h-18z" />
            <path d="M7 16h1" />
            <path d="M16 16h1" />
          </svg>
          <span className="font-[family-name:var(--font-geist-sans)] text-base font-normal text-white">
            Review Lab Result
          </span>
        </button>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
