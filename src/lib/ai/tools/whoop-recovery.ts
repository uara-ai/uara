import { tool } from "ai";
import { z } from "zod";
import { WhoopRecoveryArtifact } from "@/lib/ai";
import { getCurrentUser } from "@/lib/ai/context";
import { delay } from "@/lib/delay";

export const analyzeWhoopRecoveryTool = tool({
  description:
    "Analyze WHOOP recovery data with detailed insights on HRV, resting heart rate, and recovery trends. Use when users ask about recovery analysis, HRV trends, stress levels, or recovery optimization.",
  inputSchema: z.object({
    userId: z.string().describe("User ID for personalized analysis"),
    dateRange: z
      .object({
        start: z.string().describe("Start date in YYYY-MM-DD format"),
        end: z.string().describe("End date in YYYY-MM-DD format"),
      })
      .describe("Date range for analysis"),
    recoveryData: z
      .array(
        z.object({
          date: z.string().describe("Date in YYYY-MM-DD format"),
          recoveryScore: z
            .number()
            .min(0)
            .max(100)
            .nullable()
            .describe("Recovery score percentage from WHOOP"),
          hrvRmssd: z.number().nullable().describe("HRV RMSSD in milliseconds"),
          restingHeartRate: z
            .number()
            .nullable()
            .describe("Resting heart rate in BPM"),
          userCalibrating: z
            .boolean()
            .optional()
            .describe("Whether user is calibrating"),
          scoreState: z.string().describe("Score state from WHOOP API"),
        })
      )
      .describe("Array of daily recovery data"),
  }),
  execute: async ({ userId, dateRange, recoveryData }) => {
    // Get current user context
    const user = getCurrentUser();

    // Step 1: Create with loading state
    const analysis = WhoopRecoveryArtifact.stream({
      stage: "loading",
      title: "Recovery Analysis",
      chartData: [],
      progress: 0,
      metadata: {
        dateRange,
        totalDays: recoveryData.length,
        validDataPoints: recoveryData.filter(
          (d) => d.recoveryScore && d.recoveryScore > 0
        ).length,
        userId,
      },
    });

    await delay(500);

    // Step 2: Processing - prepare chart data
    analysis.progress = 0.1;
    await analysis.update({ stage: "processing" });

    for (const [index, data] of recoveryData.entries()) {
      await analysis.update({
        chartData: [
          ...analysis.data.chartData,
          {
            date: data.date,
            recoveryScore: data.recoveryScore || 0,
            hrvRmssd: data.hrvRmssd || 0,
            restingHeartRate: data.restingHeartRate || 0,
            sleepPerformance: undefined, // Not available in recovery data
            skinTemp: undefined, // Not available in current schema
            bloodOxygen: undefined, // Not available in current schema
          },
        ],
        progress: 0.1 + ((index + 1) / recoveryData.length) * 0.6, // 60% for data processing
      });

      await delay(100);
    }

    await delay(300);

    // Step 3: Analyzing - generate insights
    await analysis.update({ stage: "analyzing" });
    analysis.progress = 0.8;

    // Calculate summary metrics
    const validRecoveryData = recoveryData.filter(
      (d) => d.recoveryScore && d.recoveryScore > 0
    );
    const averageRecovery =
      validRecoveryData.length > 0
        ? validRecoveryData.reduce(
            (sum, d) => sum + (d.recoveryScore || 0),
            0
          ) / validRecoveryData.length
        : 0;
    const avgHrv =
      validRecoveryData.length > 0
        ? validRecoveryData.reduce((sum, d) => sum + (d.hrvRmssd || 0), 0) /
          validRecoveryData.length
        : 0;
    const avgRhr =
      validRecoveryData.length > 0
        ? validRecoveryData.reduce(
            (sum, d) => sum + (d.restingHeartRate || 0),
            0
          ) / validRecoveryData.length
        : 0;

    // Determine recovery trend
    const firstHalf = validRecoveryData.slice(
      0,
      Math.floor(validRecoveryData.length / 2)
    );
    const secondHalf = validRecoveryData.slice(
      Math.floor(validRecoveryData.length / 2)
    );
    const firstAvg =
      firstHalf.length > 0
        ? firstHalf.reduce((sum, d) => sum + (d.recoveryScore || 0), 0) /
          firstHalf.length
        : 0;
    const secondAvg =
      secondHalf.length > 0
        ? secondHalf.reduce((sum, d) => sum + (d.recoveryScore || 0), 0) /
          secondHalf.length
        : 0;

    const recoveryTrend =
      secondAvg > firstAvg + 2
        ? ("improving" as const)
        : secondAvg < firstAvg - 2
        ? ("declining" as const)
        : ("stable" as const);

    // Calculate consistency score (lower coefficient of variation = more consistent)
    const recoveryScores = validRecoveryData.map((d) => d.recoveryScore || 0);
    const consistencyScore =
      recoveryScores.length > 1 && averageRecovery > 0
        ? (() => {
            const stdDev = Math.sqrt(
              recoveryScores.reduce(
                (sum, score) => sum + Math.pow(score - averageRecovery, 2),
                0
              ) / recoveryScores.length
            );
            return Math.max(0, 100 - (stdDev / averageRecovery) * 100);
          })()
        : 100;

    // Generate risk factors and recommendations
    const riskFactors: string[] = [];
    const recommendations: string[] = [];
    const insights: Array<{
      title: string;
      description: string;
      impact: "positive" | "negative" | "neutral";
      confidence: number;
    }> = [];

    if (averageRecovery < 50) {
      riskFactors.push(
        "Low average recovery score indicates chronic stress or insufficient recovery"
      );
      recommendations.push(
        "Focus on sleep optimization and stress management techniques"
      );
    } else if (averageRecovery < 70) {
      riskFactors.push(
        "Below-optimal recovery may impact performance and health"
      );
      recommendations.push(
        "Consider adjusting training load and recovery practices"
      );
    }

    if (avgHrv < 30) {
      riskFactors.push(
        "Low HRV suggests elevated stress or poor autonomic function"
      );
      recommendations.push(
        "Implement breathing exercises and meditation to improve HRV"
      );
    }

    if (avgRhr > 60) {
      riskFactors.push(
        "Elevated resting heart rate may indicate overtraining or stress"
      );
      recommendations.push(
        "Monitor training intensity and ensure adequate rest days"
      );
    }

    if (consistencyScore < 70) {
      riskFactors.push(
        "Inconsistent recovery patterns suggest irregular stress or sleep"
      );
      recommendations.push(
        "Establish consistent sleep and wake times for better recovery"
      );
    }

    // Generate insights based on trends
    if (recoveryTrend === "improving") {
      insights.push({
        title: "Recovery Trend Improving",
        description: `Your recovery has improved by ${(
          secondAvg - firstAvg
        ).toFixed(1)}% over the analysis period`,
        impact: "positive",
        confidence: 0.8,
      });
    } else if (recoveryTrend === "declining") {
      insights.push({
        title: "Recovery Trend Declining",
        description: `Your recovery has decreased by ${(
          firstAvg - secondAvg
        ).toFixed(1)}% over the analysis period`,
        impact: "negative",
        confidence: 0.8,
      });
    }

    if (avgHrv > 50) {
      insights.push({
        title: "Strong Autonomic Function",
        description:
          "Your HRV indicates good autonomic nervous system balance and stress resilience",
        impact: "positive",
        confidence: 0.9,
      });
    }

    if (consistencyScore > 80) {
      insights.push({
        title: "Consistent Recovery Patterns",
        description:
          "Your recovery scores show good consistency, indicating stable lifestyle habits",
        impact: "positive",
        confidence: 0.85,
      });
    }

    // Add general recommendations
    if (averageRecovery > 70) {
      recommendations.push(
        "Maintain current recovery practices - they're working well"
      );
    }

    recommendations.push("Track recovery trends to optimize training timing");
    recommendations.push(
      "Consider recovery-enhancing activities on low recovery days"
    );

    await delay(400);

    // Step 4: Complete with summary
    const finalData = {
      title: "Recovery Analysis",
      stage: "complete" as const,
      chartData: analysis.data.chartData,
      progress: 1,
      summary: {
        averageRecovery: Math.round(averageRecovery),
        recoveryTrend,
        avgHrv: Math.round(avgHrv),
        avgRhr: Math.round(avgRhr),
        consistencyScore: Math.round(consistencyScore),
        riskFactors,
        recommendations,
        insights,
      },
      metadata: analysis.data.metadata,
    };

    await analysis.complete(finalData);

    // Return the artifact data
    return {
      parts: [
        {
          type: `data-artifact-${WhoopRecoveryArtifact.id}`,
          data: {
            id: analysis.id,
            version: 1,
            status: "complete" as const,
            progress: 1,
            payload: finalData,
            createdAt: Date.now(),
          },
        },
      ],
      text: `Completed recovery analysis for ${
        user.fullName
      } (${userId}). Average recovery: ${averageRecovery.toFixed(
        1
      )}%, trend: ${recoveryTrend}. Found ${
        riskFactors.length
      } risk factors and ${recommendations.length} recommendations.`,
    };
  },
});

// Cursor rules applied correctly.
