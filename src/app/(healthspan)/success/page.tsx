import Link from "next/link";
import { Brain, CheckCircle2, ScanHeart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CelebrationConfetti } from "@/components/ui/confetti";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/prisma";
import { getTierById } from "@/lib/tier-calculator";
import { Logo } from "@/components/logo";

export default async function SuccessPage() {
  let userTier = null;
  let tierInfo = null;

  try {
    const { user } = await withAuth();

    if (user) {
      // Get user's tier information
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: { tier: true, tierPurchasedAt: true },
      });

      if (userData?.tier) {
        userTier = userData;
        tierInfo = getTierById(userData.tier);
      }
    }
  } catch (error) {
    console.error("Error fetching user tier:", error);
  }
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white to-blue-50/30"
      data-fast-goal="success_page_view"
    >
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <CelebrationConfetti />

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-12">
          {/*<div className="inline-flex items-center gap-1.5 rounded-full shadow-sm ring-1 ring-[#085983]/20 ring-offset-1 ring-offset-background bg-gradient-to-br from-[#085983]/10 via-[#085983]/5 to-[#085983]/10 text-[#085983] px-4 py-2 mb-6">
            <CheckCircle2 className="size-5 text-[#085983]" />
            <span className="uppercase tracking-wide text-sm font-semibold text-[#085983]">
              Purchase Successful
            </span>
          </div>*/}

          <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-geist-sans)] font-light tracking-tight text-[#085983]">
            Welcome to Your Longevity Journey
          </h1>

          <p className="text-lg md:text-xl text-[#085983]/80 font-light max-w-2xl mx-auto">
            Thank you for securing your lifetime access. Your healthspan
            optimization starts now.
          </p>
        </div>

        {/* Tier Information Card */}
        {tierInfo && (
          <div className="w-full max-w-md mx-auto mb-12">
            <div className="bg-gradient-to-br from-blue-100/90 via-white/85 to-blue-50/80 backdrop-blur-md rounded-3xl shadow-2xl border-4 border-[#085983] p-8">
              <div className="text-center">
                <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl font-bold text-[#085983] mb-4 tracking-wider">
                  {tierInfo.name.toUpperCase()}
                </h2>
                <p className="font-[family-name:var(--font-geist-sans)] text-lg text-[#085983]/80 mb-4">
                  Lifetime Access
                </p>
                <div className="font-[family-name:var(--font-instrument-serif)] text-5xl font-bold text-[#085983] mb-6">
                  {tierInfo.displayPrice}
                </div>
                <p className="text-sm text-[#085983]/70 mb-6">
                  Purchased on{" "}
                  {userTier?.tierPurchasedAt
                    ? new Date(userTier.tierPurchasedAt).toLocaleDateString()
                    : "today"}
                </p>
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-full px-4 py-2">
                  <span className="text-green-700 font-semibold text-sm">
                    ✓ ACTIVATED
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="w-full max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Feature
              title="Higher Daily Limits"
              description="Chat more with your Uara AI coach without restrictions."
              icon={<Brain className="size-5 text-[#085983]" />}
            />
            <Feature
              title="Healthspan Tracking"
              description="Monitor biological age, recovery, and longevity metrics."
              icon={<ScanHeart className="size-5 text-[#085983]" />}
            />
            <Feature
              title="Priority Features"
              description="Early access to new capabilities and premium tools."
              icon={<Sparkles className="size-5 text-[#085983]" />}
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center space-y-6">
          <Link href={"/healthspan"} className="inline-block">
            <Button
              size="lg"
              className="bg-gradient-to-b from-[#085983] via-[#0a6b99] to-[#085983] hover:from-[#074a6b] hover:via-[#085983] hover:to-[#074a6b] text-white font-[family-name:var(--font-instrument-serif)] text-xl font-bold py-6 px-12 rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 tracking-widest border-2 border-[#085983]/50"
              style={{
                boxShadow:
                  "0 8px 20px rgba(8, 89, 131, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Brain className="size-6 mr-3" />
              START LIVING LONGER
            </Button>
          </Link>

          <p className="text-sm text-[#085983]/60 max-w-2xl mx-auto">
            Your lifetime access is now active. You&apos;ll receive an email
            when your account is ready to use.
          </p>
          {/*<p className="text-sm text-[#085983]/60 max-w-2xl mx-auto">
            Start exploring your personalized longevity insights and AI-powered
            health optimization.
          </p>*/}
        </div>

        {/* Navigation indicator */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2 text-[#085983]/40">
            <Logo hidden className="size-6" />
            <span className="text-sm">uara.ai</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-[#085983]/20 p-6 text-center hover:shadow-lg transition-all duration-300 hover:border-[#085983]/30">
      <div className="flex justify-center mb-4">
        <div className="bg-[#085983]/10 rounded-full p-3">{icon}</div>
      </div>
      <h3 className="font-[family-name:var(--font-geist-sans)] text-lg font-semibold text-[#085983] mb-3 tracking-wider">
        {title}
      </h3>
      <p className="text-sm text-[#085983]/70 leading-relaxed">{description}</p>
    </div>
  );
}

// Cursor rules applied correctly.
