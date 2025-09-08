// Schema for user profile data
import { z } from "zod";

export const userProfileSchema = z.object({
  dateOfBirth: z.string().refine((date) => {
    const parsedDate = new Date(date);
    const now = new Date();
    const age = now.getFullYear() - parsedDate.getFullYear();
    return age >= 13 && age <= 120; // Reasonable age range
  }, "Please enter a valid date of birth"),
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
  heightCm: z
    .number()
    .min(50, "Height must be at least 50cm")
    .max(300, "Height must be less than 300cm")
    .optional(),
  weightKg: z
    .number()
    .min(20, "Weight must be at least 20kg")
    .max(500, "Weight must be less than 500kg")
    .optional(),
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
  medicalConditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: z.string().max(20).optional(),
  dataProcessingConsent: z.boolean(),
  marketingConsent: z.boolean(),
  researchConsent: z.boolean(),
});
