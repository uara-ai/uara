import { PricingCard } from "@/components/landing/pricing-card";
import { AutoCheckout } from "@/components/landing/AutoCheckout";
import { ProfileCompletionHandler } from "@/components/landing";

export default async function PricingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-4xl mx-auto px-4 pt-18 mb-20">
      {/* Header section matching welcome screen */}
      <div className="text-center mb-12 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-medium text-gray-900 dark:text-gray-100 mb-2">
          One Simple Plan
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Unlock advanced health insights and personalized longevity protocols
          with our Pro plan. Start your journey to extended healthspan today.
        </p>
      </div>

      {/* Pricing card */}
      <PricingCard />
      <AutoCheckout />
    </div>
  );
}
