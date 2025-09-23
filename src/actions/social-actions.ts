"use server";

import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const socialSchema = z.object({
  platform: z.enum(["twitter", "x"]),
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username too long"),
});

export async function getSocialUsername(platform: "twitter" | "x") {
  try {
    const session = await withAuth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const social = await prisma.socials.findFirst({
      where: {
        userId: session.user.id,
        platform: platform,
      },
    });

    return { username: social?.username || null };
  } catch (error) {
    console.error("Error fetching social username:", error);
    return { error: "Failed to fetch username" };
  }
}

export async function saveSocialUsername(
  platform: "twitter" | "x",
  username: string
) {
  try {
    const session = await withAuth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Validate input
    const validation = socialSchema.safeParse({ platform, username });
    if (!validation.success) {
      return { error: validation.error.message };
    }

    // Clean username (remove @ if present)
    const cleanUsername = username.replace(/^@/, "");

    // Check if social entry exists
    const existingSocial = await prisma.socials.findFirst({
      where: {
        userId: session.user.id,
        platform: platform,
      },
    });

    if (existingSocial) {
      // Update existing entry
      await prisma.socials.update({
        where: {
          id: existingSocial.id,
        },
        data: {
          username: cleanUsername,
        },
      });
    } else {
      // Create new entry
      await prisma.socials.create({
        data: {
          userId: session.user.id,
          platform: platform,
          username: cleanUsername,
        },
      });
    }

    revalidatePath("/healthspan");
    return { success: true };
  } catch (error) {
    console.error("Error saving social username:", error);
    return { error: "Failed to save username" };
  }
}

export async function deleteSocialUsername(platform: "twitter" | "x") {
  try {
    const session = await withAuth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    await prisma.socials.deleteMany({
      where: {
        userId: session.user.id,
        platform: platform,
      },
    });

    revalidatePath("/healthspan");
    return { success: true };
  } catch (error) {
    console.error("Error deleting social username:", error);
    return { error: "Failed to delete username" };
  }
}

// Cursor rules applied correctly.
