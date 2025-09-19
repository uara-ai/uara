"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/actions/types/action-response";
import { appErrors } from "@/actions/types/errors";
import { createHash } from "crypto";

const schema = z.object({
  email: z.string().email(),
});

export const subscribeAction = createSafeActionClient()
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      // Add to Resend audience
      if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
        try {
          const resendResponse = await fetch(
            `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: input.parsedInput.email,
                first_name: "",
                last_name: "",
                unsubscribed: false,
              }),
              cache: "no-store",
            }
          );

          if (!resendResponse.ok) {
            console.error(
              "Failed to add contact to Resend audience:",
              await resendResponse.text()
            );
          }
        } catch (resendError) {
          console.error("Resend API error:", resendError);
        }
      }

      revalidatePath("/");

      return {
        success: true,
      };
    } catch (error) {
      console.error("Subscribe error:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  });

export async function getSubscriberCount(): Promise<ActionResponse> {
  try {
    // First try to get count from Resend
    if (process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      try {
        const response = await fetch(
          `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            data: {
              count: data.data.length,
            },
          };
        }
      } catch (resendError) {
        console.error("Resend count error:", resendError);
      }
    }

    return {
      success: true,
      data: {
        count: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching subscriber count:", error);
    return {
      success: false,
      error: appErrors.UNEXPECTED_ERROR,
    };
  }
}

interface SubscriberAvatar {
  imageUrl: string;
  email?: string;
}

export async function getSubscriberAvatars(
  limit: number = 10
): Promise<ActionResponse> {
  try {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
      // Return fallback avatars if no Resend config
      const fallbackAvatars: SubscriberAvatar[] = [
        { imageUrl: "https://avatars.githubusercontent.com/u/16860520" },
        { imageUrl: "https://avatars.githubusercontent.com/u/20110627" },
        { imageUrl: "https://avatars.githubusercontent.com/u/106103625" },
        { imageUrl: "https://avatars.githubusercontent.com/u/59228569" },
      ];

      return {
        success: true,
        data: {
          avatars: fallbackAvatars.slice(0, limit),
        },
      };
    }

    try {
      const response = await fetch(
        `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const contacts = data.data || [];

        // Generate avatar URLs from email addresses using Gravatar
        const avatars: SubscriberAvatar[] = contacts
          .slice(0, limit)
          .map((contact: any) => {
            const email = contact.email || "";
            // Create MD5 hash for Gravatar
            const emailHash = createHash("md5")
              .update(email.toLowerCase().trim())
              .digest("hex");
            return {
              imageUrl: `https://www.gravatar.com/avatar/${emailHash}?d=identicon&s=200`,
              email: email,
            };
          });

        // If we don't have enough subscribers, fill with fallback avatars
        const fallbackAvatars: SubscriberAvatar[] = [
          { imageUrl: "https://avatars.githubusercontent.com/u/16860520" },
          { imageUrl: "https://avatars.githubusercontent.com/u/20110627" },
          { imageUrl: "https://avatars.githubusercontent.com/u/106103625" },
          { imageUrl: "https://avatars.githubusercontent.com/u/59228569" },
        ];

        while (avatars.length < limit && avatars.length < 4) {
          const fallbackIndex = avatars.length % fallbackAvatars.length;
          avatars.push(fallbackAvatars[fallbackIndex]);
        }

        return {
          success: true,
          data: {
            avatars: avatars.slice(0, limit),
          },
        };
      }
    } catch (resendError) {
      console.error("Resend avatars error:", resendError);
    }

    // Fallback to default avatars
    const fallbackAvatars: SubscriberAvatar[] = [
      { imageUrl: "https://avatars.githubusercontent.com/u/16860520" },
      { imageUrl: "https://avatars.githubusercontent.com/u/20110627" },
      { imageUrl: "https://avatars.githubusercontent.com/u/106103625" },
      { imageUrl: "https://avatars.githubusercontent.com/u/59228569" },
    ];

    return {
      success: true,
      data: {
        avatars: fallbackAvatars.slice(0, limit),
      },
    };
  } catch (error) {
    console.error("Error fetching subscriber avatars:", error);
    return {
      success: false,
      error: appErrors.UNEXPECTED_ERROR,
    };
  }
}
