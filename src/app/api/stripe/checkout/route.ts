import { withAuth } from "@workos-inc/authkit-nextjs";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { STRIPE } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function absoluteUrl(origin: string | null, path: string): string {
  if (!origin) return path;
  if (path.startsWith("http")) return path;
  return new URL(path, origin).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await withAuth();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const origin = req.headers.get("origin");

    const body = await req.json().catch(() => ({}));
    const priceId: string = body.priceId || STRIPE.priceIdMonthly;
    if (!priceId) {
      return Response.json(
        {
          error:
            "Missing Stripe price ID. Set NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY.",
        },
        { status: 400 }
      );
    }

    // Ensure billing customer
    let billingCustomer = await prisma.billingCustomer.findUnique({
      where: { userId: user.id },
    });

    if (!billingCustomer) {
      const created = await stripe.customers.create({
        email: (user as any).email ?? undefined,
        metadata: { userId: user.id },
      });
      billingCustomer = await prisma.billingCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: created.id,
          email: (user as any).email ?? null,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: billingCustomer.stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      client_reference_id: user.id,
      success_url:
        absoluteUrl(req.headers.get("origin"), STRIPE.successUrl) +
        "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: absoluteUrl(origin, STRIPE.cancelUrl),
      subscription_data: {
        metadata: { userId: user.id },
      },
      metadata: { userId: user.id },
    });

    if (!session.url) {
      return Response.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Cursor rules applied correctly.
