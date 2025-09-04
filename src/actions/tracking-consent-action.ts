"use server";

import { Cookies } from "@/packages/constants";
import { addYears } from "date-fns";
import { cookies } from "next/headers";
import { actionClient } from "./safe-action";
import { trackingConsentSchema } from "./schema";

export const trackingConsentAction = actionClient
  .schema(trackingConsentSchema)
  .action(async ({ parsedInput: value }: { parsedInput: boolean }) => {
    const cookieStore = await cookies();
    cookieStore.set({
      name: Cookies.TrackingConsent,
      value: value ? "1" : "0",
      expires: addYears(new Date(), 1),
    });

    return value;
  });
