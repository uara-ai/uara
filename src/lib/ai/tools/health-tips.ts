import { tool } from "ai";
import { z } from "zod";
import { getCurrentUser } from "@/lib/ai/context";

// Schema for health tips analysis
const healthTipsSchema = z.object({
  healthStats: z
    .object({
      sleep: z.object({
        performance: z
          .number()
          .min(0)
          .max(100)
          .describe("Sleep performance percentage"),
        efficiency: z
          .number()
          .min(0)
          .max(100)
          .describe("Sleep efficiency percentage"),
        duration: z.number().min(0).max(12).describe("Sleep duration in hours"),
        consistency: z
          .number()
          .min(0)
          .max(100)
          .describe("Sleep consistency score"),
      }),
      recovery: z.object({
        score: z.number().min(0).max(100).describe("Recovery score percentage"),
        hrv: z
          .number()
          .min(0)
          .max(100)
          .describe("HRV (Heart Rate Variability) score"),
        restingHR: z
          .number()
          .min(40)
          .max(120)
          .describe("Resting heart rate in BPM"),
        trend: z
          .enum(["improving", "stable", "declining"])
          .describe("Recovery trend"),
      }),
      strain: z.object({
        daily: z.number().min(0).max(21).describe("Daily strain score"),
        weekly: z.number().min(0).max(21).describe("Weekly average strain"),
        balance: z
          .enum(["under", "optimal", "over"])
          .describe("Strain balance assessment"),
        workoutFrequency: z
          .number()
          .min(0)
          .max(14)
          .describe("Workouts per week"),
      }),
      overall: z.object({
        healthScore: z
          .number()
          .min(0)
          .max(100)
          .describe("Overall health score"),
        streak: z
          .number()
          .min(0)
          .max(365)
          .describe("Current health streak in days"),
        memberSince: z.string().describe("Member since date for context"),
      }),
    })
    .describe("Current health statistics to analyze"),
  focusArea: z
    .enum(["sleep", "recovery", "strain", "overall", "all"])
    .default("all")
    .describe("Specific area to focus tips on"),
  urgency: z
    .enum(["low", "medium", "high"])
    .default("medium")
    .describe("Urgency level for recommendations"),
});

export interface HealthTip {
  category:
    | "sleep"
    | "recovery"
    | "strain"
    | "nutrition"
    | "exercise"
    | "lifestyle";
  title: string;
  description: string;
  action: string;
  priority: "low" | "medium" | "high";
  timeframe: "immediate" | "daily" | "weekly" | "monthly";
  impact: "minor" | "moderate" | "significant";
  difficulty: "easy" | "moderate" | "challenging";
  statImpact: {
    sleep?: number;
    recovery?: number;
    strain?: number;
  };
}

export interface HealthTipsResult {
  overallAssessment: {
    score: number;
    status: "critical" | "needs_attention" | "good" | "excellent";
    primaryConcern: string;
    strengths: string[];
  };
  tips: HealthTip[];
  quickWins: HealthTip[];
  longTermGoals: HealthTip[];
  summary: string;
}

export const analyzeHealthTips = tool({
  description: `Generate personalized health tips and actionable recommendations based on wearable and health data analysis. 
  This tool analyzes sleep, recovery, strain, and overall health metrics to provide specific, evidence-based tips for optimization.
  Perfect for daily health coaching and longevity guidance.`,

  inputSchema: healthTipsSchema,

  execute: async ({ healthStats, focusArea, urgency }) => {
    try {
      const user = getCurrentUser();

      // Analyze current health state
      const analysis = analyzeHealthState(healthStats, urgency);

      // Generate personalized tips
      const tips = generatePersonalizedTips(
        healthStats,
        focusArea,
        urgency,
        analysis
      );

      // Categorize tips by timeframe
      const quickWins = tips
        .filter(
          (tip) => tip.timeframe === "immediate" || tip.timeframe === "daily"
        )
        .slice(0, 3);
      const longTermGoals = tips
        .filter(
          (tip) => tip.timeframe === "weekly" || tip.timeframe === "monthly"
        )
        .slice(0, 3);

      const result: HealthTipsResult = {
        overallAssessment: analysis,
        tips,
        quickWins,
        longTermGoals,
        summary: generateSummary(analysis, tips, user.fullName),
      };

      return {
        success: true,
        data: result,
        message: `Generated ${tips.length} personalized health tips for ${user.fullName}`,
      };
    } catch (error) {
      console.error("Error analyzing health tips:", error);
      return {
        success: false,
        error: "Failed to generate health tips. Please try again.",
        data: null,
      };
    }
  },
});

