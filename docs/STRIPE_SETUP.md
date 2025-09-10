## Stripe Billing Setup Guide

This guide walks you through configuring Stripe subscriptions with prefilled email, login redirect, customer portal, and webhooks.

### Prerequisites

- Stripe account
- Next.js app running at http://localhost:3000
- PostgreSQL database configured via Prisma

### 1) Environment Variables

Create or update `.env` with:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_live_or_test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test

# Product/Price
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY=price_xxx

# Redirects
NEXT_PUBLIC_STRIPE_SUCCESS_URL=http://localhost:3000/account?billing
NEXT_PUBLIC_STRIPE_CANCEL_URL=http://localhost:3000/pricing

# Webhook secret (from Stripe CLI or Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### 2) Install Dependencies

```bash
bun add stripe @stripe/stripe-js
```

### 3) Database Schema

We added two models: `BillingCustomer` and `Subscription` in `prisma/schema.prisma` to store Stripe IDs and subscription status.

Run client generation and push:

```bash
bunx prisma generate
bun run db:push
```

### 4) API Endpoints

- `POST /api/stripe/checkout`: Creates a Stripe Checkout session for subscription; requires auth; pre-fills email from WorkOS user
- `POST /api/stripe/portal`: Opens the Stripe Customer Portal; requires auth
- `POST /api/stripe/webhook`: Webhook endpoint to sync subscription state

Webhooks handled:

- `checkout.session.completed`
- `customer.subscription.created|updated|deleted`

### 5) Authentication Flow

- Unauthenticated user clicking the pricing CTA is sent to `/login?redirect=/pricing`
- After WorkOS login, the callback forwards to `/post-login-redirect` which reads the `post-login-redirect` cookie and returns users to the desired page.
- On `/pricing`, clicking CTA when authenticated calls `/api/stripe/checkout` and redirects to Stripe Checkout.

### 6) Testing

- Start dev server: `bun dev`
- Open `http://localhost:3000/pricing`
- If not authenticated, click CTA → login → returned to pricing
- Click CTA again → should redirect to Stripe Checkout with email prefilled

#### Simulate Webhooks (Stripe CLI)

```bash
# in one terminal, start the app
bun dev

# in another terminal
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

You will get a `whsec_xxx` secret to place in `STRIPE_WEBHOOK_SECRET`.

Then trigger checkout completed and subscription events:

```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

### 7) Customer Portal

- Go to `Account` → Billing tab → Manage Billing → redirects to Stripe Portal.

### 8) Production Notes

- Use live keys and set real domain URLs
- Configure webhook in Stripe Dashboard pointing to `/api/stripe/webhook`
- Secure secrets via your hosting provider
- Consider using Stripe Tax, invoices, receipts as needed

### 9) Data Model

- `billing_customers`: maps `userId` → `stripeCustomerId`
- `subscriptions`: stores `status`, `priceId`, period start/end, cancel at period end

### 10) Troubleshooting

- 401 on checkout/portal → ensure user is logged in
- 400 on webhook → verify `STRIPE_WEBHOOK_SECRET`
- Checkout not redirecting → check network console for `/api/stripe/checkout` errors

Cursor rules applied correctly.
