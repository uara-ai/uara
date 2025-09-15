"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BottomCTAProps {
  className?: string;
}

export function BottomCTA({ className }: BottomCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className={cn(
        "relative w-full py-16 lg:py-24 overflow-hidden",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Card Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Background Image Container */}
          <div
            className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="/bottom-cta.jpg"
                alt="Futuristic landscape with person wearing VR headset"
                className={cn("w-full h-full object-cover")}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#085983]/10 via-[#085983]/30 to-[#085983]/10"></div>
              {/* Additional overlay for better text contrast */}
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-12 lg:p-16">
              <div className="text-center min-h-[400px] sm:min-h-[500px] flex flex-col justify-center items-center space-y-8 lg:space-y-12">
                {/* Main Heading */}
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight max-w-4xl mx-auto">
                    Join the first 100 founding members
                  </h2>
                </div>

                {/* CTA Button */}
                <div className="relative">
                  {/* Glass Button Container */}
                  <div className="bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20 shadow-2xl">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#085983] to-[#0a6b99] hover:from-[#074a6b] hover:to-[#085983] text-white font-[family-name:var(--font-instrument-serif)] text-xl sm:text-2xl font-semibold py-6 px-12 sm:px-16 rounded-full shadow-lg  hover:shadow-xl  tracking-wider border-2 border-[#085983]/50"
                    >
                      Become a founding member
                    </Button>
                  </div>
                </div>

                {/* Subtitle/Description */}
                <div className="max-w-3xl mx-auto">
                  <p className="font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed">
                    Be part of the future of personalized health optimization.
                    Limited spots available at our exclusive founding member
                    price.
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-12 left-12 w-20 h-20 bg-[#085983]/20 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-8 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
          </div>
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .cta-title {
            font-size: 32px !important;
            line-height: 1.2 !important;
          }
          .cta-subtitle {
            font-size: 18px !important;
          }
          .cta-button {
            font-size: 18px !important;
            padding: 16px 32px !important;
          }
        }

        @media (max-width: 430px) {
          .cta-title {
            font-size: 28px !important;
          }
          .cta-subtitle {
            font-size: 16px !important;
          }
          .cta-button {
            font-size: 16px !important;
            padding: 14px 28px !important;
          }
        }
      `}</style>
    </section>
  );
}

// Cursor rules applied correctly.
