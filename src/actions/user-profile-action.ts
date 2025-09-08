"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { revalidateTag } from "next/cache";

// Simple schema
const createUserSchema = z.object({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum([
    "MALE",
    "FEMALE",
    "NON_BINARY",
    "PREFER_NOT_TO_SAY",
    "OTHER",
  ]),
  ethnicity: z.enum([
    "AMERICAN_INDIAN_ALASKA_NATIVE",
    "ASIAN",
    "BLACK_AFRICAN_AMERICAN",
    "HISPANIC_LATINO",
    "NATIVE_HAWAIIAN_PACIFIC_ISLANDER",
    "WHITE",
    "MULTIRACIAL",
    "PREFER_NOT_TO_SAY",
    "OTHER",
  ]),
  heightCm: z.number().optional(),
  weightKg: z.number().optional(),
  bloodType: z
    .enum([
      "A_POSITIVE",
      "A_NEGATIVE",
      "B_POSITIVE",
      "B_NEGATIVE",
      "AB_POSITIVE",
      "AB_NEGATIVE",
      "O_POSITIVE",
      "O_NEGATIVE",
      "UNKNOWN",
    ])
    .optional(),
  dataProcessingConsent: z
    .boolean()
    .refine((val) => val === true, "Consent is required"),
  marketingConsent: z.boolean(),
  researchConsent: z.boolean(),
});

// Check if user exists
export const checkUserExistsAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    const { user } = await withAuth();
    if (!user?.id) throw new Error("Not authenticated");

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, profileCompleted: true },
    });

    return {
      exists: !!dbUser,
      profileCompleted: dbUser?.profileCompleted || false,
    };
  });

// Create user
export const createUserAction = actionClient
  .schema(createUserSchema)
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) throw new Error("Not authenticated");

    console.log("Creating user with data:", parsedInput);

    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        profileCompleted: true,
        dateOfBirth: new Date(parsedInput.dateOfBirth),
        gender: parsedInput.gender,
        ethnicity: parsedInput.ethnicity,
        heightCm: parsedInput.heightCm || null,
        weightKg: parsedInput.weightKg || null,
        bloodType: parsedInput.bloodType || null,
        dataProcessingConsent: parsedInput.dataProcessingConsent,
        marketingConsent: parsedInput.marketingConsent,
        researchConsent: parsedInput.researchConsent,
      },
    });

    console.log("User created successfully:", newUser.id);

    // Invalidate user profile cache
    revalidateTag("user-profile");

    return { success: true, userId: newUser.id };
  });

// Cursor rules applied correctly.
