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
    count: 380,
    avatars: [
      { imageUrl: "https://avatars.githubusercontent.com/u/16860520" },
      { imageUrl: "https://avatars.githubusercontent.com/u/20110627" },
      { imageUrl: "https://avatars.githubusercontent.com/u/106103625" },
      { imageUrl: "https://avatars.githubusercontent.com/u/59228569" },
    ],
  });
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { checkout, isLoading: checkoutLoading, error } = useCheckout();

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
            count: (countResult.data as any)?.count || 380,
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

  const displayCount = isLoading ? "380+" : `${subscriberData.count}`;

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
      data-fast-scroll="scroll_to_early_adopters"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Problem Statement */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Mobile: Simple title without decorative lines */}
          <div className="block sm:hidden mb-6">
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl font-normal text-[#085983] leading-tight mb-4">
              Your health data is scattered
            </h2>
            <p className="font-[family-name:var(--font-geist-sans)] text-base text-[#085983]/80 leading-relaxed px-4">
              Wearables. Labs. Apps. All disconnected. You&apos;re drowning in
              data but starving for insights.
            </p>
          </div>

          {/* Desktop: Decorative title with lines */}
          <div className="hidden sm:flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
            <h2 className="px-6 font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#085983]">
              Your health data is scattered
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
          </div>

          <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
            Wearables. Labs. Apps. All disconnected. You&apos;re drowning in
            data but starving for insights. Early adopters are already ahead of
            the curve.
          </p>
        </div>

        {/* Success Story Section */}
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/adopters.png"
              width={1200}
              height={800}
              alt="Early adopters success landscape"
              className="w-full h-full object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#085983]/40 via-[#085983]/60 to-[#085983]/40"></div>
            {/* Additional overlay for better text contrast */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 min-h-[600px] lg:min-h-[700px] flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full max-w-6xl">
              {/* Left Side - Success Story */}
              <div className="text-white space-y-8 lg:space-y-10 text-center lg:text-left">
                <div className="space-y-6">
                  <h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-tight">
                    Instead of scattered data,{" "}
                    <span className="block text-blue-200 bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text font-[family-name:var(--font-geist-sans)]">
                      unified insights
                    </span>
                  </h2>
                </div>

                {/* Social Proof & Results */}
                <div className="space-y-8">
                  <div className="items-center justify-center gap-4 flex flex-col">
                    <AvatarCircles
                      numPeople={subscriberData.count}
                      avatarUrls={subscriberData.avatars}
                      className="scale-110"
                    />
                    <div className="text-center lg:text-left">
                      <p className="font-[family-name:var(--font-geist-sans)] text-sm text-white/80">
                        <strong className="text-blue-200 underline underline-offset-4">
                          {displayCount}
                        </strong>{" "}
                        amazing humans reserved their spot with Uara
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - CTA Section */}
              <div className="text-white space-y-8 text-center lg:text-left">
                {/* Main CTA */}

                {/* Lifetime Deal CTA */}
                <div className="bg-gradient-to-br from-blue-100/20 via-white/15 to-blue-50/20 backdrop-blur-md rounded-2xl p-6 lg:p-8 border-2 border-white/30">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-[family-name:var(--font-geist-sans)] text-xl lg:text-2xl font-semibold text-white">
                        Secure lifetime access now
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
                          spots left
                        </span>
                      </div>
                      <div className="font-[family-name:var(--font-geist)] text-3xl lg:text-4xl font-bold text-white tracking-wider justify-center items-center text-center">
                        {tierInfo ? (
                          tierInfo.currentTier.displayPrice
                        ) : (
                          <div className="animate-pulse bg-white/20 rounded h-10 w-24 mx-auto lg:mx-0"></div>
                        )}
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-b from-[#085983] via-[#0a6b99] to-[#085983] hover:from-[#074a6b] hover:via-[#085983] hover:to-[#074a6b] text-white font-[family-name:var(--font-geist-sans)] text-lg font-bold py-4 px-6 rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 tracking-wider border-2 border-[#085983]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{
                        boxShadow:
                          "0 8px 20px rgba(8, 89, 131, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
                      }}
                      onClick={handleClaimNow}
                      disabled={checkoutLoading || !tierInfo}
                      data-fast-goal="initiate_checkout"
                    >
                      {checkoutLoading
                        ? "PROCESSING..."
                        : !tierInfo
                        ? "LOADING..."
                        : "GET LIFETIME ACCESS"}
                    </Button>

                    {error && (
                      <p className="text-red-400 text-sm mt-2 text-center">
                        {error}
                      </p>
                    )}

                    <p className="font-[family-name:var(--font-geist-sans)] text-sm text-white/70 text-center font-semibold">
                      {tierInfo &&
                        !tierInfo.isLastTier &&
                        tierInfo.nextTier && (
                          <>Next price: {tierInfo.nextTier.displayPrice}</>
                        )}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-[family-name:var(--font-geist-sans)] text-2xl lg:text-3xl font-semibold text-white">
                        Or join the movement
                      </h3>
                      <p className="font-[family-name:var(--font-geist-sans)] text-base text-white/80 leading-relaxed">
                        Don&apos;t let another month pass juggling health apps.
                        Get the clarity you deserve.
                      </p>
                    </div>
                    <SubscribeInput />
                    <p className="font-[family-name:var(--font-geist-sans)] text-xs text-white/60 text-center">
                      Early access when we launch
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bridge */}
        <div className="text-center mt-16 lg:mt-20 space-y-6">
          <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-3xl mx-auto leading-relaxed">
            Ready to see how we turn your scattered health data into clear,
            actionable insights?
          </p>
        </div>
      </div>
    </section>
  );
}

