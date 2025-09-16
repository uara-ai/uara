import { z } from "zod";
import { tool } from "ai";
import {
  getWhoopSummaryServer,
  processWhoopDataToStats,
  type WhoopDataResponse,
  type WhoopStats,
} from "@/actions/whoop-data-action";

// Schema for the WHOOP analysis tool following AI SDK patterns
const analyzeWhoopDataSchema = z.object({
  days: z
    .number()
    .min(1)
    .max(90)
    .default(30)
    .describe("Number of days of WHOOP data to analyze"),
  focusArea: z
    .enum(["recovery", "sleep", "strain", "overall"])
    .default("overall")
    .describe("Specific area to focus the analysis on"),
  includeRecommendations: z
    .boolean()
    .default(true)
    .describe("Whether to include actionable recommendations"),
});

export interface AnalysisResult {
  overallHealthScore: number;
  recoveryAnalysis: {
    score: number;
    trend: string;
    insights: string[];
    recommendations: string[];
  };
  sleepAnalysis: {
    score: number;
    trend: string;
    insights: string[];
    recommendations: string[];
  };
  strainAnalysis: {
    score: number;
    trend: string;
    insights: string[];
    recommendations: string[];
  };
  keyRecommendations: string[];
  riskFactors: string[];
  positiveIndicators: string[];
  summary: string;
}

// Create the WHOOP analysis tool following AI SDK best practices
export const analyzeWhoopData = tool({
  description: `Analyze WHOOP wearable data to provide personalized health insights and longevity recommendations. 
  This tool examines recovery scores, sleep performance, strain patterns, and provides evidence-based recommendations 
  for optimizing health and extending healthspan. Perfect for longevity coaching and health optimization.`,

  inputSchema: analyzeWhoopDataSchema,

  execute: async ({
    days,
    focusArea,
    includeRecommendations,
  }: {
    days: number;
    focusArea: "recovery" | "sleep" | "strain" | "overall";
    includeRecommendations: boolean;
  }) => {
    try {
      // Fetch user's WHOOP data
      const whoopData = await getWhoopSummaryServer(days);
      if (!whoopData) {
        return {
          error:
            "No WHOOP data found for this user. Please connect your WHOOP account first to get personalized health insights.",
          hasData: false,
        };
      }

      const whoopStats = await processWhoopDataToStats(whoopData);

      // Generate comprehensive analysis
      const analysis = await generateComprehensiveAnalysis(
        whoopData,
        whoopStats,
        focusArea,
        includeRecommendations
      );

      return analysis;
    } catch (error) {
      console.error("Error analyzing WHOOP data:", error);
      return {
        error:
          "Failed to analyze WHOOP data. Please try again later or check your WHOOP connection.",
        hasData: false,
      };
    }
  },
});

