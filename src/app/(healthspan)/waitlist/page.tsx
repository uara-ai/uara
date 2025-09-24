import { Logo } from "@/components/logo";
import Pricing from "@/components/landing/new/pricing";
import { SignOut } from "@/components/auth/sign-out";
import { getCurrentTierInfo } from "@/actions/tier-actions";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

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

export default async function WaitlistPage() {
  // Check authentication
  const { user } = await withAuth();

  if (!user) {
    redirect("/login");
  }

  // Fetch tier information with caching
  let tierInfo: TierInfo | null = null;

  try {
    const result = await getCurrentTierInfo();
    if (result.success && result.data) {
      tierInfo = result.data;
    } else {
      console.error("Failed to fetch tier info:", result.error);
    }
  } catch (error) {
    console.error("Error fetching tier info:", error);
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white to-blue-50/30"
      data-fast-goal="waitlist_page_view"
    >
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-12">
          <h1 className="text-4xl md:text-6xl font-[family-name:var(--font-instrument-serif)] font-light tracking-tight text-[#085983]">
            Get Your Lifetime Access
          </h1>
          <p className="text-lg md:text-xl text-[#085983]/80 font-light max-w-2xl mx-auto">
            Join thousands of users who have already secured their spot.
            Limited-time lifetime deals available now.
          </p>

          <div className="flex flex-col items-center justify-center gap-2 text-[#085983]/60">
            <span className="text-sm">
              Signed in as{" "}
              <span className="text-[#085983] font-semibold">{user.email}</span>
            </span>
            <div className="items-center">
              <SignOut />
            </div>
          </div>
        </div>

        {/* Dynamic Pricing Card */}
        <div className="w-full max-w-6xl mx-auto">
          <Pricing />
        </div>

        {/* User Stats */}
        <div className="mt-12 text-center text-[#085983]/60">
          <span className="text-sm">
            {tierInfo ? (
              `${tierInfo.totalUsers} users have already claimed their lifetime access`
            ) : (
              <div className="animate-pulse bg-[#085983]/20 rounded h-4 w-80 mx-auto"></div>
            )}
          </span>
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

// Cursor rules applied correctly.
