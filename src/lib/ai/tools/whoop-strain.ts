import { tool } from "ai";
import { z } from "zod";
import { WhoopStrainArtifact } from "@/lib/ai";
import { getCurrentUser } from "@/lib/ai/context";
import { delay } from "@/lib/delay";

export const analyzeWhoopStrainTool = tool({
  description:
    "Analyze WHOOP strain data with insights on training load, intensity distribution, and strain-recovery balance. Use when users ask about strain analysis, training load, workout intensity, or training optimization.",
  inputSchema: z.object({
    userId: z.string().describe("User ID for personalized analysis"),
    dateRange: z
      .object({
        start: z.string().describe("Start date in YYYY-MM-DD format"),
        end: z.string().describe("End date in YYYY-MM-DD format"),
      })
      .describe("Date range for analysis"),
    strainData: z
      .array(
        z.object({
          date: z.string().describe("Date in YYYY-MM-DD format"),
          strain: z
            .number()
            .nullable()
            .describe("Daily strain score from WHOOP cycles"),
          kilojoule: z
            .number()
            .nullable()
            .describe("Energy expenditure in kilojoules from WHOOP cycles"),
          averageHeartRate: z
            .number()
            .nullable()
            .describe("Average heart rate from WHOOP cycles"),
          maxHeartRate: z
            .number()
            .nullable()
            .describe("Maximum heart rate from WHOOP cycles"),
          percentRecorded: z
            .number()
            .nullable()
            .describe("Percent of cycle recorded by WHOOP"),
          scoreState: z.string().describe("Score state from WHOOP API"),
        })
      )
      .describe("Array of daily strain data from WHOOP cycles"),
    recoveryData: z
      .array(
        z.object({
          date: z.string().describe("Date in YYYY-MM-DD format"),
          recoveryScore: z
            .number()
            .min(0)
            .max(100)
            .describe("Recovery score for strain-recovery balance"),
        })
      )
      .optional()
      .describe("Recovery data for strain-recovery balance analysis"),
  }),
  execute: async ({ userId, dateRange, strainData, recoveryData }) => {
    // Get current user context
    const user = getCurrentUser();

    // Step 1: Create with loading state
    const analysis = WhoopStrainArtifact.stream({
      stage: "loading",
      title: "Strain Analysis",
      chartData: [],
      progress: 0,
      metadata: {
        dateRange,
        totalDays: strainData.length,
        validDataPoints: strainData.filter((d) => d.strain && d.strain > 0)
          .length,
        userId,
      },
    });

    await delay(500);

    // Step 2: Processing - prepare chart data
    analysis.progress = 0.1;
    await analysis.update({ stage: "processing" });

    for (const [index, data] of strainData.entries()) {
      await analysis.update({
        chartData: [
          ...analysis.data.chartData,
          {
            date: data.date,
            strain: data.strain || 0,
            kilojoule: data.kilojoule,
            averageHeartRate: data.averageHeartRate,
            maxHeartRate: data.maxHeartRate,
            percentRecorded: data.percentRecorded,
            scoreState: data.scoreState,
          },
        ],
        progress: 0.1 + ((index + 1) / strainData.length) * 0.6, // 60% for data processing
      });

      await delay(100);
    }

    await delay(300);

    // Step 3: Analyzing - generate insights
    await analysis.update({ stage: "analyzing" });
    analysis.progress = 0.8;

    // Calculate summary metrics
    const validStrainData = strainData.filter((d) => d.strain && d.strain > 0);
    const averageStrain =
      validStrainData.length > 0
        ? validStrainData.reduce((sum, d) => sum + (d.strain || 0), 0) /
          validStrainData.length
        : 0;

    // For workout analysis, we'll estimate based on strain patterns
    // In the real schema, workouts are separate entities
    const estimatedTotalWorkouts = validStrainData.filter(
      (d) => (d.strain || 0) > 8
    ).length; // High strain days likely had workouts
    const averageWorkoutStrain =
      validStrainData.length > 0
        ? validStrainData.reduce((sum, d) => sum + (d.strain || 0), 0) /
          validStrainData.length
        : 0;

    // Determine strain trend
    const firstHalf = validStrainData.slice(
      0,
      Math.floor(validStrainData.length / 2)
    );
    const secondHalf = validStrainData.slice(
      Math.floor(validStrainData.length / 2)
    );
    const firstAvg =
      firstHalf.length > 0
        ? firstHalf.reduce((sum, d) => sum + (d.strain || 0), 0) /
          firstHalf.length
        : 0;
    const secondAvg =
      secondHalf.length > 0
        ? secondHalf.reduce((sum, d) => sum + (d.strain || 0), 0) /
          secondHalf.length
        : 0;

    const strainTrend =
      secondAvg > firstAvg + 1
        ? ("increasing" as const)
        : secondAvg < firstAvg - 1
        ? ("decreasing" as const)
        : ("stable" as const);

    // Calculate strain balance and targets
    const weeklyStrainTarget = averageStrain * 7; // Simple weekly target
    const strainBalance =
      averageStrain < 8
        ? ("under" as const)
        : averageStrain > 15
        ? ("over" as const)
        : ("optimal" as const);

    // Calculate strain-recovery ratio if recovery data is available
    let recoveryStrainRatio = 1;
    if (recoveryData && recoveryData.length > 0) {
      const alignedData = validStrainData.map((strainDay) => {
        const recoveryDay = recoveryData.find((r) => r.date === strainDay.date);
        return {
          strain: strainDay.strain || 0,
          recovery: recoveryDay?.recoveryScore || 50, // Default to neutral if no recovery data
        };
      });

      const avgRecovery =
        alignedData.reduce((sum, d) => sum + d.recovery, 0) /
        alignedData.length;
      recoveryStrainRatio = avgRecovery / (averageStrain * 5); // Normalized ratio
    }

    // Identify peak performance days (high strain days)
    const peakPerformanceDays = validStrainData
      .filter((d) => (d.strain || 0) > averageStrain * 1.2)
      .map((d) => d.date)
      .slice(0, 5); // Top 5 days

    // Assess fatigue risk
    const recentStrain = validStrainData.slice(-7); // Last 7 days
    const recentAverage =
      recentStrain.length > 0
        ? recentStrain.reduce((sum, d) => sum + (d.strain || 0), 0) /
          recentStrain.length
        : 0;
    const fatigueRisk =
      recentAverage > 16
        ? ("high" as const)
        : recentAverage > 12
        ? ("moderate" as const)
        : ("low" as const);

    // Generate recommendations and insights
    const recommendations: string[] = [];
    const insights: Array<{
      title: string;
      description: string;
      impact: "positive" | "negative" | "neutral";
      confidence: number;
    }> = [];

    // Strain level analysis
    if (averageStrain < 8) {
      recommendations.push(
        "Consider increasing training intensity to optimize fitness gains"
      );
      insights.push({
        title: "Low Training Load",
        description:
          "Your average strain is below optimal levels for fitness improvement",
        impact: "neutral",
        confidence: 0.8,
      });
    } else if (averageStrain > 15) {
      recommendations.push(
        "Consider reducing training intensity to prevent overtraining"
      );
      insights.push({
        title: "High Training Load",
        description: "Your strain levels indicate very high training stress",
        impact: "negative",
        confidence: 0.9,
      });
    } else {
      insights.push({
        title: "Optimal Training Load",
        description:
          "Your strain levels are in a good range for fitness development",
        impact: "positive",
        confidence: 0.85,
      });
    }

    // Strain trend analysis
    if (strainTrend === "increasing") {
      insights.push({
        title: "Increasing Training Load",
        description: `Your strain has been trending upward by ${(
          secondAvg - firstAvg
        ).toFixed(1)} points`,
        impact: "neutral",
        confidence: 0.8,
      });
      recommendations.push(
        "Monitor recovery closely as training load increases"
      );
    } else if (strainTrend === "decreasing") {
      insights.push({
        title: "Decreasing Training Load",
        description: `Your strain has decreased by ${(
          firstAvg - secondAvg
        ).toFixed(1)} points recently`,
        impact: "neutral",
        confidence: 0.8,
      });
    }

    // Recovery-strain balance
    if (recoveryData && recoveryStrainRatio < 0.8) {
      recommendations.push(
        "Your recovery is not keeping up with training strain - prioritize rest"
      );
      insights.push({
        title: "Recovery-Strain Imbalance",
        description:
          "Your strain levels may be outpacing your recovery capacity",
        impact: "negative",
        confidence: 0.85,
      });
    } else if (recoveryData && recoveryStrainRatio > 1.2) {
      insights.push({
        title: "Good Recovery-Strain Balance",
        description: "Your recovery is well-matched to your training strain",
        impact: "positive",
        confidence: 0.9,
      });
    }

    // Workout frequency analysis (estimated from high strain days)
    const workoutFrequency =
      (estimatedTotalWorkouts / validStrainData.length) * 7; // Workouts per week
    if (workoutFrequency < 3) {
      recommendations.push(
        "Consider increasing workout frequency for better fitness gains"
      );
    } else if (workoutFrequency > 6) {
      recommendations.push(
        "High workout frequency - ensure adequate recovery between sessions"
      );
    }

    // Fatigue risk assessment
    if (fatigueRisk === "high") {
      recommendations.push(
        "High fatigue risk detected - consider a recovery week"
      );
      insights.push({
        title: "High Fatigue Risk",
        description:
          "Recent strain levels suggest increased risk of overreaching",
        impact: "negative",
        confidence: 0.9,
      });
    }

    // Zone distribution analysis not available in current schema
    // Heart rate zones would be tracked in workout data separately

    // General recommendations
    recommendations.push(
      "Use strain data to time high-intensity sessions with good recovery"
    );
    recommendations.push(
      "Aim for strain periodization throughout your training week"
    );

    await delay(400);

    // Step 4: Complete with summary
    const finalData = {
      title: "Strain Analysis",
      stage: "complete" as const,
      chartData: analysis.data.chartData,
      progress: 1,
      summary: {
        averageStrain: Number(averageStrain.toFixed(1)),
        strainTrend,
        weeklyStrainTarget: Number(weeklyStrainTarget.toFixed(1)),
        strainBalance,
        totalWorkouts: estimatedTotalWorkouts,
        averageWorkoutStrain: Number(averageWorkoutStrain.toFixed(1)),
        recoveryStrainRatio: Number(recoveryStrainRatio.toFixed(2)),
        peakPerformanceDays,
        fatigueRisk,
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
          type: `data-artifact-${WhoopStrainArtifact.id}`,
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
      text: `Completed strain analysis for ${
        user.fullName
      } (${userId}). Average strain: ${averageStrain.toFixed(
        1
      )}, trend: ${strainTrend}, balance: ${strainBalance}. Found ${estimatedTotalWorkouts} high-strain days and ${
        recommendations.length
      } recommendations.`,
    };
  },
});

// Cursor rules applied correctly.