export async function generateComprehensiveAnalysis(
  whoopData: WhoopDataResponse,
  whoopStats: WhoopStats,
  focusArea: string,
  includeRecommendations: boolean
): Promise<AnalysisResult> {
  // Recovery Analysis
  const recoveryScore = whoopStats.latestRecovery?.recoveryScore || 0;
  const recoveryTrend = whoopStats.trends.recoveryTrend;
  const hrvRmssd = whoopStats.latestRecovery?.hrvRmssd || 0;
  const restingHR = whoopStats.latestRecovery?.restingHeartRate || 0;

  const recoveryInsights = [
    `Your current recovery score is ${recoveryScore.toFixed(
      0
    )}%, which ${getScoreInterpretation(recoveryScore, "recovery")}`,
    `HRV at ${hrvRmssd.toFixed(0)}ms ${getHRVInterpretation(hrvRmssd)}`,
    `Resting heart rate of ${restingHR} bpm ${getRHRInterpretation(restingHR)}`,
    `Recovery trend is ${recoveryTrend}, ${getTrendImplication(
      recoveryTrend,
      "recovery"
    )}`,
  ];

  const recoveryRecommendations = includeRecommendations
    ? [
        recoveryScore < 70
          ? "🎯 Focus on improving sleep quality and consistency - aim for 7-8 hours nightly"
          : "✅ Maintain your current recovery practices, they're working well",
        hrvRmssd < 30
          ? "🫁 Practice daily breathwork: try 4-7-8 breathing or box breathing (4-4-4-4) for 5-10 minutes"
          : "💪 Continue stress management practices to maintain your excellent HRV",
        "🧘 Consider adding meditation or yoga to your routine for better recovery",
        "💊 Magnesium supplementation may help recovery (consult your healthcare provider)",
      ]
    : [];

  // Sleep Analysis
  const sleepScore = whoopStats.latestSleep?.sleepPerformancePercentage || 0;
  const sleepEfficiency =
    whoopStats.latestSleep?.sleepEfficiencyPercentage || 0;
  const sleepTrend = whoopStats.trends.sleepTrend;

  const sleepInsights = [
    `Sleep performance score is ${sleepScore.toFixed(
      0
    )}%, which ${getScoreInterpretation(sleepScore, "sleep")}`,
    `Sleep efficiency at ${sleepEfficiency.toFixed(
      0
    )}% ${getEfficiencyInterpretation(sleepEfficiency)}`,
    `Sleep trend is ${sleepTrend}, ${getTrendImplication(sleepTrend, "sleep")}`,
    getSleepDurationInsight(whoopStats.latestSleep?.totalInBedTime || null),
  ];

  const sleepRecommendations = includeRecommendations
    ? [
        sleepScore < 75
          ? "🌡️ Optimize sleep environment: keep room at 65-68°F, use blackout curtains, minimize noise"
          : "🌟 Your sleep performance is excellent - maintain these habits",
        sleepEfficiency < 85
          ? "☕ Avoid caffeine after 2 PM and screens 1 hour before bed"
          : "👌 Your sleep efficiency is excellent",
        "📱 Create a consistent bedtime routine: same time nightly, wind-down activities",
        "🛏️ Consider sleep tracking optimization: ensure WHOOP is properly positioned",
      ]
    : [];

  // Strain Analysis
  const weeklyStrain = whoopStats.weeklyStrain?.averageStrain || 0;
  const maxStrain = whoopStats.weeklyStrain?.maxStrain || 0;
  const strainTrend = whoopStats.trends.strainTrend;
  const workoutCount = whoopStats.weeklyStrain?.totalWorkouts || 0;

  const strainInsights = [
    `Weekly average strain is ${weeklyStrain.toFixed(
      1
    )} ${getStrainInterpretation(weeklyStrain)}`,
    `Peak strain reached ${maxStrain.toFixed(1)} ${getMaxStrainInterpretation(
      maxStrain
    )}`,
    `Completed ${workoutCount} workouts this period ${getWorkoutFrequencyInsight(
      workoutCount
    )}`,
    `Strain trend is ${strainTrend}, ${getTrendImplication(
      strainTrend,
      "strain"
    )}`,
  ];

  const strainRecommendations = includeRecommendations
    ? [
        weeklyStrain < 8
          ? "📈 Consider gradually increasing training intensity for better fitness gains"
          : weeklyStrain > 15
          ? "⚠️ Include more recovery days to prevent overtraining and injury risk"
          : "⚖️ Your training load is well balanced for optimal adaptation",
        "🧘‍♀️ Ensure 2 low-strain recovery days per week with yoga, walking, or stretching",
        "📊 Monitor strain-to-recovery ratio: high strain days should be followed by adequate recovery",
        "💡 Consider periodization: alternate higher and lower intensity weeks",
      ]
    : [];

  // Calculate overall health score
  const overallHealthScore = Math.round(
    (recoveryScore + sleepScore + Math.min(weeklyStrain * 6, 100)) / 3
  );

  // Generate key recommendations
  const keyRecommendations = includeRecommendations
    ? [
        ...recoveryRecommendations.slice(0, 1),
        ...sleepRecommendations.slice(0, 1),
        ...strainRecommendations.slice(0, 1),
        "📈 Focus on trends over daily fluctuations - consistency matters more than perfect scores",
        "🩺 Consider consulting a longevity-focused physician for personalized optimization",
      ]
        .filter(Boolean)
        .slice(0, 5)
    : [];

  // Identify risk factors
  const riskFactors = [
    recoveryScore < 50 &&
      "Consistently low recovery scores may indicate chronic stress, overtraining, or inadequate rest",
    sleepEfficiency < 75 &&
      "Poor sleep efficiency could indicate sleep disorders or environmental issues - consider a sleep study",
    weeklyStrain > 18 &&
      "Very high strain levels increase overtraining and injury risk - prioritize recovery",
    restingHR > 75 &&
      "Elevated resting heart rate may indicate overtraining, stress, or underlying health issues",
    hrvRmssd < 20 &&
      "Very low HRV suggests high stress or poor recovery - focus on stress management",
  ].filter(Boolean) as string[];

  // Identify positive indicators
  const positiveIndicators = [
    recoveryScore > 80 &&
      "Excellent recovery scores indicate optimal health and training adaptation",
    sleepScore > 85 &&
      "High sleep performance scores strongly support longevity and cognitive function",
    hrvRmssd > 35 &&
      "High HRV indicates strong autonomic nervous system health and stress resilience",
    workoutCount >= 4 &&
      workoutCount <= 6 &&
      "Optimal workout frequency for health and longevity benefits",
    sleepEfficiency > 90 &&
      "Exceptional sleep efficiency shows excellent sleep quality",
  ].filter(Boolean) as string[];

  // Generate summary based on focus area
  const summary = generateSummary(
    overallHealthScore,
    focusArea,
    { recoveryScore, sleepScore, weeklyStrain },
    { riskFactors, positiveIndicators }
  );

  return {
    overallHealthScore,
    recoveryAnalysis: {
      score: Math.round(recoveryScore),
      trend: recoveryTrend,
      insights: recoveryInsights,
      recommendations: recoveryRecommendations,
    },
    sleepAnalysis: {
      score: Math.round(sleepScore),
      trend: sleepTrend,
      insights: sleepInsights,
      recommendations: sleepRecommendations,
    },
    strainAnalysis: {
      score: Math.min(Math.round(weeklyStrain * 6), 100),
      trend: strainTrend,
      insights: strainInsights,
      recommendations: strainRecommendations,
    },
    keyRecommendations,
    riskFactors,
    positiveIndicators,
    summary,
  };
}