// Helper Components
interface PainPointCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  intensity: "high" | "medium" | "low";
}

function PainPointCard({
  icon,
  title,
  description,
  intensity,
}: PainPointCardProps) {
  const getIntensityStyles = (intensity: "high" | "medium" | "low") => {
    switch (intensity) {
      case "high":
        return {
          bg: "bg-gradient-to-br from-[#085983]/10 to-[#085983]/20",
          border: "border-[#085983]/30",
          iconBg: "bg-[#085983]/20",
          iconColor: "text-[#085983]",
          titleColor: "text-[#085983]",
          descColor: "text-[#085983]/80",
          hoverBg: "hover:from-[#085983]/15 hover:to-[#085983]/25",
        };
      case "medium":
        return {
          bg: "bg-gradient-to-br from-[#085983]/5 to-[#085983]/15",
          border: "border-[#085983]/20",
          iconBg: "bg-[#085983]/15",
          iconColor: "text-[#085983]/90",
          titleColor: "text-[#085983]/90",
          descColor: "text-[#085983]/70",
          hoverBg: "hover:from-[#085983]/10 hover:to-[#085983]/20",
        };
      case "low":
        return {
          bg: "bg-gradient-to-br from-[#085983]/3 to-[#085983]/8",
          border: "border-[#085983]/15",
          iconBg: "bg-[#085983]/10",
          iconColor: "text-[#085983]/80",
          titleColor: "text-[#085983]/80",
          descColor: "text-[#085983]/60",
          hoverBg: "hover:from-[#085983]/8 hover:to-[#085983]/15",
        };
    }
  };

  const styles = getIntensityStyles(intensity);

  return (
    <div
      className={cn(
        "relative overflow-hidden p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 group",
        styles.bg,
        styles.border,
        styles.hoverBg
      )}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>

      <div className="relative z-10">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110",
            styles.iconBg
          )}
        >
          <div className={styles.iconColor}>{icon}</div>
        </div>

        <h3
          className={cn(
            "font-[family-name:var(--font-geist-sans)] text-lg font-semibold mb-2 transition-colors",
            styles.titleColor
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "font-[family-name:var(--font-geist-sans)] text-sm leading-relaxed transition-colors",
            styles.descColor
          )}
        >
          {description}
        </p>
      </div>

      {/* Decorative corner element */}
      <div className="absolute top-2 right-2 w-8 h-8 bg-[#085983]/5 rounded-full blur-lg"></div>
    </div>
  );
}

// Cursor rules applied correctly.