function analyzeHealthState(stats: any, urgency: string) {
  const { sleep, recovery, strain, overall } = stats;

  // Calculate weighted overall score
  const weightedScore =
    sleep.performance * 0.3 +
    recovery.score * 0.35 +
    (strain.balance === "optimal" ? 85 : strain.balance === "over" ? 60 : 70) *
      0.25 +
    overall.healthScore * 0.1;

  // Determine status
  let status: "critical" | "needs_attention" | "good" | "excellent";
  if (weightedScore < 50) status = "critical";
  else if (weightedScore < 70) status = "needs_attention";
  else if (weightedScore < 85) status = "good";
  else status = "excellent";

  // Identify primary concern
  let primaryConcern = "Overall health optimization";
  if (sleep.performance < 60)
    primaryConcern = "Sleep quality requires immediate attention";
  else if (recovery.score < 50)
    primaryConcern = "Recovery optimization is critical";
  else if (strain.balance === "over")
    primaryConcern = "Training load management needed";
  else if (strain.balance === "under")
    primaryConcern = "Activity level could be increased";

  // Identify strengths
  const strengths: string[] = [];
  if (sleep.performance > 80) strengths.push("Excellent sleep performance");
  if (recovery.score > 75) strengths.push("Strong recovery patterns");
  if (strain.balance === "optimal")
    strengths.push("Well-balanced training load");
  if (sleep.consistency > 85) strengths.push("Consistent sleep schedule");
  if (overall.streak > 7) strengths.push(`${overall.streak}-day health streak`);

  return {
    score: Math.round(weightedScore),
    status,
    primaryConcern,
    strengths,
  };
}

