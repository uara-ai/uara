import React from "react";
import { HealthspanPage } from "@/components/healthspan/v1/healthspan/healthspan-page";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { computeHealthScores } from "@/lib/health/score";
import { markers } from "@/lib/health/markers";
import { MarkerValues } from "@/lib/health/types";

export const dynamic = "force-dynamic";

export default async function HealthspanPageRoute() {
  // Fetch user data with authentication check
  const user = await withAuth({ ensureSignedIn: true });

  // Mock Whoop data - replace with actual data fetching later
  const whoopData = {
    sleepPerformance: 87,
    recoveryScore: 72,
    strainScore: 14.2,
  };

  // Sample health data - this would come from user's actual data in production
  const healthData: MarkerValues = {
    // Nutrition
    calories: 2300,
    protein: 120,
    carbs: 240,
    fat: 80,
    fiber: 28,
    sugar: 35,
    water: 2.4,
    caffeine: 180,
    alcohol: 0,
    eatingWindow: 11,

    // Sleep & Recovery
    totalInBedTime: 27360000, // 7.6 hours in milliseconds
    sleepEfficiencyPercentage: 90,
    totalAwakeTime: 1200000, // 20 minutes in milliseconds
    totalRemSleepTime: 6120000, // 1.7 hours in milliseconds
    totalSlowWaveSleepTime: 3960000, // 1.1 hours in milliseconds
    restingHeartRate: 58,
    hrvRmssd: 55,
    sleepConsistencyPercentage: 85,
    disturbanceCount: 1,
    recoveryScore: 74,
    sleepPerformancePercentage: 88,
    respiratoryRate: 16,

    // Movement & Fitness
    strain: 14.2,
    averageHeartRate: 145,
    maxHeartRate: 175,
    kilojoule: 2600,
    distanceMeters: 5000,
    altitudeGainMeters: 100,
    percentRecorded: 95,

    // Mind & Stress
    mood: 4,
    stress: 2,
    energy: 4,
    focus: 4,
    mindfulness: 12,
    journaling: 80,
    screenTime: 3.5,
    socialQuality: 4,
    gratitude: 1,
    workloadPerception: 2,

    // Health Checks
    bmi: 23.4,
    waistCircumference: 86,
    bodyFat: 18,
    bloodPressureSys: 118,
    bloodPressureDia: 76,
    fastingGlucose: 90,
    hba1c: 5.2,
    ldl: 95,
    hdl: 55,
    triglycerides: 110,
    totalCholesterol: 185,
    crp: 0.7,
    vitaminD: 34,
  };

  // Calculate health scores
  const healthScores = computeHealthScores(markers, healthData);

  return (
    <HealthspanPage
      user={user.user}
      whoopData={whoopData}
      healthScores={healthScores}
    />
  );
}

// Cursor rules applied correctly.
