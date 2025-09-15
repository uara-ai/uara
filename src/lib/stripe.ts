import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

// Cursor rules applied correctly.

export const tiers = [
  {
    id: "tier_1",
    name: "Tier 1",
    priceId: "price_1S6CWaH7JERdDkEOj0vsRPcR",
    maxUsers: 10, // First 100 users get tier 1 pricing
    price: 4900, // $49 in cents
    displayPrice: "$49",
  },
  {
    id: "tier_2",
    name: "Tier 2",
    priceId: "price_1S6CWbH7JERdDkEOj0vsRPcS", // You'll need to create this in Stripe
    maxUsers: 500, // Next 400 users get tier 2 pricing
    price: 7900, // $79 in cents
    displayPrice: "$79",
  },
  {
    id: "tier_3",
    name: "Tier 3",
    priceId: "price_1S6CWcH7JERdDkEOj0vsRPcT", // You'll need to create this in Stripe
    maxUsers: Infinity, // Unlimited after tier 2
    price: 9900, // $99 in cents
    displayPrice: "$99",
  },
];

// Test users to exclude from tier calculation (for development)
export const TEST_USER_COUNT = 0;
