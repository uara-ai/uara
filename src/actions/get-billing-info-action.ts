"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";

export const getBillingInfoAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    const { user } = await withAuth();
    if (!user?.id) throw new Error("Not authenticated");

    const data = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        BillingCustomer: {
          select: {
            stripeCustomerId: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        Subscription: {
          select: {
            status: true,
            cancelAtPeriodEnd: true,
            currentPeriodEnd: true,
            currentPeriodStart: true,
            startDate: true,
            priceId: true,
            productId: true,
            currency: true,
            amount: true,
            interval: true,
            intervalCount: true,
            trialStart: true,
            trialEnd: true,
            cancelAt: true,
            canceledAt: true,
            endedAt: true,
            latestInvoiceId: true,
            collectionMethod: true,
            defaultPaymentMethodBrand: true,
            defaultPaymentMethodLast4: true,
            defaultPaymentMethodExpMonth: true,
            defaultPaymentMethodExpYear: true,
          },
        },
      },
    });

    if (!data) throw new Error("User not found");

    return data;
  });

// Cursor rules applied correctly.
