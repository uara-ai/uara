import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getTierById } from "@/lib/tier-calculator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toDate(seconds?: number | null) {
  return seconds ? new Date(seconds * 1000) : null;
}

async function upsertSubscriptionFromStripeObject(
  subscription: any,
  userId: string,
  customerId: string
) {
  const item = subscription.items?.data?.[0];
  const price = item?.price;
  const plan = price?.recurring;
  const defaultPaymentMethod = subscription.default_payment_method as any;
  let pm: any = null;
  if (defaultPaymentMethod && typeof defaultPaymentMethod === "string") {
    try {
      pm = await stripe.paymentMethods.retrieve(defaultPaymentMethod);
    } catch {
      pm = null;
    }
  } else if (defaultPaymentMethod && typeof defaultPaymentMethod === "object") {
    pm = defaultPaymentMethod;
  }

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId: price?.id ?? null,
      productId: price?.product ?? null,
      currency: price?.currency ?? null,
      amount: price?.unit_amount ?? null,
      interval: plan?.interval ?? null,
      intervalCount: plan?.interval_count ?? null,
      cancelAtPeriodEnd: !!subscription.cancel_at_period_end,
      currentPeriodStart: toDate(subscription.current_period_start),
      currentPeriodEnd: toDate(subscription.current_period_end),
      startDate: toDate(subscription.start_date),
      trialStart: toDate(subscription.trial_start),
      trialEnd: toDate(subscription.trial_end),
      cancelAt: toDate(subscription.cancel_at),
      canceledAt: toDate(subscription.canceled_at),
      endedAt: toDate(subscription.ended_at),
      latestInvoiceId: subscription.latest_invoice ?? null,
      collectionMethod: subscription.collection_method ?? null,
      defaultPaymentMethodId: pm?.id ?? null,
      defaultPaymentMethodBrand: pm?.card?.brand ?? null,
      defaultPaymentMethodLast4: pm?.card?.last4 ?? null,
      defaultPaymentMethodExpMonth: pm?.card?.exp_month ?? null,
      defaultPaymentMethodExpYear: pm?.card?.exp_year ?? null,
      tier: subscription.metadata?.tierId ?? null,
      tierPurchasedAt: subscription.metadata?.tierId ? new Date() : null,
    },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId: price?.id ?? null,
      productId: price?.product ?? null,
      currency: price?.currency ?? null,
      amount: price?.unit_amount ?? null,
      interval: plan?.interval ?? null,
      intervalCount: plan?.interval_count ?? null,
      cancelAtPeriodEnd: !!subscription.cancel_at_period_end,
      currentPeriodStart: toDate(subscription.current_period_start),
      currentPeriodEnd: toDate(subscription.current_period_end),
      startDate: toDate(subscription.start_date),
      trialStart: toDate(subscription.trial_start),
      trialEnd: toDate(subscription.trial_end),
      cancelAt: toDate(subscription.cancel_at),
      canceledAt: toDate(subscription.canceled_at),
      endedAt: toDate(subscription.ended_at),
      latestInvoiceId: subscription.latest_invoice ?? null,
      collectionMethod: subscription.collection_method ?? null,
      defaultPaymentMethodId: pm?.id ?? null,
      defaultPaymentMethodBrand: pm?.card?.brand ?? null,
      defaultPaymentMethodLast4: pm?.card?.last4 ?? null,
      defaultPaymentMethodExpMonth: pm?.card?.exp_month ?? null,
      defaultPaymentMethodExpYear: pm?.card?.exp_year ?? null,
      tier: subscription.metadata?.tierId ?? null,
      tierPurchasedAt: subscription.metadata?.tierId ? new Date() : null,
    },
  });
}

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
        const tierId = session.metadata?.tierId;

        if (userId) {
          // Update billing customer with latest information
          await prisma.billingCustomer.upsert({
            where: { userId },
            update: {
              stripeCustomerId: customerId,
              email: session.customer_details?.email ?? undefined,
              updatedAt: new Date(),
            },
            create: {
              userId,
              stripeCustomerId: customerId,
              email: session.customer_details?.email ?? null,
            },
          });

          if (subscriptionId) {
            // Handle subscription-based payments
            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );
            await upsertSubscriptionFromStripeObject(
              subscription,
              userId,
              customerId
            );

            // Update user tier information for subscription
            const subscriptionTierId = subscription.metadata?.tierId;
            if (subscriptionTierId) {
              await prisma.user.update({
                where: { id: userId },
                data: {
                  tier: subscriptionTierId,
                  tierPurchasedAt: new Date(),
                },
              });
            }
          } else if (session.mode === "payment" && tierId) {
            // Handle one-time payments (lifetime access)
            await prisma.user.update({
              where: { id: userId },
              data: {
                tier: tierId,
                tierPurchasedAt: new Date(),
              },
            });

            // Get the line item details for price information
            const lineItems = await stripe.checkout.sessions.listLineItems(
              session.id
            );
            const lineItem = lineItems.data[0];
            const priceId = lineItem?.price?.id;
            const amount = lineItem?.amount_total || session.amount_total;
            const currency = lineItem?.currency || session.currency;

            // Create a comprehensive subscription record for tracking purposes
            await prisma.subscription.upsert({
              where: { userId },
              update: {
                status: "active",
                priceId: priceId || null,
                currency: currency || null,
                amount: amount || null,
                tier: tierId,
                tierPurchasedAt: new Date(),
                latestInvoiceId: (session.invoice as string) || null,
              },
              create: {
                userId,
                stripeCustomerId: customerId,
                status: "active",
                priceId: priceId || null,
                currency: currency || null,
                amount: amount || null,
                tier: tierId,
                tierPurchasedAt: new Date(),
                latestInvoiceId: (session.invoice as string) || null,
                startDate: new Date(),
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
          await upsertSubscriptionFromStripeObject(
            subscription,
            billing.userId,
            customerId
          );
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
