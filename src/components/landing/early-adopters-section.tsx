"use client";

import { cn } from "@/lib/utils";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import { useState, useEffect } from "react";
import {
  getSubscriberCount,
  getSubscriberAvatars,
} from "@/actions/subscribe-action";
import Image from "next/image";
import { SubscribeInput } from "@/components/landing/subscribe-input";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/use-checkout";
import Link from "next/link";

interface SubscriberData {
  count: number;
  avatars: { imageUrl: string; email?: string }[];
}

interface TierInfo {
  currentTier: {
    id: string;
    name: string;
    price: number;
    displayPrice: string;
    maxUsers: number;
  };
  nextTier: {
    id: string;
    name: string;
    price: number;
    displayPrice: string;
    maxUsers: number;
  } | null;
  spotsRemaining: number;
  totalUsers: number;
  adjustedUserCount: number;
  isLastTier: boolean;
}

interface EarlyAdoptersSectionProps {
  className?: string;
}

export function EarlyAdoptersSection({ className }: EarlyAdoptersSectionProps) {
  const [subscriberData, setSubscriberData] = useState<SubscriberData>({
    count: 200,
    avatars: [
      { imageUrl: "https://avatars.githubusercontent.com/u/16860520" },
      { imageUrl: "https://avatars.githubusercontent.com/u/20110627" },
      { imageUrl: "https://avatars.githubusercontent.com/u/106103625" },
      { imageUrl: "https://avatars.githubusercontent.com/u/59228569" },
    ],
  });
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { checkout, isLoading: checkoutLoading } = useCheckout();

  useEffect(() => {
    async function fetchData() {
      try {
        const [countResult, avatarsResult, tierResponse] = await Promise.all([
          getSubscriberCount(),
          getSubscriberAvatars(4),
          fetch("/api/pricing/tier"),
        ]);

        if (countResult.success && avatarsResult.success) {
          setSubscriberData({
            count: (countResult.data as any)?.count || 200,
            avatars:
              (avatarsResult.data as any)?.avatars || subscriberData.avatars,
          });
        }

        if (tierResponse.ok) {
          const tierData = await tierResponse.json();
          setTierInfo(tierData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayCount = isLoading ? "200+" : `${subscriberData.count}+`;

  const handleClaimNow = async () => {
    if (tierInfo) {
      await checkout(tierInfo.currentTier.id);
    }
  };

  return (
    <section
      className={cn(
        "relative w-full py-16 lg:py-24 overflow-hidden",
        className
      )}
      id="early-adopters"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background Image Container */}
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/adopters.png"
              width={1200}
              height={800}
              alt="Scenic mountain landscape background"
              className="w-full h-full object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#085983]/30 via-[#085983]/50 to-[#085983]/70"></div>
            {/* Additional overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 min-h-[600px] lg:min-h-[700px] flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full max-w-6xl">
              {/* Left Side - Main Title and Social Proof */}
              <div className="text-white space-y-8 lg:space-y-10 text-center lg:text-left">
                <div className="space-y-6">
                  <h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-tight">
                    Trusted by{" "}
                    <span className="block text-blue-200">early adopters,</span>
                  </h2>
                  <h3 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-tight">
                    backed by results
                  </h3>
                </div>

                {/* Social Proof Section */}
                <div className="space-y-6">
                  <p className="font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl lg:text-2xl font-normal text-white/90 leading-relaxed">
                    Real people. Real health improvements. Uara is already
                    transforming lives
                  </p>

                  {/* Avatar Display with Count */}
                  <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                    <div className="flex items-center justify-center">
                      <AvatarCircles
                        numPeople={subscriberData.count}
                        avatarUrls={subscriberData.avatars}
                        className="scale-110"
                      />
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border-2 border-white/30">
                      <span className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-semibold text-white tracking-wider">
                        {displayCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-200 mb-2">
                      5+
                    </div>
                    <p className="font-[family-name:var(--font-geist-sans)] text-sm font-normal text-white/90 leading-relaxed">
                      hours saved per month on data analysis
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-200 mb-2">
                      78%
                    </div>
                    <p className="font-[family-name:var(--font-geist-sans)] text-sm font-normal text-white/90 leading-relaxed">
                      improvement in energy levels after 4 weeks
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - CTA Section */}
              <div className="text-white space-y-8 text-center lg:text-left">
                {/* Waitlist Section */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-[family-name:var(--font-instrument-serif)] text-2xl lg:text-3xl font-semibold text-white">
                        Join the waitlist
                      </h4>
                      <p className="font-[family-name:var(--font-geist-sans)] text-base text-white/80">
                        Get early access when we launch
                      </p>
                    </div>
                    <SubscribeInput />
                  </div>
                </div>

                {/* Lifetime Deal CTA */}
                <div className="bg-gradient-to-br from-blue-100/20 via-white/10 to-blue-50/20 backdrop-blur-md rounded-2xl p-6 lg:p-8 border-2 border-white/30">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-[family-name:var(--font-instrument-serif)] text-xl lg:text-2xl font-semibold text-white">
                        Or secure lifetime access
                      </h4>
                      <div className="flex items-center justify-center lg:justify-start gap-3">
                        <span className="font-[family-name:var(--font-geist-sans)] text-lg text-white/90">
                          Only
                        </span>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
                          <span className="font-[family-name:var(--font-instrument-serif)] text-lg font-semibold text-white tracking-wider">
                            {tierInfo ? (
                              tierInfo.spotsRemaining === Infinity ? (
                                "∞"
                              ) : (
                                tierInfo.spotsRemaining
                              )
                            ) : (
                              <div className="animate-pulse bg-white/30 rounded w-8 h-4"></div>
                            )}
                          </span>
                        </div>
                        <span className="font-[family-name:var(--font-geist-sans)] text-lg text-white/90">
                          spots left at
                        </span>
                      </div>
                      <div className="font-[family-name:var(--font-instrument-serif)] text-3xl lg:text-4xl font-bold text-white">
                        {tierInfo ? (
                          tierInfo.currentTier.displayPrice
                        ) : (
                          <div className="animate-pulse bg-white/20 rounded h-10 w-24 mx-auto lg:mx-0"></div>
                        )}
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-b from-[#085983] via-[#0a6b99] to-[#085983] hover:from-[#074a6b] hover:via-[#085983] hover:to-[#074a6b] text-white font-[family-name:var(--font-instrument-serif)] text-lg font-bold py-4 px-6 rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 tracking-wider border-2 border-[#085983]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{
                        boxShadow:
                          "0 8px 20px rgba(8, 89, 131, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                      onClick={handleClaimNow}
                      disabled={checkoutLoading || !tierInfo}
                    >
                      {checkoutLoading
                        ? "PROCESSING..."
                        : !tierInfo
                        ? "LOADING..."
                        : "CLAIM LIFETIME ACCESS"}
                    </Button>

                    <p className="font-[family-name:var(--font-geist-sans)] text-sm text-white/70 text-center">
                      {tierInfo &&
                        !tierInfo.isLastTier &&
                        tierInfo.nextTier && (
                          <>Next price: {tierInfo.nextTier.displayPrice}</>
                        )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Cursor rules applied correctly.
