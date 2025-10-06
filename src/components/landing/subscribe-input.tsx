"use client";

import { subscribeAction } from "@/actions/subscribe-action";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";

function SubmitButton({ isFormValid }: { isFormValid: boolean }) {
  const { pending } = useFormStatus();

  return (
    <div className="p-1 sm:p-2">
      <Button
        type="submit"
        disabled={!isFormValid || pending}
        size="lg"
        className={cn(
          "size-9 rounded-xl border-0 shadow-lg transition-all duration-300",
          "text-white font-semibold bg-primary",
          "disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none",
          "hover:scale-105 active:scale-95",
          isFormValid && "shadow-primary/25 hover:shadow-primary/40"
        )}
      >
        {pending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <ArrowRight className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}

export function SubscribeInput() {
  const [isSubmitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const isFormValid = email.length > 0 && email.includes("@");

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      {isSubmitted ? (
        <div className="relative flex items-center bg-background border-2 border-green-500/50 rounded-2xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-center gap-3 px-4 sm:px-6 py-3 sm:py-4 w-full bg-gradient-to-r from-green-500/20 to-emerald-500/20">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-lg font-semibold text-green-600">
              Successfully Subscribed!
            </span>
          </div>
        </div>
      ) : (
        <form
          action={async (formData) => {
            const emailValue = formData.get("email") as string;
            const result = await subscribeAction({ email: emailValue });

            if (result?.data?.success) {
              setSubmitted(true);
              toast.success("Thanks for joining!");
              setTimeout(() => {
                setSubmitted(false);
                setEmail("");
              }, 5000);
            } else {
              toast.error("You're already on the list!");
            }
          }}
          className="relative"
        >
          <div className="relative flex items-center bg-background border-2 border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Brand prefix */}
            <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4">
              <Image
                src="/logo.svg"
                alt="Uara"
                width={32}
                height={32}
                className="rounded-xl"
              />
              <span className="text-lg font-semibold text-primary">
                uara.ai
              </span>
            </div>

            {/* Email input */}
            <div className="flex-1 relative">
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 text-lg sm:text-xl py-2.5 px-4 sm:px-6 h-auto shadow-none bg-transparent"
                autoComplete="email"
                aria-label="Email address"
                required
              />
            </div>

            {/* Submit button */}
            <SubmitButton isFormValid={isFormValid} />
          </div>
        </form>
      )}

      {/* Status message or call to action */}
      <div className="text-center px-2 sm:px-0">
        {isSubmitted ? (
          <p className="text-xs sm:text-sm font-medium text-green-600">
            We&apos;ll send you early access when we&apos;re live!
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Join the waitlist to know when we&apos;re live!
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              Or skip the queue and claim your spot now 💙
            </p>

            <div className="flex items-center justify-center">
              <p>claim $99 lifetime access</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
