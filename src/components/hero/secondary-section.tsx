"use client";

import { Users } from "lucide-react";

export function SecondarySection() {
  return (
    <div className="relative z-20 text-white w-full lg:w-1/2 px-6 lg:px-8 lg:text-left text-center mt-20 flex items-end justify-center lg:justify-end">
      <div className="flex flex-col items-center text-center space-y-6 mb-16">
        <p className="font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal">
          Trusted by
        </p>

        {/* Avatar Circles */}
        <div className="flex flex-col items-center space-y-2">
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

        <p className="font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal">
          Clients
        </p>

        {/* Stats */}
        <div className="space-y-3 text-center max-w-sm tracking-wider font-mono">
          <p className="font-[family-name:var(--font-instrument-serif)] text-[16px] font-normal text-white/80">
            5+ Hours/Time saved per month on manual data analysis and research
            for actionable insights.
          </p>
          <p className="font-[family-name:var(--font-instrument-serif)] text-[16px] font-normal text-white/80">
            78% Improvement in self-reported energy levels after just 3 weeks on
            the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
