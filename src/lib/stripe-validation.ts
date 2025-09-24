/**
 * Stripe configuration validation utilities
 */

export function validateStripeEnvironment() {
  const required = [
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Stripe environment variables: ${missing.join(", ")}`
    );
  }

  // Validate key formats
  if (
    process.env.STRIPE_SECRET_KEY &&
    !process.env.STRIPE_SECRET_KEY.startsWith("sk_")
  ) {
    throw new Error('STRIPE_SECRET_KEY must start with "sk_"');
  }

  if (
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_")
  ) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with "pk_"');
  }

  if (
    process.env.STRIPE_WEBHOOK_SECRET &&
    !process.env.STRIPE_WEBHOOK_SECRET.startsWith("whsec_")
  ) {
    throw new Error('STRIPE_WEBHOOK_SECRET must start with "whsec_"');
  }
}

export function validatePriceId(priceId: string, tierId: string): boolean {
  if (!priceId) {
    console.error(`Missing price ID for tier ${tierId}`);
    return false;
  }

  if (!priceId.startsWith("price_")) {
    console.error(`Invalid price ID format for tier ${tierId}: ${priceId}`);
    return false;
  }

  if (priceId.includes("XXXXXX") || priceId === "price_") {
    console.error(
      `Placeholder price ID detected for tier ${tierId}: ${priceId}`
    );
    return false;
  }

  return true;
}

// Cursor rules applied correctly.
