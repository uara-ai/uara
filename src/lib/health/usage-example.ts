// 1) Import your config (the JSON with ids/types/ranges you already have)
import { markers } from "./markers";
import { computeHealthScores } from "./score";

// 2) Provide today's values (keyed by marker id). Missing ones can be omitted.
const today: Record<string, number> = {
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
  totalInBedTime: 27360000, // 7.6 hours in milliseconds
  sleepEfficiencyPercentage: 90,
  totalAwakeTime: 1200000, // 20 minutes in milliseconds
  totalRemSleepTime: 6120000, // 1.7 hours in milliseconds
  totalSlowWaveSleepTime: 3960000, // 1.1 hours in milliseconds
  restingHeartRate: 58,
  hrvRmssd: 55,
  sleepConsistencyPercentage: 85, // converted from std dev to percentage
  disturbanceCount: 1,
  recoveryScore: 74,
  sleepPerformancePercentage: 88,
  respiratoryRate: 16,
  averageHeartRate: 145,
  maxHeartRate: 175,
  kilojoule: 2600,
  distanceMeters: 5000,
  altitudeGainMeters: 100,
  percentRecorded: 95,
  mood: 4,
  stress: 2,
  strain: 14.2, // WHOOP strain data integrated into stress category
  energy: 4,
  focus: 4,
  mindfulness: 12,
  journaling: 80,
  screenTime: 3.5,
  socialQuality: 4,
  gratitude: 1,
  workloadPerception: 2,
  // HealthChecks:
  // weight is ignored
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

// 3) Compute
const result = computeHealthScores(markers, today);

console.log("Overall:", result.overall.toFixed(2));
console.log("Categories:", result.category);
console.table(result.perMarker.slice(0, 50)); // preview first 50
