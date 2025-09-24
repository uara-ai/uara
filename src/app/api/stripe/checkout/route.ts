import { withAuth } from "@workos-inc/authkit-nextjs";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { STRIPE } from "@/lib/constants";
import { calculateCurrentTier, getTierById } from "@/lib/tier-calculator";
import { validatePriceId } from "@/lib/stripe-validation";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function absoluteUrl(origin: string | null, path: string): string {
  // In production, use the environment variable or default to the current origin
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

  if (!baseUrl) {
    console.warn(
      "No origin or NEXT_PUBLIC_APP_URL provided, using relative path"
    );
    return path;
  }

  if (path.startsWith("http")) return path;

  try {
    return new URL(path, baseUrl).toString();
  } catch (error) {
    console.error("Failed to construct absolute URL:", error);
    return path;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Log the request for debugging
    console.log("Stripe checkout request started");

    const { user } = await withAuth();
    if (!user) {
      console.log("No user found in auth");
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("User authenticated:", user.id);

    const origin = req.headers.get("origin");

    const body = await req.json().catch(() => ({}));

    // Calculate current tier pricing
    console.log("Calculating tier info...");
    const tierInfo = await calculateCurrentTier();
    const requestedTierId = body.tierId || tierInfo.currentTier.id;
    console.log("Requested tier ID:", requestedTierId);

    const selectedTier = getTierById(requestedTierId);

    if (!selectedTier) {
      console.error("Invalid tier selected:", requestedTierId);
      return Response.json({ error: "Invalid tier selected" }, { status: 400 });
    }

    console.log("Selected tier:", selectedTier.name, selectedTier.priceId);

    // Check if user already has a tier
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { tier: true },
    });

    if (existingUser?.tier) {
      return Response.json(
        { error: "User already has a lifetime subscription" },
        { status: 400 }
      );
    }

    const priceId = selectedTier.priceId;

    // Validate price ID
    console.log("Validating price ID:", priceId);
    if (!validatePriceId(priceId, selectedTier.id)) {
      console.error(
        "Price ID validation failed for tier:",
        selectedTier.id,
        priceId
      );
      return Response.json(
        {
          error: "Invalid pricing configuration. Please contact support.",
        },
        { status: 500 }
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

    // Create session based on tier mode (payment for lifetime, subscription for recurring)
    const sessionConfig: any = {
      mode: selectedTier.mode,
      customer: billingCustomer.stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      client_reference_id: user.id,
      success_url:
        absoluteUrl(req.headers.get("origin"), STRIPE.successUrl) +
        "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: absoluteUrl(origin, STRIPE.cancelUrl),
      metadata: {
        userId: user.id,
        tierId: selectedTier.id,
      },
    };

    // Add subscription-specific config only for subscription mode
    if (selectedTier.mode === "subscription") {
      const cookieStore = await cookies();
      sessionConfig.subscription_data = {
        metadata: {
          userId: user.id,
          tierId: selectedTier.id,
          datafast_visitor_id:
            cookieStore.get("datafast_visitor_id")?.value || null,
          datafast_session_id:
            cookieStore.get("datafast_session_id")?.value || null,
        },
      };
    }

    console.log(
      "Creating Stripe checkout session with config:",
      JSON.stringify(sessionConfig, null, 2)
    );

    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log("Stripe session created successfully:", session.id);

    if (!session.url) {
      console.error("No checkout URL returned from Stripe");
      return Response.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    console.log("Returning session URL:", session.url);
    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    // Handle specific Stripe errors
    if (error && typeof error === "object" && "code" in error) {
      const stripeError = error as any;
      console.error("Stripe error details:", {
        code: stripeError.code,
        message: stripeError.message,
        type: stripeError.type,
        param: stripeError.param,
      });

      return Response.json(
        {
          error: `Stripe error: ${stripeError.message}`,
          code: stripeError.code,
        },
        { status: 400 }
      );
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Cursor rules applied correctly.