function generatePersonalizedTips(
  stats: any,
  focusArea: string,
  urgency: string,
  analysis: any
): HealthTip[] {
  const { sleep, recovery, strain } = stats;
  const tips: HealthTip[] = [];

  // Sleep Tips
  if (focusArea === "sleep" || focusArea === "all") {
    if (sleep.performance < 70) {
      tips.push({
        category: "sleep",
        title: "Optimize Sleep Environment",
        description:
          "Your sleep performance is below optimal. Environmental factors significantly impact sleep quality.",
        action:
          "Set bedroom temperature to 65-68°F, use blackout curtains, and eliminate blue light 2 hours before bed",
        priority: sleep.performance < 50 ? "high" : "medium",
        timeframe: "immediate",
        impact: "significant",
        difficulty: "easy",
        statImpact: { sleep: 15 },
      });
    }

    if (sleep.duration < 7.5) {
      tips.push({
        category: "sleep",
        title: "Extend Sleep Duration",
        description: `At ${sleep.duration.toFixed(
          1
        )} hours, you're not getting adequate sleep for optimal recovery.`,
        action:
          "Gradually move bedtime 15 minutes earlier each night until reaching 8+ hours sleep opportunity",
        priority: "high",
        timeframe: "daily",
        impact: "significant",
        difficulty: "moderate",
        statImpact: { sleep: 20, recovery: 10 },
      });
    }

    if (sleep.consistency < 75) {
      tips.push({
        category: "sleep",
        title: "Establish Sleep Consistency",
        description:
          "Irregular sleep patterns disrupt your circadian rhythm and impact recovery.",
        action:
          "Set the same bedtime and wake time every day, including weekends (±30 minutes maximum)",
        priority: "medium",
        timeframe: "daily",
        impact: "moderate",
        difficulty: "moderate",
        statImpact: { sleep: 12, recovery: 8 },
      });
    }
  }

  // Recovery Tips
  if (focusArea === "recovery" || focusArea === "all") {
    if (recovery.score < 60) {
      tips.push({
        category: "recovery",
        title: "Implement Stress Management",
        description:
          "Low recovery often indicates elevated stress levels affecting your autonomic nervous system.",
        action:
          "Practice 4-7-8 breathing: 4 sec inhale, 7 sec hold, 8 sec exhale. Do 4 cycles twice daily",
        priority: "high",
        timeframe: "immediate",
        impact: "significant",
        difficulty: "easy",
        statImpact: { recovery: 18 },
      });
    }

    if (recovery.hrv < 30) {
      tips.push({
        category: "recovery",
        title: "Boost HRV with Cold Exposure",
        description:
          "Low HRV suggests poor autonomic balance. Cold exposure can improve stress resilience.",
        action:
          "Take 30-60 second cold shower 3x per week, or end regular showers with 30 seconds of cold water",
        priority: "medium",
        timeframe: "weekly",
        impact: "moderate",
        difficulty: "challenging",
        statImpact: { recovery: 12 },
      });
    }

    if (recovery.restingHR > 65) {
      tips.push({
        category: "recovery",
        title: "Build Aerobic Base",
        description:
          "Elevated resting heart rate may indicate need for better cardiovascular fitness.",
        action:
          "Add 2-3 Zone 2 cardio sessions weekly (can hold conversation while exercising) for 30-45 minutes",
        priority: "medium",
        timeframe: "weekly",
        impact: "significant",
        difficulty: "moderate",
        statImpact: { recovery: 10, strain: 5 },
      });
    }

    if (recovery.trend === "declining") {
      tips.push({
        category: "lifestyle",
        title: "Review Lifestyle Stressors",
        description:
          "Your recovery trend is declining. Time to audit potential stressors.",
        action:
          "Limit alcohol to <2 drinks per week, reduce caffeine after 2 PM, and review work-life boundaries",
        priority: "high",
        timeframe: "daily",
        impact: "significant",
        difficulty: "moderate",
        statImpact: { recovery: 15, sleep: 8 },
      });
    }
  }

  // Strain & Training Tips
  if (focusArea === "strain" || focusArea === "all") {
    if (strain.balance === "under") {
      tips.push({
        category: "exercise",
        title: "Increase Training Volume",
        description:
          "Your strain levels suggest you could handle more training stress for better fitness gains.",
        action:
          "Add 1-2 additional training sessions per week: focus on strength training or moderate cardio",
        priority: "medium",
        timeframe: "weekly",
        impact: "moderate",
        difficulty: "moderate",
        statImpact: { strain: 8 },
      });
    }

    if (strain.balance === "over") {
      tips.push({
        category: "recovery",
        title: "Prioritize Active Recovery",
        description:
          "High strain levels require intentional recovery to prevent overtraining.",
        action:
          "Schedule 2 complete rest days per week with only light walking, yoga, or stretching",
        priority: "high",
        timeframe: "weekly",
        impact: "significant",
        difficulty: "easy",
        statImpact: { recovery: 12, strain: -5 },
      });
    }

    if (strain.workoutFrequency < 3) {
      tips.push({
        category: "exercise",
        title: "Increase Workout Frequency",
        description:
          "Regular exercise is crucial for longevity and metabolic health.",
        action:
          "Aim for 4-5 workouts per week: 2 strength sessions, 2-3 cardio sessions, 1 flexibility/mobility",
        priority: "medium",
        timeframe: "weekly",
        impact: "significant",
        difficulty: "moderate",
        statImpact: { strain: 10 },
      });
    }

    if (strain.workoutFrequency > 6) {
      tips.push({
        category: "recovery",
        title: "Schedule Recovery Days",
        description:
          "High workout frequency requires planned recovery to prevent burnout.",
        action:
          "Limit workouts to 5-6 per week maximum, with at least 1-2 complete rest days",
        priority: "high",
        timeframe: "weekly",
        impact: "moderate",
        difficulty: "easy",
        statImpact: { recovery: 10 },
      });
    }
  }

  // Nutrition Tips (general longevity focus)
  if (focusArea === "all") {
    if (recovery.score < 70 || sleep.performance < 75) {
      tips.push({
        category: "nutrition",
        title: "Optimize Recovery Nutrition",
        description:
          "Poor recovery may be linked to nutritional deficiencies affecting sleep and stress response.",
        action:
          "Take magnesium glycinate (200-400mg) before bed, ensure adequate protein (0.8g/lb bodyweight)",
        priority: "medium",
        timeframe: "daily",
        impact: "moderate",
        difficulty: "easy",
        statImpact: { recovery: 8, sleep: 6 },
      });
    }

    tips.push({
      category: "nutrition",
      title: "Time-Restricted Eating",
      description:
        "Optimize metabolic health and sleep quality through meal timing.",
      action:
        "Finish eating 3 hours before bedtime and consider 12-hour eating window (e.g., 8 AM - 8 PM)",
      priority: "low",
      timeframe: "daily",
      impact: "moderate",
      difficulty: "moderate",
      statImpact: { sleep: 5, recovery: 5 },
    });
  }

  // Lifestyle optimization
  if (analysis.status === "good" || analysis.status === "excellent") {
    tips.push({
      category: "lifestyle",
      title: "Advanced Longevity Protocol",
      description:
        "Your metrics are strong - consider advanced interventions for optimization.",
      action:
        "Explore sauna (15-20 min, 3x/week), consider continuous glucose monitoring, or work with longevity physician",
      priority: "low",
      timeframe: "monthly",
      impact: "minor",
      difficulty: "challenging",
      statImpact: { recovery: 5 },
    });
  }

  // Sort by priority and impact
  return tips
    .sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const impactWeight = { significant: 3, moderate: 2, minor: 1 };

      const scoreA = priorityWeight[a.priority] + impactWeight[a.impact];
      const scoreB = priorityWeight[b.priority] + impactWeight[b.impact];

      return scoreB - scoreA;
    })
    .slice(0, 8); // Limit to top 8 tips
}

