import type {
  WhoopDataResponse,
  WhoopStats,
} from "@/actions/whoop-data-action";

/**
 * Health data context for AI tools
 * This context provides comprehensive health information to AI tools
 * for personalized health insights and recommendations
 */
export interface ToolContext {
  // User demographics and basic health profile
  user: {
    id: string;
    age?: number; // Calculated from dateOfBirth
    gender?: string;
    ethnicity?: string;
    heightCm?: number;
    weightKg?: number;
    bmi?: number; // Calculated from height and weight
    bloodType?: string;

    // Medical history (JSON strings in database)
    medicalConditions?: string[];
    allergies?: string[];
    medications?: string[];

    // Profile completion status
    profileCompleted: boolean;

    // Consent status for data processing
    dataProcessingConsent: boolean;
    researchConsent: boolean;
  };

  // WHOOP wearable data (current primary data source)
  whoop?: {
    // User profile from WHOOP
    user: {
      firstName?: string;
      lastName?: string;
      email?: string;
      heightMeter?: number;
      weightKilogram?: number;
      maxHeartRate?: number;
      lastSyncAt?: Date;
    };

    // Processed WHOOP data
    data: WhoopDataResponse;

    // Calculated statistics and trends
    stats: WhoopStats;

    // Recent trends and insights
    insights: {
      // Recovery insights
      recoveryTrend: "improving" | "declining" | "stable";
      avgRecoveryScore?: number;
      recoveryVariability?: number;

      // Sleep insights
      sleepTrend: "improving" | "declining" | "stable";
      avgSleepEfficiency?: number;
      avgSleepDuration?: number;
      sleepConsistency?: number;

      // Activity insights
      strainTrend: "increasing" | "decreasing" | "stable";
      avgDailyStrain?: number;
      workoutFrequency?: number;

      // HRV insights
      hrvTrend: "improving" | "declining" | "stable";
      avgHRV?: number;
      hrvVariability?: number;

      // Heart rate insights
      restingHRTrend: "improving" | "declining" | "stable";
      avgRestingHR?: number;
    };
  };

  // Lab results and biomarkers (future expansion)
  labs?: {
    // Most recent lab panel
    latest?: {
      date: Date;
      results: LabResult[];
    };

    // Historical lab trends
    history: LabPanel[];

    // Key biomarker trends
    trends: {
      // Metabolic markers
      glucose?: BiomarkerTrend;
      hba1c?: BiomarkerTrend;
      insulin?: BiomarkerTrend;

      // Lipid panel
      totalCholesterol?: BiomarkerTrend;
      ldl?: BiomarkerTrend;
      hdl?: BiomarkerTrend;
      triglycerides?: BiomarkerTrend;

      // Inflammatory markers
      crp?: BiomarkerTrend;
      esr?: BiomarkerTrend;

      // Hormonal markers
      testosterone?: BiomarkerTrend;
      cortisol?: BiomarkerTrend;
      thyroidPanel?: {
        tsh?: BiomarkerTrend;
        t3?: BiomarkerTrend;
        t4?: BiomarkerTrend;
      };

      // Nutritional markers
      vitaminD?: BiomarkerTrend;
      b12?: BiomarkerTrend;
      folate?: BiomarkerTrend;

      // Longevity markers
      igf1?: BiomarkerTrend;
      dheas?: BiomarkerTrend;

      // Kidney function
      creatinine?: BiomarkerTrend;
      bun?: BiomarkerTrend;

      // Liver function
      alt?: BiomarkerTrend;
      ast?: BiomarkerTrend;
    };
  };

  // Nutrition data (future expansion)
  nutrition?: {
    // Current dietary preferences/restrictions
    preferences: {
      diet?:
        | "omnivore"
        | "vegetarian"
        | "vegan"
        | "keto"
        | "paleo"
        | "mediterranean"
        | "other";
      restrictions?: string[];
      allergies?: string[];
    };

    // Recent nutrition tracking data
    recentIntake?: {
      calories?: number;
      macros?: {
        protein: number;
        carbs: number;
        fat: number;
      };
      micronutrients?: Record<string, number>;
      hydration?: number;
    };

    // Nutrition trends and patterns
    trends?: {
      calorieConsistency?: number;
      proteinAdequacy?: number;
      micronutrientScore?: number;
      mealTiming?: string[];
    };
  };

  // Exercise and movement data (beyond WHOOP workouts)
  exercise?: {
    // Exercise preferences and goals
    preferences: {
      activities?: string[];
      goals?: string[];
      experience?: "beginner" | "intermediate" | "advanced";
    };

    // Recent activity summary
    recentActivity?: {
      weeklyMinutes?: number;
      strengthSessions?: number;
      cardioSessions?: number;
      flexibilitySessions?: number;
    };

    // Movement patterns
    patterns?: {
      dailySteps?: number;
      sedentaryTime?: number;
      activeTime?: number;
    };
  };

