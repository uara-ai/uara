import { artifact } from "@ai-sdk-tools/artifacts";
import { z } from "zod";

// Define the WHOOP workout analysis artifact schema
export const WhoopWorkoutArtifact = artifact(
  "whoop-workout",
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
          workoutId: z.string(),
          sportId: z.number().nullable(),
          strain: z.number(),
          duration: z.number(), // milliseconds
          kilojoule: z.number().nullable(),
          averageHeartRate: z.number().nullable(),
          maxHeartRate: z.number().nullable(),
          percentRecorded: z.number().nullable(),
          distanceMeters: z.number().nullable(),
          altitudeGainMeters: z.number().nullable(),
          scoreState: z.string(),
        })
      )
      .default([]),

    // Summary insights
    summary: z
      .object({
        totalWorkouts: z.number(),
        averageWorkoutStrain: z.number(),
        averageWorkoutDuration: z.number(), // in minutes
        mostFrequentSport: z.string().optional(),
        workoutFrequency: z.number(), // workouts per week
        intensityDistribution: z.object({
          low: z.number(), // percentage of low intensity workouts
          moderate: z.number(),
          high: z.number(),
        }),
        performanceTrend: z.enum(["improving", "stable", "declining"]),
        recoveryAdequacy: z.enum(["adequate", "insufficient", "excessive"]),
        optimalWorkoutTiming: z.array(z.string()), // best times for workouts
        sportSpecificInsights: z.array(
          z.object({
            sport: z.string(),
            averageStrain: z.number(),
            frequency: z.number(),
            averageDistance: z.number().optional(),
            recommendations: z.array(z.string()),
          })
        ),
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
        totalWorkouts: z.number(),
        validDataPoints: z.number(),
        userId: z.string().optional(),
      })
      .optional(),
  })
);

// Cursor rules applied correctly.
