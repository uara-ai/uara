import { artifact } from "@ai-sdk-tools/artifacts";
import { z } from "zod";

// Define the WHOOP recovery analysis artifact schema
export const WhoopRecoveryArtifact = artifact(
  "whoop-recovery",
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
          recoveryScore: z.number(),
          hrvRmssd: z.number(),
          restingHeartRate: z.number(),
          sleepPerformance: z.number().optional(),
          skinTemp: z.number().optional(),
          bloodOxygen: z.number().optional(),
        })
      )
      .default([]),

    // Summary insights
    summary: z
      .object({
        averageRecovery: z.number(),
        recoveryTrend: z.enum(["improving", "stable", "declining"]),
        avgHrv: z.number(),
        avgRhr: z.number(),
        consistencyScore: z.number(), // How consistent recovery is
        riskFactors: z.array(z.string()),
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
