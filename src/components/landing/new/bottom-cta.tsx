"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface BottomCTAProps {
  className?: string;
}

export function BottomCTA({ className }: BottomCTAProps) {
  return (
    <div
      className={cn(
        "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24",
        className
      )}
      data-fast-scroll="scroll_to_cta"
      id="cta"
    >
      {/* Header Section */}
      <div className="flex items-center justify-center px-4">
        <div className="hidden sm:flex flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
        <h2 className="px-2 sm:px-6 font-geist-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#085983] text-center">
          Join the first 100 founding members
        </h2>
        <div className="hidden sm:flex flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
      </div>
      <p className="text-center font-geist-sans text-sm sm:text-base md:text-lg lg:text-xl text-[#085983]/80 max-w-4xl mx-auto leading-relaxed px-4 mt-4 sm:mt-6">
        Be part of the future of personalized health optimization. Limited spots
        available at our exclusive founding member price.
      </p>

      {/* CTA Content */}
      <div className="mt-12 sm:mt-16 lg:mt-20">
        <div className="relative max-w-4xl mx-auto">
          {/* Background Card with Image */}
          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                width={1000}
                height={1000}
                src="/bottom-cta.jpg"
                alt="Futuristic landscape with person wearing VR headset"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay for brand consistency */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#085983]/60 via-[#085983]/40 to-[#085983]/60"></div>
              {/* Additional overlay for text readability */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-8 left-8 w-24 h-24 bg-[#085983]/20 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 sm:p-12 lg:p-16 text-center">
              <div className="space-y-8 lg:space-y-12">
                {/* Main CTA Message */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="font-geist-sans text-sm md:text-base font-medium text-white">
                      Limited Time Offer
                    </span>
                  </div>

                  <h3 className="font-geist-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
                    Secure your lifetime access today
                  </h3>

                  <p className="font-geist-sans text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                    Don't miss your chance to be among the first 100 lifetime
                    members. Once these spots are gone, they're gone forever.
                  </p>
                </div>

                {/* CTA Button */}
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20 shadow-2xl inline-block">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#085983] to-[#0a6b99] hover:from-[#074a6b] hover:to-[#085983] text-white font-geist-sans text-lg sm:text-xl font-semibold py-6 px-12 sm:px-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-[#085983]/30"
                      asChild
                      data-fast-goal="cta_button_click"
                    >
                      <Link href="/login">Claim your lifetime spot →</Link>
                    </Button>
                  </div>

                  <p className="font-geist-sans text-sm text-white/80">
                    No subscription fees. No hidden costs. Pay once, own
                    forever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