function generateSummary(
  analysis: any,
  tips: HealthTip[],
  userName: string
): string {
  const topTip = tips[0];
  const highPriorityCount = tips.filter((t) => t.priority === "high").length;

  let summary = `## Health Optimization Summary for ${userName}\n\n`;
  summary += `**Overall Score: ${
    analysis.score
  }/100** (${analysis.status.replace("_", " ")})\n\n`;

  if (analysis.status === "critical") {
    summary += `**Immediate Action Required**: ${analysis.primaryConcern}\n\n`;
  } else if (analysis.status === "needs_attention") {
    summary += `**Optimization Needed**: ${analysis.primaryConcern}\n\n`;
  } else {
    summary += `**Good Foundation**: ${analysis.primaryConcern}\n\n`;
  }

  if (topTip) {
    summary += `**Priority Action**: ${topTip.action}\n\n`;
  }

  if (analysis.strengths.length > 0) {
    summary += `**Your Strengths**:\n`;
    analysis.strengths.forEach((strength: string) => {
      summary += `• ${strength}\n`;
    });
    summary += `\n`;
  }

  if (highPriorityCount > 0) {
    summary += `**Focus Areas**: ${highPriorityCount} high-priority recommendations identified for immediate improvement.\n\n`;
  }

  summary += `**Next Steps**: Start with the immediate actions and track progress over 1-2 weeks for meaningful results.`;

  return summary;
}

// Cursor rules applied correctly.
