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

    const billingCustomer = await prisma.billingCustomer.findUnique({
      where: { userId: user.id },
    });

    if (!billingCustomer) {
      return Response.json(
        { error: "No billing customer found. Start a checkout first." },
        { status: 404 }
      );
    }

    const origin = req.headers.get("origin");
    const portal = await stripe.billingPortal.sessions.create({
      customer: billingCustomer.stripeCustomerId,
      return_url: absoluteUrl(origin, STRIPE.successUrl),
    });

    return Response.json({ url: portal.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Cursor rules applied correctly.
