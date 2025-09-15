"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PricingTierProps {
  className?: string;
}

export function PricingTier({ className }: PricingTierProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Pricing Cards Container */}
      <div className="flex justify-center lg:justify-end">
        <div className="relative">
          {/* Background Card (Tier 2) - Positioned behind */}
          <div className="absolute top-6 right-6 z-0 transform rotate-6 scale-95">
            <div className="w-80 h-96 bg-gradient-to-br from-blue-200/80 via-blue-100/70 to-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-[#085983]/30">
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-white/20 rounded-3xl backdrop-blur-sm"></div>

              {/* Card content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div className="text-center">
                  <h3 className="font-[family-name:var(--font-instrument-serif)] text-3xl font-bold text-[#085983] mb-4">
                    TIER 2
                  </h3>
                  <p className="font-[family-name:var(--font-instrument-serif)] text-lg text-[#085983]/80 mb-4">
                    Lifetime access for only
                  </p>
                  <div className="font-[family-name:var(--font-instrument-serif)] text-6xl font-bold text-[#085983] mb-6">
                    $79
                  </div>
                </div>
                <div className="bg-[#085983]/60 text-white py-4 px-8 rounded-full text-center font-[family-name:var(--font-instrument-serif)] text-lg font-bold tracking-wider opacity-70">
                  COMING SOON
                </div>
              </div>
            </div>
          </div>

          {/* Front Card (Tier 1) - Main active card */}
          <div className="relative z-10 transform hover:scale-105 transition-all duration-300">
            <div className="w-80 h-96 bg-gradient-to-br from-blue-100/90 via-white/85 to-blue-50/80 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-[#085983]">
              {/* Glass effect with blue tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-white/30 to-blue-100/20 rounded-3xl backdrop-blur-md"></div>

              {/* Card content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div className="text-center">
                  <h3 className="font-[family-name:var(--font-instrument-serif)] text-4xl font-bold text-[#085983] mb-6 tracking-wider">
                    TIER 1
                  </h3>
                  <p className="font-[family-name:var(--font-geist-sans)] text-2xl text-[#085983] mb-6 leading-relaxed">
                    Lifetime access for only
                  </p>
                  <div className="font-[family-name:var(--font-instrument-serif)] text-7xl font-bold text-[#085983] mb-8 leading-none">
                    $49
                  </div>
                </div>

                {/* 3D Button */}
                <div className="relative">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-b from-[#085983] via-[#0a6b99] to-[#085983] hover:from-[#074a6b] hover:via-[#085983] hover:to-[#074a6b] text-white font-[family-name:var(--font-instrument-serif)] text-xl font-bold py-6 px-8 rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 tracking-widest border-2 border-[#085983]/50"
                    style={{
                      boxShadow:
                        "0 8px 20px rgba(8, 89, 131, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    CLAIM NOW
                  </Button>
                  {/* Button shadow for 3D effect */}
                  <div className="absolute inset-0 bg-[#085983]/20 rounded-full blur-lg transform translate-y-2 -z-10"></div>
                </div>
              </div>
            </div>

            {/* Card 3D shadow */}
            <div className="absolute inset-0 bg-[#085983]/20 rounded-3xl blur-xl transform translate-y-4 translate-x-2 -z-10"></div>
          </div>

          {/* Additional decorative elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400/30 rounded-full blur-sm"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-[#085983]/20 rounded-full blur-lg"></div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
