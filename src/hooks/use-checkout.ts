"use client";

import { useState } from "react";

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (tierId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tierId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // If unauthorized, redirect to login
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Checkout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    checkout,
    isLoading,
    error,
  };
}

// Cursor rules applied correctly.
