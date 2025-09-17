import { artifact } from "@ai-sdk-tools/artifacts";
import { z } from "zod";

// Define the WHOOP sleep analysis artifact schema
export const WhoopSleepArtifact = artifact(
  "whoop-sleep",
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
          sleepPerformance: z.number(),
          sleepEfficiency: z.number(),
          timeInBed: z.number(), // milliseconds
          sleepDuration: z.number(), // milliseconds
          remSleep: z.number().optional(), // milliseconds
          deepSleep: z.number().optional(), // milliseconds
          lightSleep: z.number().optional(), // milliseconds
          awakeDuration: z.number().optional(), // milliseconds
          sleepOnset: z.number().optional(), // time to fall asleep in minutes
          disturbances: z.number().optional(),
        })
      )
      .default([]),

    // Summary insights
    summary: z
      .object({
        averageSleepPerformance: z.number(),
        averageSleepEfficiency: z.number(),
        averageSleepDuration: z.number(), // in hours
        sleepTrend: z.enum(["improving", "stable", "declining"]),
        sleepDebt: z.number(), // accumulated sleep debt in hours
        optimalSleepTime: z.number(), // recommended sleep duration
        consistencyScore: z.number(), // sleep timing consistency
        sleepQualityFactors: z.array(
          z.object({
            factor: z.string(),
            impact: z.enum(["positive", "negative", "neutral"]),
            description: z.string(),
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
        totalNights: z.number(),
        validDataPoints: z.number(),
        userId: z.string().optional(),
      })
      .optional(),
  })
);

// Cursor rules applied correctly.
