"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { unstable_cache } from "next/cache";

// Get user profile with caching
const getCachedUserProfile = unstable_cache(
  async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        dateOfBirth: true,
        gender: true,
        ethnicity: true,
        heightCm: true,
        weightKg: true,
        bloodType: true,
        profileCompleted: true,
      },
    });

    if (!user) return null;

    // Calculate age
    const age = user.dateOfBirth
      ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
      : null;

    return {
      age,
      gender: user.gender,
      ethnicity: user.ethnicity,
      heightCm: user.heightCm,
      weightKg: user.weightKg,
      bloodType: user.bloodType,
      profileCompleted: user.profileCompleted,
    };
  },
  ["user-profile"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["user-profile"],
  }
);

export const getUserProfileAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    const { user } = await withAuth();
    if (!user?.id) throw new Error("Not authenticated");

    return await getCachedUserProfile(user.id);
  });

// Cursor rules applied correctly.
