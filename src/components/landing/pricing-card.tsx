"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Check, Sparkles, Zap, Brain, Clock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AutoCheckout } from "./AutoCheckout";

interface PricingCardProps {
  className?: string;
  hidden?: boolean;
}

const features = [
  "Unlimited AI health insights",
  "Advanced biomarker analysis",
  "Personalized longevity protocols",
  "Real-time wearable integration",
  "Priority email support",
  "Early access to new features",
];

const comingSoonFeatures = [
  "DNA analysis & recommendations",
  "Sleep optimization protocols",
  "Nutrition meal planning",
  "Exercise recovery tracking",
  "Supplement recommendations",
  "Health provider network",
];

export function PricingCard({ className, hidden }: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubscribe = async () => {
    // If user is not logged in, redirect to login first, then come back to checkout
    if (!user) {
      router.push("/login?redirect=/pricing?startCheckout=1");
      return;
    }

    setIsLoading(true);
    toast.loading("Redirecting to checkout...");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      toast.dismiss();
      if (!res.ok) {
        toast.error(data.error || "Unable to start checkout");
        setIsLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (error) {
      toast.dismiss();
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Subscription error:", error);
    } finally {
      // keep loading state until redirect happens
    }
  };

  return (
    <>
      <div
        className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4 pt-18 mb-4"
        id="pricing"
      >
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

        <AutoCheckout />
      </div>
      <div className={cn("max-w-4xl mx-auto px-4", className)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          {/* Main pricing card */}
          <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pro Plan
                </span>
              </div>

              <div className="mb-2">
                <span className="text-4xl font-medium text-gray-900 dark:text-gray-100">
                  $20
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-lg">
                  /month
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Unlock your full longevity potential
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Current Features */}
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Available Now
                </h3>
                {features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-4 h-4 bg-blue-500 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white dark:text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Coming Soon Features */}
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Coming Soon
                </h3>
                {comingSoonFeatures.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <Clock className="w-2.5 h-2.5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Separator line */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6"></div>

            {/* CTA Button */}
            <div className="relative group">
              <Button
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full h-12 rounded-2xl bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white border-0 transition-all duration-200 disabled:opacity-50 hover:text-white"
                variant="ghost"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-600 dark:border-gray-500 dark:border-t-gray-300 rounded-full animate-spin" />
                    <span className="text-sm">Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {user ? "Subscribe Now" : "Get Started"}
                    </span>
                  </div>
                )}
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Cancel anytime • No hidden fees
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                🔒 Secure payment with Stripe
              </p>
              {!hidden && (
                <Link
                  href="/"
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="size-3" />
                  Go back
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// Cursor rules applied correctly.
