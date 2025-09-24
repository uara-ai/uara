import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

// Cursor rules applied correctly.

export const tiers = [
  {
    id: "tier_1",
    name: "Tier 1",
    priceId:
      process.env.NODE_ENV === "production"
        ? "price_1S7b9gH7JERdDkEOHoyIrF3p"
        : "price_1S6CWaH7JERdDkEOj0vsRPcR",
    maxUsers: 0, // First 10 users get tier 1 pricing
    price: 4900, // $49 in cents
    displayPrice: "$49",
    mode: "payment" as const, // One-time payment for lifetime access
  },
  {
    id: "tier_2",
    name: "Tier 2",
    priceId: "price_1S7bA9H7JERdDkEO6v7dx0l8", // You'll need to create this in Stripe
    maxUsers: 0, // Next 15 users get tier 2 pricing
    price: 7900, // $79 in cents
    displayPrice: "$79",
    mode: "payment" as const, // One-time payment for lifetime access
  },
  {
    id: "tier_3",
    name: "Lifetime Deal",
    priceId: "price_1S7bAdH7JERdDkEOj8JRBGB1", // You'll need to create this in Stripe
    maxUsers: 50, // Next 25 users get tier 3 pricing
    price: 9900, // $99 in cents
    displayPrice: "$99",
    mode: "payment" as const, // One-time payment for lifetime access
  },
  {
    id: "tier_4",
    name: "Early Backer",
    priceId: "price_1S7bBDH7JERdDkEOnkQ9ePs2", // You'll need to create this in Stripe
    maxUsers: 25, // Next 25 users get tier 4 pricing
    price: 14900, // $149 in cents
    displayPrice: "$149",
    mode: "payment" as const, // One-time payment for lifetime access
  },
  {
    id: "tier_5",
    name: "Seed Supporter",
    priceId: "price_1S7bBbH7JERdDkEOogYTms3c", // You'll need to create this in Stripe
    maxUsers: 25, // Next 25 users get tier 5 pricing
    price: 19900, // $199 in cents
    displayPrice: "$199",
    mode: "payment" as const, // One-time payment for lifetime access
  },
  {
    id: "tier_6",
    name: "Tier 6",
    priceId: "price_1S5jGSH7JERdDkEOHnkAhICG", // You'll need to create this in Stripe
    maxUsers: Infinity, // Unlimited after tier 5
    price: 2000, // $20 in cents
    displayPrice: "$20",
    mode: "subscription" as const, // Subscription for monthly access
  },
  {
    id: "tier_7",
    name: "Tier 7",
    priceId: "price_", // You'll need to create this in Stripe
    maxUsers: Infinity, // Unlimited after tier 5
    price: 20000, // $200 in cents
    displayPrice: "$200",
    mode: "subscription" as const, // Subscription for monthly access
  },
];

// Test users to exclude from tier calculation (for development)
export const TEST_USER_COUNT = 3;
