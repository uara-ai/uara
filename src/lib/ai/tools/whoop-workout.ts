import { tool } from "ai";
import { z } from "zod";
import { WhoopWorkoutArtifact } from "@/lib/ai";
import { getCurrentUser } from "@/lib/ai/context";
import { delay } from "@/lib/delay";

export const analyzeWhoopWorkoutTool = tool({
  description:
    "Analyze WHOOP workout data with detailed insights on workout performance, sport-specific analysis, and training optimization. Use when users ask about workout analysis, training performance, sport-specific insights, or workout optimization.",
  inputSchema: z.object({
    userId: z.string().describe("User ID for personalized analysis"),
    dateRange: z
      .object({
        start: z.string().describe("Start date in YYYY-MM-DD format"),
        end: z.string().describe("End date in YYYY-MM-DD format"),
      })
      .describe("Date range for analysis"),
    workoutData: z
      .array(
        z.object({
          date: z.string().describe("Date in YYYY-MM-DD format"),
          workoutId: z.string().describe("WHOOP workout ID"),
          sportId: z.number().nullable().describe("Sport ID from WHOOP"),
          strain: z.number().nullable().describe("Workout strain score"),
          start: z.string().describe("Workout start time"),
          end: z.string().describe("Workout end time"),
          duration: z
            .number()
            .describe("Workout duration in milliseconds (end - start)"),
          kilojoule: z
            .number()
            .nullable()
            .describe("Energy expenditure in kilojoules"),
          averageHeartRate: z
            .number()
            .nullable()
            .describe("Average heart rate during workout"),
          maxHeartRate: z
            .number()
            .nullable()
            .describe("Maximum heart rate during workout"),
          percentRecorded: z
            .number()
            .nullable()
            .describe("Percent of workout recorded by WHOOP"),
          distanceMeters: z
            .number()
            .nullable()
            .describe("Distance covered in meters"),
          altitudeGainMeters: z
            .number()
            .nullable()
            .describe("Altitude gain in meters"),
          altitudeChangeMeters: z
            .number()
            .nullable()
            .describe("Total altitude change in meters"),
          scoreState: z.string().describe("Score state from WHOOP API"),
        })
      )
      .describe("Array of workout data from WHOOP"),
    recoveryData: z
      .array(
        z.object({
          date: z.string().describe("Date in YYYY-MM-DD format"),
          recoveryScore: z
            .number()
            .min(0)
            .max(100)
            .describe("Recovery score for workout timing analysis"),
        })
      )
      .optional()
      .describe("Recovery data for optimal workout timing analysis"),
  }),
  execute: async ({ userId, dateRange, workoutData, recoveryData }) => {
    // Get current user context
    const user = getCurrentUser();

    // Step 1: Create with loading state
    const analysis = WhoopWorkoutArtifact.stream({
      stage: "loading",
      title: "Workout Analysis",
      chartData: [],
      progress: 0,
      metadata: {
        dateRange,
        totalWorkouts: workoutData.length,
        validDataPoints: workoutData.filter((d) => d.strain && d.strain > 0)
          .length,
        userId,
      },
    });

    await delay(500);

    // Step 2: Processing - prepare chart data
    analysis.progress = 0.1;
    await analysis.update({ stage: "processing" });

    for (const [index, workout] of workoutData.entries()) {
      await analysis.update({
        chartData: [
          ...analysis.data.chartData,
          {
            date: workout.date,
            workoutId: workout.workoutId,
            sportId: workout.sportId,
            strain: workout.strain || 0,
            duration: workout.duration,
            kilojoule: workout.kilojoule,
            averageHeartRate: workout.averageHeartRate,
            maxHeartRate: workout.maxHeartRate,
            percentRecorded: workout.percentRecorded,
            distanceMeters: workout.distanceMeters,
            altitudeGainMeters: workout.altitudeGainMeters,
            scoreState: workout.scoreState,
          },
        ],
        progress: 0.1 + ((index + 1) / workoutData.length) * 0.6, // 60% for data processing
      });

      await delay(100);
    }

    await delay(300);

    // Step 3: Analyzing - generate insights
    await analysis.update({ stage: "analyzing" });
    analysis.progress = 0.8;

    // Use workoutData directly since each entry is a single workout
    const allWorkouts = workoutData;
    const totalWorkouts = allWorkouts.length;

    if (totalWorkouts === 0) {
      // Handle case with no workouts
      const finalData = {
        title: "Workout Analysis",
        stage: "complete" as const,
        chartData: analysis.data.chartData,
        progress: 1,
        summary: {
          totalWorkouts: 0,
          averageWorkoutStrain: 0,
          averageWorkoutDuration: 0,
          workoutFrequency: 0,
          intensityDistribution: { low: 0, moderate: 0, high: 0 },
          performanceTrend: "stable" as const,
          recoveryAdequacy: "adequate" as const,
          optimalWorkoutTiming: [],
          sportSpecificInsights: [],
          recommendations: [
            "Start incorporating regular workouts to improve fitness",
          ],
          insights: [
            {
              title: "No Workout Data",
              description: "No workouts found in the analysis period",
              impact: "neutral" as const,
              confidence: 1,
            },
          ],
        },
        metadata: analysis.data.metadata,
      };

      await analysis.complete(finalData);

      return {
        parts: [
          {
            type: `data-artifact-${WhoopWorkoutArtifact.id}`,
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
        text: `No workout data found for ${user.fullName} (${userId}) in the specified period.`,
      };
    }

    // Calculate summary metrics
    const averageWorkoutStrain =
      allWorkouts.reduce((sum, w) => sum + (w.strain || 0), 0) / totalWorkouts;
    const averageWorkoutDuration =
      allWorkouts.reduce((sum, w) => sum + w.duration, 0) /
      totalWorkouts /
      (1000 * 60); // Convert to minutes

    // Calculate workout frequency (assuming analysis period covers full weeks)
    const analysisStart = new Date(dateRange.start);
    const analysisEnd = new Date(dateRange.end);
    const analysisDays = Math.ceil(
      (analysisEnd.getTime() - analysisStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const workoutFrequency = (totalWorkouts / analysisDays) * 7; // Workouts per week

    // Sport analysis (using sportId - would need mapping to actual sport names)
    const sportCounts = allWorkouts.reduce((acc, w) => {
      const sport = w.sportId ? `Sport ${w.sportId}` : "Unknown";
      acc[sport] = (acc[sport] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostFrequentSport = Object.entries(sportCounts).reduce(
      (max, [sport, count]) => (count > max.count ? { sport, count } : max),
      { sport: "Unknown", count: 0 }
    ).sport;

    // Intensity distribution (based on strain)
    const lowIntensity = allWorkouts.filter((w) => (w.strain || 0) < 8).length;
    const moderateIntensity = allWorkouts.filter(
      (w) => (w.strain || 0) >= 8 && (w.strain || 0) < 15
    ).length;
    const highIntensity = allWorkouts.filter(
      (w) => (w.strain || 0) >= 15
    ).length;

    const intensityDistribution = {
      low: Math.round((lowIntensity / totalWorkouts) * 100),
      moderate: Math.round((moderateIntensity / totalWorkouts) * 100),
      high: Math.round((highIntensity / totalWorkouts) * 100),
    };

    // Performance trend analysis
    const firstHalf = allWorkouts.slice(0, Math.floor(totalWorkouts / 2));
    const secondHalf = allWorkouts.slice(Math.floor(totalWorkouts / 2));
    const firstAvgStrain =
      firstHalf.length > 0
        ? firstHalf.reduce((sum, w) => sum + (w.strain || 0), 0) /
          firstHalf.length
        : 0;
    const secondAvgStrain =
      secondHalf.length > 0
        ? secondHalf.reduce((sum, w) => sum + (w.strain || 0), 0) /
          secondHalf.length
        : 0;

    const performanceTrend =
      secondAvgStrain > firstAvgStrain + 1
        ? ("improving" as const)
        : secondAvgStrain < firstAvgStrain - 1
        ? ("declining" as const)
        : ("stable" as const);

    // Recovery adequacy analysis (if recovery data available)
    let recoveryAdequacy: "adequate" | "insufficient" | "excessive" =
      "adequate";
    let optimalWorkoutTiming: string[] = [];

    if (recoveryData && recoveryData.length > 0) {
      const workoutRecoveryPairs = allWorkouts.map((workout) => {
        const recoveryDay = recoveryData.find((r) => r.date === workout.date);
        return {
          workout,
          recovery: recoveryDay?.recoveryScore || 50,
        };
      });

      const avgRecoveryOnWorkoutDays =
        workoutRecoveryPairs.reduce((sum, p) => sum + p.recovery, 0) /
        workoutRecoveryPairs.length;

      if (avgRecoveryOnWorkoutDays < 50) {
        recoveryAdequacy = "insufficient";
      } else if (avgRecoveryOnWorkoutDays > 80) {
        recoveryAdequacy = "excessive";
      }

      // Find optimal workout timing (days with high recovery and good workout performance)
      const goodWorkoutDays = workoutRecoveryPairs
        .filter(
          (p) =>
            p.recovery > 70 && (p.workout.strain || 0) > averageWorkoutStrain
        )
        .map((p) => p.workout.date);

      optimalWorkoutTiming = [...new Set(goodWorkoutDays)].slice(0, 5);
    }

    // Sport-specific insights
    const sportSpecificInsights = Object.entries(sportCounts).map(
      ([sport, count]) => {
        const sportId = sport.startsWith("Sport ")
          ? parseInt(sport.replace("Sport ", ""))
          : null;
        const sportWorkouts = allWorkouts.filter((w) =>
          sportId ? w.sportId === sportId : w.sportId === null
        );
        const avgStrain =
          sportWorkouts.length > 0
            ? sportWorkouts.reduce((sum, w) => sum + (w.strain || 0), 0) /
              sportWorkouts.length
            : 0;

        // Calculate average distance for sports with distance data
        const avgDistance =
          sportWorkouts.length > 0
            ? sportWorkouts
                .filter((w) => w.distanceMeters !== null)
                .reduce((sum, w) => sum + (w.distanceMeters || 0), 0) /
                sportWorkouts.filter((w) => w.distanceMeters !== null).length ||
              0
            : 0;

        const recommendations: string[] = [];
        if (avgStrain < 8) {
          recommendations.push(
            `Consider increasing intensity for ${sport} workouts`
          );
        } else if (avgStrain > 16) {
          recommendations.push(
            `High strain in ${sport} - monitor recovery closely`
          );
        }

        return {
          sport,
          averageStrain: Number(avgStrain.toFixed(1)),
          frequency: count,
          averageDistance:
            avgDistance > 0
              ? Number((avgDistance / 1000).toFixed(1))
              : undefined, // Convert to km
          recommendations,
        };
      }
    );

    // Generate general recommendations and insights
    const recommendations: string[] = [];
    const insights: Array<{
      title: string;
      description: string;
      impact: "positive" | "negative" | "neutral";
      confidence: number;
    }> = [];

    // Workout frequency analysis
    if (workoutFrequency < 3) {
      recommendations.push(
        "Consider increasing workout frequency to 3-5 sessions per week"
      );
      insights.push({
        title: "Low Workout Frequency",
        description: `You're averaging ${workoutFrequency.toFixed(
          1
        )} workouts per week`,
        impact: "neutral",
        confidence: 0.9,
      });
    } else if (workoutFrequency > 6) {
      recommendations.push(
        "High workout frequency - ensure adequate recovery between sessions"
      );
      insights.push({
        title: "High Workout Frequency",
        description: `You're averaging ${workoutFrequency.toFixed(
          1
        )} workouts per week`,
        impact: "neutral",
        confidence: 0.9,
      });
    } else {
      insights.push({
        title: "Good Workout Frequency",
        description: `Your workout frequency of ${workoutFrequency.toFixed(
          1
        )} per week is optimal`,
        impact: "positive",
        confidence: 0.85,
      });
    }

    // Intensity distribution analysis
    if (intensityDistribution.high > 30) {
      recommendations.push(
        "High percentage of high-intensity workouts - add more easy sessions"
      );
      insights.push({
        title: "High Intensity Focus",
        description: `${intensityDistribution.high}% of your workouts are high intensity`,
        impact: "negative",
        confidence: 0.8,
      });
    } else if (intensityDistribution.high < 10) {
      recommendations.push(
        "Consider adding more high-intensity workouts for performance gains"
      );
    }

    if (intensityDistribution.low > 60) {
      insights.push({
        title: "Good Easy Training Base",
        description: "You maintain a good base of low-intensity training",
        impact: "positive",
        confidence: 0.8,
      });
    }

    // Performance trend analysis
    if (performanceTrend === "improving") {
      insights.push({
        title: "Performance Improving",
        description: `Your workout strain has improved by ${(
          secondAvgStrain - firstAvgStrain
        ).toFixed(1)} points`,
        impact: "positive",
        confidence: 0.8,
      });
    } else if (performanceTrend === "declining") {
      insights.push({
        title: "Performance Declining",
        description: `Your workout strain has decreased by ${(
          firstAvgStrain - secondAvgStrain
        ).toFixed(1)} points`,
        impact: "negative",
        confidence: 0.8,
      });
      recommendations.push(
        "Review training program and ensure adequate progression"
      );
    }

    // Recovery adequacy insights
    if (recoveryAdequacy === "insufficient") {
      recommendations.push(
        "Your recovery may not be adequate for your training load"
      );
      insights.push({
        title: "Recovery-Training Imbalance",
        description: "Your workouts are occurring on days with lower recovery",
        impact: "negative",
        confidence: 0.8,
      });
    } else if (recoveryAdequacy === "excessive") {
      recommendations.push(
        "You may be under-utilizing high recovery days for training"
      );
    }

    // Duration analysis
    if (averageWorkoutDuration < 30) {
      recommendations.push(
        "Consider longer workout sessions for better training adaptations"
      );
    } else if (averageWorkoutDuration > 90) {
      recommendations.push(
        "Very long workout sessions - ensure recovery is prioritized"
      );
    }

    // General recommendations
    recommendations.push(
      "Use recovery data to time high-intensity workouts optimally"
    );
    recommendations.push("Maintain variety in workout types and intensities");

    await delay(400);

    // Step 4: Complete with summary
    const finalData = {
      title: "Workout Analysis",
      stage: "complete" as const,
      chartData: analysis.data.chartData,
      progress: 1,
      summary: {
        totalWorkouts,
        averageWorkoutStrain: Number(averageWorkoutStrain.toFixed(1)),
        averageWorkoutDuration: Number(averageWorkoutDuration.toFixed(1)),
        mostFrequentSport,
        workoutFrequency: Number(workoutFrequency.toFixed(1)),
        intensityDistribution,
        performanceTrend,
        recoveryAdequacy,
        optimalWorkoutTiming,
        sportSpecificInsights,
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
          type: `data-artifact-${WhoopWorkoutArtifact.id}`,
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
      text: `Completed workout analysis for ${
        user.fullName
      } (${userId}). Total workouts: ${totalWorkouts}, average strain: ${averageWorkoutStrain.toFixed(
        1
      )}, frequency: ${workoutFrequency.toFixed(
        1
      )}/week, trend: ${performanceTrend}. Generated ${
        recommendations.length
      } recommendations.`,
    };
  },
});

// Cursor rules applied correctly.