function generateSummary(
  overallScore: number,
  focusArea: string,
  scores: { recoveryScore: number; sleepScore: number; weeklyStrain: number },
  factors: { riskFactors: string[]; positiveIndicators: string[] }
): string {
  let summary = `## 🧠 WHOOP Health Analysis Summary\n\n`;
  summary += `**Overall Health Score: ${overallScore}/100**\n\n`;

  if (overallScore >= 80) {
    summary += `🌟 **Excellent Performance!** Your metrics show outstanding health optimization. `;
  } else if (overallScore >= 65) {
    summary += `👍 **Good Health Status** with clear opportunities for improvement. `;
  } else {
    summary += `⚠️ **Health Attention Needed** - several metrics require optimization. `;
  }

  // Focus area specific insights
  switch (focusArea) {
    case "recovery":
      summary += `Recovery focus: Your ${scores.recoveryScore.toFixed(
        0
      )}% recovery score ${
        scores.recoveryScore > 70 ? "shows strong" : "needs"
      } optimization.\n\n`;
      break;
    case "sleep":
      summary += `Sleep focus: Your ${scores.sleepScore.toFixed(
        0
      )}% sleep performance ${
        scores.sleepScore > 75 ? "is excellent" : "has room for improvement"
      }.\n\n`;
      break;
    case "strain":
      summary += `Training focus: Your ${scores.weeklyStrain.toFixed(
        1
      )} weekly strain ${
        scores.weeklyStrain > 10 && scores.weeklyStrain < 16
          ? "is well balanced"
          : "needs adjustment"
      }.\n\n`;
      break;
    default:
      summary += `Your health metrics show a ${
        overallScore > 70 ? "strong foundation" : "need for optimization"
      } across recovery, sleep, and training.\n\n`;
  }

  // Risk factors
  if (factors.riskFactors.length > 0) {
    summary += `**⚠️ Priority Areas (${factors.riskFactors.length}):**\n`;
    factors.riskFactors.slice(0, 2).forEach((risk, i) => {
      summary += `${i + 1}. ${risk}\n`;
    });
    summary += `\n`;
  }

  // Positive indicators
  if (factors.positiveIndicators.length > 0) {
    summary += `**✅ Strengths (${factors.positiveIndicators.length}):**\n`;
    factors.positiveIndicators.slice(0, 2).forEach((positive, i) => {
      summary += `${i + 1}. ${positive}\n`;
    });
    summary += `\n`;
  }

  summary += `💡 **Next Steps:** Focus on the priority recommendations above and track trends over 1-2 weeks for meaningful insights.`;

  return summary;
}

