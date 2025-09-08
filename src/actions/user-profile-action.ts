"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/prisma";
import { actionClient } from "./safe-action";
import { z } from "zod";
import type { ActionResponse } from "@/actions/types/action-response";
import { appErrors } from "@/actions/types/errors";
import { userProfileSchema } from "./schema/user-profile";

export type UserProfileData = z.infer<typeof userProfileSchema>;
// Action to update user profile
export const updateUserProfileAction = actionClient
  .schema(userProfileSchema)
  .action(
    async ({
      parsedInput,
    }): Promise<ActionResponse<{ profileCompleted: boolean }>> => {
      try {
        // Get user from WorkOS
        const { user } = await withAuth();

        if (!user?.id) {
          return {
            success: false,
            error: appErrors.UNAUTHORIZED,
          };
        }

        // Convert medical arrays to JSON strings for storage
        const medicalConditionsJson = parsedInput.medicalConditions
          ? JSON.stringify(parsedInput.medicalConditions)
          : null;
        const allergiesJson = parsedInput.allergies
          ? JSON.stringify(parsedInput.allergies)
          : null;
        const medicationsJson = parsedInput.medications
          ? JSON.stringify(parsedInput.medications)
          : null;

        // Update user profile in database
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            dateOfBirth: new Date(parsedInput.dateOfBirth),
            gender: parsedInput.gender,
            ethnicity: parsedInput.ethnicity,
            heightCm: parsedInput.heightCm,
            weightKg: parsedInput.weightKg,
            bloodType: parsedInput.bloodType,
            medicalConditions: medicalConditionsJson,
            allergies: allergiesJson,
            medications: medicationsJson,
            emergencyContactName: parsedInput.emergencyContactName,
            emergencyContactPhone: parsedInput.emergencyContactPhone,
            dataProcessingConsent: parsedInput.dataProcessingConsent,
            marketingConsent: parsedInput.marketingConsent,
            researchConsent: parsedInput.researchConsent,
            profileCompleted: true,
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          data: {
            profileCompleted: updatedUser.profileCompleted,
          },
        };
      } catch (error) {
        console.error("Update user profile error:", error);
        return {
          success: false,
          error: appErrors.DATABASE_ERROR,
        };
      }
    }
  );

// Action to initialize user in database from WorkOS data
export async function initializeUserAction(workosUser: {
  id: string;
}): Promise<ActionResponse<{ user: any; isNewUser: boolean }>> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: workosUser.id },
    });

    if (existingUser) {
      return {
        success: true,
        data: {
          user: existingUser,
          isNewUser: false,
        },
      };
    }

    // Create new user with WorkOS data
    const newUser = await prisma.user.create({
      data: {
        id: workosUser.id,
        profileCompleted: false,
        dataProcessingConsent: false,
        marketingConsent: false,
        researchConsent: false,
      },
    });

    return {
      success: true,
      data: {
        user: newUser,
        isNewUser: true,
      },
    };
  } catch (error) {
    console.error("Initialize user error:", error);
    return {
      success: false,
      error: appErrors.DATABASE_ERROR,
    };
  }
}

// Action to get user profile completion status
export async function getUserProfileStatusAction(): Promise<
  ActionResponse<{
    profileCompleted: boolean;
    user: any;
  }>
> {
  try {
    const { user } = await withAuth();

    if (!user?.id) {
      return {
        success: false,
        error: appErrors.UNAUTHORIZED,
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        profileCompleted: true,
        dataProcessingConsent: true,
        createdAt: true,
      },
    });

    if (!dbUser) {
      return {
        success: false,
        error: appErrors.NOT_FOUND,
      };
    }

    return {
      success: true,
      data: {
        profileCompleted: dbUser.profileCompleted,
        user: dbUser,
      },
    };
  } catch (error) {
    console.error("Get user profile status error:", error);
    return {
      success: false,
      error: appErrors.DATABASE_ERROR,
    };
  }
}
