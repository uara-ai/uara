import { artifact } from "@ai-sdk-tools/artifacts";
import { z } from "zod";

// Define the WHOOP strain analysis artifact schema
export const WhoopStrainArtifact = artifact(
  "whoop-strain",
  z.object({
    title: z.string(),
    stage: z
      .enum(["loading", "processing", "analyzing", "complete"])
      .default("loading"),
    progress: z.number().min(0).max(1).default(0),

    // Chart data
    chartData: z
      .array(
        z.object({
          date: z.string(),
          strain: z.number(),
          kilojoule: z.number().optional().nullable(),
          averageHeartRate: z.number().optional().nullable(),
          maxHeartRate: z.number().optional().nullable(),
          percentRecorded: z.number().optional().nullable(),
          scoreState: z.string(),
        })
      )
      .default([]),

    // Summary insights
    summary: z
      .object({
        averageStrain: z.number(),
        strainTrend: z.enum(["increasing", "stable", "decreasing"]),
        weeklyStrainTarget: z.number(),
        strainBalance: z.enum(["under", "optimal", "over"]),
        totalWorkouts: z.number(),
        averageWorkoutStrain: z.number(),
        recoveryStrainRatio: z.number(), // ratio of strain to recovery
        peakPerformanceDays: z.array(z.string()),
        fatigueRisk: z.enum(["low", "moderate", "high"]),
        recommendations: z.array(z.string()),
        insights: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            impact: z.enum(["positive", "negative", "neutral"]),
            confidence: z.number().min(0).max(1),
          })
        ),
      })
      .optional(),

    // Period metadata
    metadata: z
      .object({
        dateRange: z.object({
          start: z.string(),
          end: z.string(),
        }),
        totalDays: z.number(),
        validDataPoints: z.number(),
        userId: z.string().optional(),
      })
      .optional(),
  })
);

// Cursor rules applied correctly.
