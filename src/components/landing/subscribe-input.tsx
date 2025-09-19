"use client";

import { subscribeAction } from "@/actions/subscribe-action";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 border-2 border-[#085983] rounded-full flex items-center justify-center backdrop-blur-sm">
        <Loader2 className="w-5 h-5 text-white animate-spin" />
      </div>
    );
  }

  return (
    <button
      type="submit"
      className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-[#085983] to-[#1f88bd]/80 hover:from-[#085983]/90 hover:to-[#1f88bd]/60 rounded-full flex items-center justify-center transition-all duration-200 border-2 border-[#085983] shadow-lg group"
    >
      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform duration-200" />
    </button>
  );
}

export function SubscribeInput() {
  const [isSubmitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-col items-center space-y-6 max-w-2xl mx-auto">
      <div className="w-full">
        {isSubmitted ? (
          <div className="relative w-full">
            <div className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 backdrop-blur-sm flex items-center justify-center space-x-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="font-[family-name:var(--font-geist-sans)] text-lg font-medium text-green-400 tracking-wider">
                Successfully Subscribed
              </span>
            </div>
          </div>
        ) : (
          <form
            action={async (formData) => {
              const email = formData.get("email") as string;
              const result = await subscribeAction({ email });

              if (result?.data?.success) {
                setSubmitted(true);
                toast.success("Thanks for joining!");
                setTimeout(() => {
                  setSubmitted(false);
                }, 5000);
              } else {
                toast.error("You're already on the list!");
              }
            }}
          >
            <div className="relative">
              <input
                placeholder="Enter your email to join the waitlist"
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                aria-label="Email address"
                required
                className="w-full px-6 py-4 pr-16 rounded-full bg-white/10 border-2 border-[#085983] text-white placeholder-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#085983] focus:bg-white/15 font-[family-name:var(--font-geist-sans)] text-lg tracking-wider transition-all duration-200"
              />
              <SubmitButton />
            </div>
          </form>
        )}
      </div>

      <div className="text-center space-y-3">
        <p className="font-[family-name:var(--font-geist-sans)] text-sm text-white/80 tracking-wide">
          We&apos;ll send you an email when we&apos;re live with early access.
        </p>
        <p className="font-[family-name:var(--font-geist-sans)] text-sm text-white/70 font-medium">
          If you want to support, you can choose one of the pricing plans 💙
        </p>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
