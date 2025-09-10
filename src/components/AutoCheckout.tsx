"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { toast } from "sonner";

export function AutoCheckout() {
  const params = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    const shouldStart = params.get("startCheckout") === "1";
    if (!shouldStart || !user) return;

    const start = async () => {
      try {
        toast.loading("Redirecting to checkout...");
        const res = await fetch("/api/stripe/checkout", { method: "POST" });
        const data = await res.json();
        toast.dismiss();
        if (!res.ok) {
          toast.error(data.error || "Unable to start checkout");
          return;
        }
        window.location.href = data.url;
      } catch (e) {
        toast.dismiss();
        toast.error("Unable to start checkout");
      }
    };

    start();
  }, [params, user]);

  return null;
}

// Cursor rules applied correctly.
