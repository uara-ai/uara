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
        recoveryScore < 50
          ? "**Priority**: Your recovery is critically low. Take 1-2 complete rest days with only light walking or gentle stretching"
          : recoveryScore < 70
          ? "**Sleep Focus**: Optimize sleep environment - blackout curtains, 65-68°F temperature, consistent 8-hour sleep schedule"
          : "**Maintain**: Your recovery is excellent - continue current sleep and stress management practices",
        hrvRmssd < 20
          ? "**Daily Practice**: Implement 4-7-8 breathing technique: 4 seconds inhale, 7 hold, 8 exhale. Do 4 cycles twice daily"
          : hrvRmssd < 35
          ? "**Stress Management**: Add 10-minute guided meditation using Headspace, Calm, or Waking Up app"
          : "**HRV Optimization**: Your HRV is strong - consider cold exposure (cold showers 2-3x/week) for further improvement",
        restingHR > 65
          ? "**Cardio Base**: Add 2-3 Zone 2 cardio sessions weekly (can maintain conversation while exercising)"
          : "**Recovery Support**: Consider magnesium glycinate 200-400mg before bed (consult healthcare provider first)",
        recoveryTrend === "down"
          ? "**Trend Alert**: Recovery declining - review recent stressors, alcohol intake, and sleep consistency"
          : "**Morning Routine**: Establish consistent wake time and get 10-15 minutes of morning sunlight for circadian rhythm support",
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
        sleepScore < 50
          ? "**Sleep Emergency**: Prioritize 8+ hours sleep opportunity. Set strict bedtime 9 hours before wake time"
          : sleepScore < 75
          ? "**Environment**: Cool (65-68°F), dark (blackout curtains), quiet (earplugs/white noise) bedroom setup"
          : "**Sleep Champion**: Your sleep is optimized - maintain these excellent habits for longevity",
        sleepEfficiency < 75
          ? "**Digital Sunset**: No screens 2 hours before bed. Use blue light glasses if necessary. Read physical books instead"
          : sleepEfficiency < 85
          ? "**Caffeine Cutoff**: No caffeine after 2 PM. Switch to herbal tea (chamomile, passionflower) in evening"
          : "**Sleep Efficiency Master**: Your efficiency is excellent - consider tracking consistency across weekends too",
        sleepTrend === "down"
          ? "**Sleep Hygiene**: Review alcohol intake (affects REM), room temperature, and stress levels before bed"
          : "**Consistency**: Maintain same bedtime/wake time ±30 minutes, even on weekends for circadian health",
        whoopStats.latestSleep?.totalInBedTime &&
        whoopStats.latestSleep.totalInBedTime < 7 * 60 * 60 * 1000
          ? "**Duration**: Increase sleep opportunity to 8 hours minimum. Quality starts with adequate time"
          : "**Wind-down**: Create 30-minute pre-sleep routine: dim lights, gentle stretching, gratitude journaling",
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
        weeklyStrain < 6
          ? "**Build Base**: Gradually increase activity. Add 1-2 Zone 2 cardio sessions (30-45 min) and 2 strength sessions weekly"
          : weeklyStrain > 18
          ? "**Overtraining Risk**: Reduce intensity by 20%. Add extra recovery day and prioritize sleep (8+ hours)"
          : weeklyStrain > 15
          ? "**Recovery Focus**: Excellent strain! Ensure 2 complete rest days weekly with only walking/yoga"
          : "**Optimal Training**: Perfect strain balance - maintain this level for consistent adaptation",
        workoutCount < 3
          ? "**Frequency**: Increase to 4-5 sessions weekly: 2 strength, 2-3 cardio, 1 flexibility/mobility"
          : workoutCount > 6
          ? "**Rest Days**: Mandatory 1-2 complete rest days. Active recovery: gentle yoga, walking, or massage"
          : "**Training Consistency**: Excellent workout frequency for longevity and fitness",
        maxStrain > 20
          ? "**High Intensity**: Great effort! Follow with 24-48h easy recovery. Track HRV for readiness"
          : maxStrain < 12
          ? "**Intensity Boost**: Add 1-2 higher intensity sessions: HIIT (20 min) or strength circuits weekly"
          : "**Strain Variety**: Mix intensities - 80% easy/moderate, 20% hard for optimal adaptation",
        strainTrend === "up"
          ? "**Monitor Recovery**: Increasing strain detected. Watch sleep quality and resting HR closely"
          : "**Strain Balance**: Maintain 2:1 recovery-to-strain ratio. High strain days need extra sleep and nutrition",
      ]
    : [];

  // Calculate overall health score
  const overallHealthScore = Math.round(
    (recoveryScore + sleepScore + Math.min(weeklyStrain * 6, 100)) / 3
  );

  // Generate key recommendations with priority order
  const keyRecommendations = includeRecommendations
    ? [
        // Priority 1: Critical issues first
        recoveryScore < 50 || sleepScore < 50 || weeklyStrain > 18
          ? recoveryScore < 50
            ? recoveryRecommendations[0]
            : sleepScore < 50
            ? sleepRecommendations[0]
            : strainRecommendations[0]
          : null,

        // Priority 2: Sleep optimization (most impactful for longevity)
        sleepScore < 75 || sleepEfficiency < 85
          ? sleepRecommendations[0]
          : null,

        // Priority 3: Recovery enhancement
        recoveryScore < 75 || hrvRmssd < 35 ? recoveryRecommendations[0] : null,

        // Priority 4: Training optimization
        weeklyStrain < 8 || weeklyStrain > 15 || workoutCount < 3
          ? strainRecommendations[0]
          : null,

        // Priority 5: Consistency and habits
        "**Track Trends**: Focus on 7-day averages rather than daily scores. Consistency beats perfection for longevity",

        // Priority 6: Professional guidance
        overallHealthScore < 60
          ? "**Expert Consultation**: Consider working with a longevity-focused physician or certified trainer for personalized optimization"
          : "**Longevity Protocol**: Excellent health metrics! Consider advanced interventions: sauna, cold therapy, or continuous glucose monitoring",
      ]
        .filter((item): item is string => Boolean(item))
        .slice(0, 6)
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
  let summary = `## WHOOP Health Analysis Summary\n\n`;
  summary += `**Overall Health Score: ${overallScore}/100**\n\n`;

  if (overallScore >= 80) {
    summary += `**Excellent Performance!** Your metrics show outstanding health optimization. `;
  } else if (overallScore >= 65) {
    summary += `**Good Health Status** with clear opportunities for improvement. `;
  } else {
    summary += `**Health Attention Needed** - several metrics require optimization. `;
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
    summary += `**Priority Areas (${factors.riskFactors.length}):**\n`;
    factors.riskFactors.slice(0, 2).forEach((risk, i) => {
      summary += `${i + 1}. ${risk}\n`;
    });
    summary += `\n`;
  }

  // Positive indicators
  if (factors.positiveIndicators.length > 0) {
    summary += `**Strengths (${factors.positiveIndicators.length}):**\n`;
    factors.positiveIndicators.slice(0, 2).forEach((positive, i) => {
      summary += `${i + 1}. ${positive}\n`;
    });
    summary += `\n`;
  }

  summary += `**Next Steps:** Focus on the priority recommendations above and track trends over 1-2 weeks for meaningful insights.`;

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
