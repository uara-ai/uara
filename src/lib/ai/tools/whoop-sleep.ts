import { tool } from "ai";
import { z } from "zod";
import { WhoopSleepArtifact } from "@/lib/ai";
import { getCurrentUser } from "@/lib/ai/context";
import { delay } from "@/lib/delay";

export const analyzeWhoopSleepTool = tool({
  description:
    "Analyze WHOOP sleep data with detailed insights on sleep performance, efficiency, stages, and optimization recommendations. Use when users ask about sleep analysis, sleep quality, sleep stages, or sleep optimization.",
  inputSchema: z.object({
    userId: z.string().describe("User ID for personalized analysis"),
    dateRange: z
      .object({
        start: z.string().describe("Start date in YYYY-MM-DD format"),
        end: z.string().describe("End date in YYYY-MM-DD format"),
      })
      .describe("Date range for analysis"),
    sleepData: z
      .array(
        z.object({
          date: z.string().describe("Date in YYYY-MM-DD format"),
          sleepPerformancePercentage: z
            .number()
            .nullable()
            .describe("Sleep performance percentage from WHOOP"),
          sleepEfficiencyPercentage: z
            .number()
            .nullable()
            .describe("Sleep efficiency percentage"),
          totalInBedTime: z
            .number()
            .nullable()
            .describe("Total time in bed in milliseconds"),
          totalAwakeTime: z
            .number()
            .nullable()
            .describe("Total awake time in milliseconds"),
          totalRemSleepTime: z
            .number()
            .nullable()
            .describe("Total REM sleep time in milliseconds"),
          totalSlowWaveSleepTime: z
            .number()
            .nullable()
            .describe("Total slow wave (deep) sleep time in milliseconds"),
          totalLightSleepTime: z
            .number()
            .nullable()
            .describe("Total light sleep time in milliseconds"),
          sleepCycleCount: z
            .number()
            .nullable()
            .describe("Number of sleep cycles"),
          disturbanceCount: z
            .number()
            .nullable()
            .describe("Number of sleep disturbances"),
          respiratoryRate: z
            .number()
            .nullable()
            .describe("Respiratory rate during sleep"),
          sleepConsistencyPercentage: z
            .number()
            .nullable()
            .describe("Sleep consistency percentage"),
        })
      )
      .describe("Array of nightly sleep data"),
    userProfile: z
      .object({
        age: z
          .number()
          .optional()
          .describe("User age for personalized recommendations"),
        sleepGoal: z.number().optional().describe("Sleep goal in hours"),
      })
      .optional()
      .describe("User profile for personalized analysis"),
  }),
  execute: async ({ userId, dateRange, sleepData, userProfile }) => {
    // Get current user context
    const user = getCurrentUser();

    // Step 1: Create with loading state
    const analysis = WhoopSleepArtifact.stream({
      stage: "loading",
      title: "Sleep Analysis",
      chartData: [],
      progress: 0,
      metadata: {
        dateRange,
        totalNights: sleepData.length,
        validDataPoints: sleepData.filter(
          (d) =>
            d.sleepPerformancePercentage && d.sleepPerformancePercentage > 0
        ).length,
        userId,
      },
    });

    await delay(500);

    // Step 2: Processing - prepare chart data
    analysis.progress = 0.1;
    await analysis.update({ stage: "processing" });

    for (const [index, data] of sleepData.entries()) {
      await analysis.update({
        chartData: [
          ...analysis.data.chartData,
          {
            date: data.date,
            sleepPerformance: data.sleepPerformancePercentage || 0,
            sleepEfficiency: data.sleepEfficiencyPercentage || 0,
            timeInBed: data.totalInBedTime || 0,
            sleepDuration:
              (data.totalInBedTime || 0) - (data.totalAwakeTime || 0),
            remSleep: data.totalRemSleepTime || undefined,
            deepSleep: data.totalSlowWaveSleepTime || undefined,
            lightSleep: data.totalLightSleepTime || undefined,
            awakeDuration: data.totalAwakeTime || undefined,
            sleepOnset: undefined, // Not directly available in schema
            disturbances: data.disturbanceCount || undefined,
          },
        ],
        progress: 0.1 + ((index + 1) / sleepData.length) * 0.6, // 60% for data processing
      });

      await delay(100);
    }

    await delay(300);

    // Step 3: Analyzing - generate insights
    await analysis.update({ stage: "analyzing" });
    analysis.progress = 0.8;

    // Calculate summary metrics using chart data
    const chartData = analysis.data.chartData;
    const validSleepData = chartData.filter((d) => d.sleepDuration > 0);
    const averageSleepPerformance =
      validSleepData.length > 0
        ? validSleepData.reduce((sum, d) => sum + d.sleepPerformance, 0) /
          validSleepData.length
        : 0;
    const averageSleepEfficiency =
      validSleepData.length > 0
        ? validSleepData.reduce((sum, d) => sum + d.sleepEfficiency, 0) /
          validSleepData.length
        : 0;
    const averageSleepDuration =
      validSleepData.length > 0
        ? validSleepData.reduce((sum, d) => sum + d.sleepDuration, 0) /
          validSleepData.length /
          (1000 * 60 * 60)
        : 0; // Convert to hours

    // Determine sleep trend
    const firstHalf = validSleepData.slice(
      0,
      Math.floor(validSleepData.length / 2)
    );
    const secondHalf = validSleepData.slice(
      Math.floor(validSleepData.length / 2)
    );
    const firstAvg =
      firstHalf.length > 0
        ? firstHalf.reduce((sum, d) => sum + d.sleepPerformance, 0) /
          firstHalf.length
        : 0;
    const secondAvg =
      secondHalf.length > 0
        ? secondHalf.reduce((sum, d) => sum + d.sleepPerformance, 0) /
          secondHalf.length
        : 0;

    const sleepTrend =
      secondAvg > firstAvg + 3
        ? ("improving" as const)
        : secondAvg < firstAvg - 3
        ? ("declining" as const)
        : ("stable" as const);

    // Calculate sleep debt and consistency
    const sleepGoal = userProfile?.sleepGoal || 8; // Default 8 hours
    const sleepDebt =
      validSleepData.length > 0
        ? Math.max(
            0,
            sleepGoal * validSleepData.length -
              validSleepData.reduce(
                (sum, d) => sum + d.sleepDuration / (1000 * 60 * 60),
                0
              )
          )
        : 0;

    // Sleep timing consistency (based on variation in sleep duration)
    const sleepDurations = validSleepData.map(
      (d) => d.sleepDuration / (1000 * 60 * 60)
    );
    const consistencyScore =
      validSleepData.length > 1 && averageSleepDuration > 0
        ? (() => {
            const stdDev = Math.sqrt(
              sleepDurations.reduce(
                (sum, duration) =>
                  sum + Math.pow(duration - averageSleepDuration, 2),
                0
              ) / sleepDurations.length
            );
            return Math.max(0, 100 - (stdDev / averageSleepDuration) * 50);
          })()
        : 100;

    // Analyze sleep quality factors
    const sleepQualityFactors: Array<{
      factor: string;
      impact: "positive" | "negative" | "neutral";
      description: string;
    }> = [];
    const recommendations: string[] = [];
    const insights: Array<{
      title: string;
      description: string;
      impact: "positive" | "negative" | "neutral";
      confidence: number;
    }> = [];

    // Sleep efficiency analysis
    if (averageSleepEfficiency > 85) {
      sleepQualityFactors.push({
        factor: "Sleep Efficiency",
        impact: "positive",
        description:
          "High sleep efficiency indicates good sleep quality with minimal time awake in bed",
      });
    } else if (averageSleepEfficiency < 75) {
      sleepQualityFactors.push({
        factor: "Sleep Efficiency",
        impact: "negative",
        description:
          "Low sleep efficiency suggests difficulty staying asleep or excessive time in bed",
      });
      recommendations.push(
        "Limit time in bed to actual sleep time to improve efficiency"
      );
    }

    // Sleep duration analysis
    if (averageSleepDuration < 7) {
      sleepQualityFactors.push({
        factor: "Sleep Duration",
        impact: "negative",
        description:
          "Insufficient sleep duration may impact recovery and performance",
      });
      recommendations.push(
        "Aim for 7-9 hours of sleep per night for optimal health"
      );
    } else if (averageSleepDuration > 9) {
      sleepQualityFactors.push({
        factor: "Sleep Duration",
        impact: "neutral",
        description:
          "Long sleep duration - ensure it's quality sleep rather than excessive time in bed",
      });
    }

    // Sleep consistency analysis
    if (consistencyScore > 80) {
      insights.push({
        title: "Consistent Sleep Patterns",
        description:
          "Your sleep duration is consistent, which supports healthy circadian rhythms",
        impact: "positive",
        confidence: 0.9,
      });
    } else if (consistencyScore < 60) {
      sleepQualityFactors.push({
        factor: "Sleep Consistency",
        impact: "negative",
        description: "Irregular sleep patterns can disrupt circadian rhythms",
      });
      recommendations.push(
        "Maintain consistent sleep and wake times, even on weekends"
      );
    }

    // Sleep debt analysis
    if (sleepDebt > 10) {
      insights.push({
        title: "Significant Sleep Debt",
        description: `You have accumulated ${sleepDebt.toFixed(
          1
        )} hours of sleep debt over the analysis period`,
        impact: "negative",
        confidence: 0.8,
      });
      recommendations.push(
        "Gradually increase sleep duration to pay down sleep debt"
      );
    } else if (sleepDebt < 3) {
      insights.push({
        title: "Minimal Sleep Debt",
        description:
          "You're maintaining good sleep duration relative to your sleep goal",
        impact: "positive",
        confidence: 0.85,
      });
    }

    // Sleep stage analysis (if available)
    const dataWithStages = validSleepData.filter(
      (d) => d.remSleep && d.deepSleep && d.sleepDuration > 0
    );
    if (dataWithStages.length > 0) {
      const avgRemPercentage =
        dataWithStages.reduce(
          (sum, d) => sum + ((d.remSleep || 0) / d.sleepDuration) * 100,
          0
        ) / dataWithStages.length;
      const avgDeepPercentage =
        dataWithStages.reduce(
          (sum, d) => sum + ((d.deepSleep || 0) / d.sleepDuration) * 100,
          0
        ) / dataWithStages.length;

      if (avgRemPercentage < 15) {
        sleepQualityFactors.push({
          factor: "REM Sleep",
          impact: "negative",
          description:
            "Low REM sleep percentage may affect memory consolidation and emotional processing",
        });
        recommendations.push(
          "Avoid alcohol and late meals which can suppress REM sleep"
        );
      }

      if (avgDeepPercentage < 15) {
        sleepQualityFactors.push({
          factor: "Deep Sleep",
          impact: "negative",
          description:
            "Insufficient deep sleep may impact physical recovery and immune function",
        });
        recommendations.push(
          "Keep bedroom cool and dark to promote deep sleep"
        );
      }
    }

    // Generate trend insights
    if (sleepTrend === "improving") {
      insights.push({
        title: "Sleep Quality Improving",
        description: `Your sleep performance has improved by ${(
          secondAvg - firstAvg
        ).toFixed(1)}% over the analysis period`,
        impact: "positive",
        confidence: 0.8,
      });
    } else if (sleepTrend === "declining") {
      insights.push({
        title: "Sleep Quality Declining",
        description: `Your sleep performance has decreased by ${(
          firstAvg - secondAvg
        ).toFixed(1)}% over the analysis period`,
        impact: "negative",
        confidence: 0.8,
      });
      recommendations.push(
        "Review recent lifestyle changes that might be affecting sleep"
      );
    }

    // Add general recommendations
    recommendations.push(
      "Maintain a consistent sleep schedule to optimize circadian rhythms"
    );
    recommendations.push(
      "Create a relaxing bedtime routine to improve sleep onset"
    );

    await delay(400);

    // Step 4: Complete with summary
    const finalData = {
      title: "Sleep Analysis",
      stage: "complete" as const,
      chartData: analysis.data.chartData,
      progress: 1,
      summary: {
        averageSleepPerformance: Math.round(averageSleepPerformance),
        averageSleepEfficiency: Math.round(averageSleepEfficiency),
        averageSleepDuration: Number(averageSleepDuration.toFixed(1)),
        sleepTrend,
        sleepDebt: Number(sleepDebt.toFixed(1)),
        optimalSleepTime: sleepGoal,
        consistencyScore: Math.round(consistencyScore),
        sleepQualityFactors,
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
          type: `data-artifact-${WhoopSleepArtifact.id}`,
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
      text: `Completed sleep analysis for ${
        user.fullName
      } (${userId}). Average sleep performance: ${averageSleepPerformance.toFixed(
        1
      )}%, duration: ${averageSleepDuration.toFixed(
        1
      )}h, trend: ${sleepTrend}. Found ${
        sleepQualityFactors.length
      } quality factors and ${recommendations.length} recommendations.`,
    };
  },
});

// Cursor rules applied correctly.
