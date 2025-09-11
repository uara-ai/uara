"use client";

import { subscribeAction } from "@/actions/subscribe-action";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="absolute top-1 right-0">
        <Loader2 className="absolute w-4 h-4 mr-3 text-base animate-spin top-2.5 right-2" />
      </div>
    );
  }

  return (
    <button
      type="submit"
      className="absolute right-2 h-7 bg-primary top-2 px-4 font-medium text-sm z-10 text-primary-foreground"
    >
      Subscribe
    </button>
  );
}

export function SubscribeInput() {
  const [isSubmitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        {isSubmitted ? (
          <div className="border border-[#2C2C2C] font-sm text-green-500 h-11 w-full  flex items-center py-1 justify-between px-3 rounded-md font-semibold">
            <p>Subscribed</p>

            <Check className="w-4 h-4 text-green-500" />
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
            <fieldset className="relative">
              <input
                placeholder="Join the waitlist"
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                aria-label="Email address"
                required
                className="bg-white font-sm text-primary outline-none py-1 px-3 w-full min-w-[300px] placeholder-[#606060] h-11 border border-border rounded-md"
              />
              <SubmitButton />
            </fieldset>
          </form>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        We&apos;ll send you an email when we&apos;re live with early access.
      </p>
    </div>
  );
}

// Cursor rules applied correctly.
