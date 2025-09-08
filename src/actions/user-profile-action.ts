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
    }): Promise<
      ActionResponse<{ profileCompleted: boolean; isNewUser: boolean }>
    > => {
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

        console.log("Updating user profile in database...", {
          userId: user.id,
        });

        // Prepare user data
        const userData = {
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
        };

        // Use upsert to handle both create and update scenarios
        let isNewUser = false;
        try {
          // Check if user exists first
          const existingUser = await prisma.user.findUnique({
            where: { id: user.id },
          });

          let updatedUser;
          if (existingUser) {
            // Update existing user
            updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: {
                ...userData,
                updatedAt: new Date(),
              },
            });
            console.log("Existing user profile updated:", updatedUser.id);
          } else {
            // Create new user
            updatedUser = await prisma.user.create({
              data: {
                id: user.id,
                ...userData,
              },
            });
            isNewUser = true;
            console.log("New user created successfully:", updatedUser.id);
          }

          return {
            success: true,
            data: {
              profileCompleted: updatedUser.profileCompleted,
              isNewUser,
            },
          };
        } catch (dbError: any) {
          console.error("Database operation failed:", dbError);
          throw dbError;
        }
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

// Helper function to check if user has all required information
function hasRequiredProfileInfo(user: any): boolean {
  // Required fields: dateOfBirth, gender, ethnicity, dataProcessingConsent
  return !!(
    user.dateOfBirth &&
    user.gender &&
    user.ethnicity &&
    user.dataProcessingConsent
  );
}

// Action to get user profile completion status
export async function getUserProfileStatusAction(): Promise<
  ActionResponse<{
    profileCompleted: boolean;
    hasRequiredInfo: boolean;
    userExists: boolean;
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
        dateOfBirth: true,
        gender: true,
        ethnicity: true,
        createdAt: true,
      },
    });

    if (!dbUser) {
      // User doesn't exist in database
      return {
        success: true,
        data: {
          profileCompleted: false,
          hasRequiredInfo: false,
          userExists: false,
          user: null,
        },
      };
    }

    const hasRequiredInfo = hasRequiredProfileInfo(dbUser);

    return {
      success: true,
      data: {
        profileCompleted: dbUser.profileCompleted && hasRequiredInfo,
        hasRequiredInfo,
        userExists: true,
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

// Cursor rules applied correctly.
