import { z } from "zod";

export const userProfileSchema = z.object({
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

export type UserProfileData = z.infer<typeof userProfileSchema>;

// Cursor rules applied correctly.