// Helper functions for interpretation
function getScoreInterpretation(score: number, type: string): string {
  if (score >= 85) return "is excellent and indicates optimal health";
  if (score >= 70) return "is good and within healthy ranges";
  if (score >= 50) return "is moderate and has room for improvement";
  return "is low and requires immediate attention";
}

function getHRVInterpretation(hrv: number): string {
  if (hrv > 45) return "indicates excellent autonomic nervous system health";
  if (hrv > 30) return "is within normal range for most adults";
  if (hrv > 20)
    return "is below average and could benefit from stress reduction";
  return "is quite low and suggests high stress or poor recovery";
}

function getRHRInterpretation(rhr: number): string {
  if (rhr < 60)
    return "is excellent and indicates strong cardiovascular fitness";
  if (rhr < 70) return "is good and within healthy ranges";
  if (rhr < 80)
    return "is acceptable but could be improved with cardio training";
  return "may indicate need for improved cardiovascular fitness or medical attention";
}

function getTrendImplication(trend: string, category: string): string {
  switch (trend) {
    case "up":
      return category === "strain"
        ? "indicating increased training load (monitor recovery closely)"
        : "showing positive improvement (great progress!)";
    case "down":
      return category === "strain"
        ? "indicating reduced training intensity (consider if intentional)"
        : "requiring attention and optimization";
    default:
      return "showing consistent patterns (stability is good)";
  }
}

function getStrainInterpretation(strain: number): string {
  if (strain > 15) return "(high intensity - monitor recovery closely)";
  if (strain > 10) return "(moderate intensity - well balanced)";
  if (strain > 6) return "(light to moderate intensity)";
  return "(low intensity - consider increasing activity)";
}

function getMaxStrainInterpretation(maxStrain: number): string {
  if (maxStrain > 18)
    return "(very high intensity session - ensure adequate recovery)";
  if (maxStrain > 15)
    return "(high intensity workout - good training stimulus)";
  if (maxStrain > 12) return "(moderate intensity session)";
  return "(light intensity workout - consider increasing effort occasionally)";
}

function getWorkoutFrequencyInsight(count: number): string {
  if (count >= 6) return "(excellent frequency for health and longevity)";
  if (count >= 4) return "(good frequency for fitness maintenance)";
  if (count >= 2) return "(moderate activity level - could increase)";
  return "(low activity - consider increasing workout frequency)";
}

function getEfficiencyInterpretation(efficiency: number): string {
  if (efficiency >= 90) return "is excellent";
  if (efficiency >= 85) return "is very good";
  if (efficiency >= 80) return "is good but improvable";
  return "needs improvement";
}

function getSleepDurationInsight(totalInBedTime: number | null): string {
  if (!totalInBedTime) return "Sleep duration data not available";

  const hours = totalInBedTime / (1000 * 60 * 60);
  if (hours >= 8)
    return `Sleep duration (${hours.toFixed(
      1
    )}h) is optimal for recovery and longevity`;
  if (hours >= 7)
    return `Sleep duration (${hours.toFixed(
      1
    )}h) is adequate but could be improved`;
  return `Sleep duration (${hours.toFixed(
    1
  )}h) is insufficient and should be increased`;
}

// Cursor rules applied correctly.