  // Environmental and lifestyle factors
  lifestyle?: {
    // Sleep environment and habits
    sleep?: {
      bedtime?: string;
      wakeTime?: string;
      environment?: {
        temperature?: number;
        darkness?: boolean;
        noise?: boolean;
      };
    };

    // Stress and mental health
    stress?: {
      level?: "low" | "moderate" | "high";
      sources?: string[];
      managementTechniques?: string[];
    };

    // Work and life factors
    work?: {
      schedule?: "regular" | "shift" | "flexible";
      physicalDemands?: "low" | "moderate" | "high";
      mentalDemands?: "low" | "moderate" | "high";
    };

    // Social and environmental
    social?: {
      supportSystem?: "strong" | "moderate" | "weak";
      socialActivity?: "high" | "moderate" | "low";
    };
  };

  // Supplement and medication tracking
  supplements?: {
    current: Supplement[];
    history: SupplementHistory[];

    // Effectiveness tracking
    effects?: Record<
      string,
      {
        metric: string;
        change: number;
        confidence: number;
      }
    >;
  };

  // Health goals and objectives
  goals?: {
    primary: HealthGoal[];
    secondary?: HealthGoal[];

    // Progress tracking
    progress?: Record<
      string,
      {
        target: number;
        current: number;
        timeline: string;
        status: "on-track" | "behind" | "ahead";
      }
    >;
  };

  // Calculated health scores and indices
  scores?: {
    // Overall health score (composite)
    overall?: number;

    // Domain-specific scores
    cardiovascular?: number;
    metabolic?: number;
    sleep?: number;
    recovery?: number;
    stress?: number;
    nutrition?: number;

    // Longevity-specific metrics
    biologicalAge?: number;
    ageingPace?: number;
    healthspan?: number;
  };

  // Data freshness and reliability indicators
  metadata: {
    lastUpdated: Date;
    dataCompleteness: number; // 0-100%
    reliability: number; // 0-100%
    sources: string[];

    // User engagement metrics
    engagement: {
      dataUploadFrequency?: "daily" | "weekly" | "monthly" | "rarely";
      lastActivity?: Date;
      goalAdherence?: number;
    };
  };
}

// Supporting types for future expansion

interface LabResult {
  name: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
  };
  status: "low" | "normal" | "high" | "critical";
  flag?: string;
}

interface LabPanel {
  date: Date;
  provider?: string;
  results: LabResult[];
  notes?: string;
}

interface BiomarkerTrend {
  current: number;
  previous?: number;
  trend: "improving" | "declining" | "stable";
  change?: number;
  percentChange?: number;
  significance: "significant" | "moderate" | "minimal";
}

interface Supplement {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  purpose: string[];
  brand?: string;
  timing?: string;
}

interface SupplementHistory {
  supplement: Supplement;
  duration: number; // days
  adherence: number; // 0-100%
  effects?: string[];
  sideEffects?: string[];
  stopped?: {
    date: Date;
    reason: string;
  };
}

interface HealthGoal {
  id: string;
  category:
    | "weight"
    | "fitness"
    | "sleep"
    | "nutrition"
    | "recovery"
    | "biomarker"
    | "lifestyle";
  description: string;
  target: {
    value: number;
    unit: string;
    timeline: string;
  };
  current?: number;
  priority: "high" | "medium" | "low";
  startDate: Date;
  targetDate: Date;
  status: "active" | "completed" | "paused" | "abandoned";
}

// Utility functions for context processing

export function calculateAge(dateOfBirth?: Date): number | undefined {
  if (!dateOfBirth) return undefined;

  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function calculateBMI(
  heightCm?: number,
  weightKg?: number
): number | undefined {
  if (!heightCm || !weightKg) return undefined;

  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function parseJsonField<T>(jsonString?: string | null): T[] {
  if (!jsonString) return [];

  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function calculateDataCompleteness(context: ToolContext): number {
  let totalFields = 0;
  let filledFields = 0;

  // Count user profile fields
  const userFields = ["age", "gender", "heightCm", "weightKg", "bloodType"];
  userFields.forEach((field) => {
    totalFields++;
    if (context.user[field as keyof typeof context.user]) filledFields++;
  });

  // Count WHOOP data availability
  if (context.whoop) {
    totalFields += 3;
    if (context.whoop.data.recovery.length > 0) filledFields++;
    if (context.whoop.data.sleep.length > 0) filledFields++;
    if (context.whoop.data.cycles.length > 0) filledFields++;
  }

  // Add more data source checks as they become available

  return Math.round((filledFields / totalFields) * 100);
}

// Cursor rules applied correctly.
