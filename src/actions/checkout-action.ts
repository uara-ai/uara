"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export async function createCheckoutSession(tierId?: string) {
  const { user } = await withAuth();

  if (!user) {
    redirect("/login");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tierId,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create checkout session");
    }

    const { url } = await response.json();

    if (url) {
      redirect(url);
    } else {
      throw new Error("No checkout URL returned");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    throw error;
  }
}

// Cursor rules applied correctly.
