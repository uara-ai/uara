import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response("Missing signature", { status: 400 });
  }

  let event: any;
  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.client_reference_id as string | null;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string | null;
        if (userId) {
          // Ensure billing customer exists
          await prisma.billingCustomer.upsert({
            where: { userId },
            update: {
              stripeCustomerId: customerId,
              email: session.customer_details?.email ?? undefined,
            },
            create: {
              userId,
              stripeCustomerId: customerId,
              email: session.customer_details?.email ?? null,
            },
          });

          if (subscriptionId) {
            const subscription = (await stripe.subscriptions.retrieve(
              subscriptionId
            )) as any;
            await prisma.subscription.upsert({
              where: { userId },
              update: {
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscription.id,
                status: subscription.status,
                priceId: subscription.items.data[0]?.price?.id ?? null,
                cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
                currentPeriodStart: (subscription as any).current_period_start
                  ? new Date(subscription.current_period_start * 1000)
                  : null,
                currentPeriodEnd: (subscription as any).current_period_end
                  ? new Date(subscription.current_period_end * 1000)
                  : null,
              },
              create: {
                userId,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscription.id,
                status: subscription.status,
                priceId: subscription.items.data[0]?.price?.id ?? null,
                cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
                currentPeriodStart: (subscription as any).current_period_start
                  ? new Date(subscription.current_period_start * 1000)
                  : null,
                currentPeriodEnd: (subscription as any).current_period_end
                  ? new Date(subscription.current_period_end * 1000)
                  : null,
              },
            });
          }
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        const billing = await prisma.billingCustomer.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (billing) {
          await prisma.subscription.upsert({
            where: { userId: billing.userId },
            update: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              priceId: subscription.items?.data?.[0]?.price?.id ?? null,
              cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
              currentPeriodStart: subscription.current_period_start
                ? new Date(subscription.current_period_start * 1000)
                : null,
              currentPeriodEnd: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000)
                : null,
            },
            create: {
              userId: billing.userId,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              priceId: subscription.items?.data?.[0]?.price?.id ?? null,
              cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
              currentPeriodStart: subscription.current_period_start
                ? new Date(subscription.current_period_start * 1000)
                : null,
              currentPeriodEnd: subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000)
                : null,
            },
          });
        }
        break;
      }
      default:
        break;
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response("Server error", { status: 500 });
  }
}

// Cursor rules applied correctly.
