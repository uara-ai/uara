// limits for free users
export const MESSAGE_LIMITS = {
  FREE_DAILY_LIMIT: 5,
  PRO_DAILY_LIMIT: 50,
} as const;

export const PRICING = {
  PRO_MONTHLY: 15, // USD
} as const;

export const CURRENCIES = {
  USD: "USD",
} as const;

export const STRIPE = {
  priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY ?? "",
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  successUrl: process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL ?? "/account?billing",
  cancelUrl: process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL ?? "/pricing",
};

export const CookieKeys = {
  PostLoginRedirect: "post-login-redirect",
};

// Cursor rules applied correctly.
