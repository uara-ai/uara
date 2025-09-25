// This is the markers tracked for the health score.
// Based on these ranges, we can calculate the health score.
import { MarkersConfig } from "./types";

export const markers: MarkersConfig = {
  Nutrition: [
    {
      id: "calories",
      label: "Daily calories (kcal)",
      type: "optimal" as const,
      range: [1500, 1800, 2500, 3500],
    },
    { id: "protein", label: "Protein (g)", type: "higher", range: [50, 180] },
    {
      id: "carbs",
      label: "Carbs (g)",
      type: "optimal" as const,
      range: [100, 150, 300, 450],
    },
    { id: "fat", label: "Fat (g)", type: "optimal", range: [30, 50, 90, 120] },
    {
      id: "fiber",
      label: "Fiber (g)",
      type: "optimal" as const,
      range: [10, 25, 40, 60],
    },
    { id: "sugar", label: "Sugar (g)", type: "lower", range: [0, 50] },
    {
      id: "water",
      label: "Water (L)",
      type: "optimal" as const,
      range: [1.0, 2.0, 3.0, 4.0],
    },
    {
      id: "caffeine",
      label: "Caffeine (mg)",
      type: "optimal" as const,
      range: [0, 50, 200, 400],
    },
    {
      id: "alcohol",
      label: "Alcohol (units/day)",
      type: "lower" as const,
      range: [0, 3],
    },
    {
      id: "eatingWindow",
      label: "Eating window (h)",
      type: "optimal" as const,
      range: [6, 8, 12, 16],
    },
  ],
  SleepRecovery: [
    {
      id: "totalInBedTime",
      label: "Total in bed time (ms)",
      type: "optimal" as const,
      range: [14400000, 25200000, 30600000, 39600000], // 4-11 hours in milliseconds
    },
    {
      id: "sleepEfficiencyPercentage",
      label: "Sleep efficiency percentage",
      type: "higher" as const,
      range: [75, 95],
    },
    {
      id: "totalAwakeTime",
      label: "Total awake time (ms)",
      type: "lower" as const,
      range: [0, 2700000], // 0-45 minutes in milliseconds
    },
    {
      id: "totalRemSleepTime",
      label: "Total REM sleep time (ms)",
      type: "optimal" as const,
      range: [1800000, 3600000, 9000000, 12600000], // 0.5-3.5 hours in milliseconds
    },
    {
      id: "totalSlowWaveSleepTime",
      label: "Total slow wave sleep time (ms)",
      type: "optimal" as const,
      range: [1080000, 2880000, 6480000, 9000000], // 0.3-2.5 hours in milliseconds
    },
    {
      id: "restingHeartRate",
      label: "Resting heart rate (bpm)",
      type: "lower" as const,
      range: [45, 80],
    },
    {
      id: "hrvRmssd",
      label: "HRV RMSSD (ms)",
      type: "higher" as const,
      range: [20, 100],
    },
    {
      id: "sleepConsistencyPercentage",
      label: "Sleep consistency percentage",
      type: "higher" as const,
      range: [70, 95],
    },
    {
      id: "disturbanceCount",
      label: "Disturbance count",
      type: "lower" as const,
      range: [0, 4],
    },
    {
      id: "recoveryScore",
      label: "Recovery score",
      type: "higher" as const,
      range: [0, 100],
    },
    {
      id: "sleepPerformancePercentage",
      label: "Sleep performance percentage",
      type: "higher" as const,
      range: [70, 100],
    },
    {
      id: "respiratoryRate",
      label: "Respiratory rate (breaths/min)",
      type: "optimal" as const,
      range: [12, 16, 20, 25],
    },
  ],
  MovementFitness: [
    {
      id: "strain",
      label: "Daily strain",
      type: "optimal" as const,
      range: [8, 12, 18, 21],
    },
    {
      id: "averageHeartRate",
      label: "Average heart rate (bpm)",
      type: "optimal" as const,
      range: [60, 120, 150, 180],
    },
    {
      id: "maxHeartRate",
      label: "Max heart rate (bpm)",
      type: "optimal" as const,
      range: [140, 160, 185, 200],
    },
    {
      id: "kilojoule",
      label: "Energy expenditure (kJ)",
      type: "higher" as const,
      range: [500, 3000],
    },
    {
      id: "distanceMeters",
      label: "Distance (meters)",
      type: "higher" as const,
      range: [1000, 10000],
    },
    {
      id: "altitudeGainMeters",
      label: "Altitude gain (meters)",
      type: "higher" as const,
      range: [0, 500],
    },
    {
      id: "percentRecorded",
      label: "Data quality (%)",
      type: "higher" as const,
      range: [80, 100],
    },
    {
      id: "sportName",
      label: "Sport activity type",
      type: "ignore" as const,
      range: null,
    },
  ],
  MindStress: [
    { id: "mood", label: "Mood (1–5)", type: "higher", range: [1, 5] },
    { id: "stress", label: "Stress (1–5)", type: "lower", range: [1, 5] },
    {
      id: "strain",
      label: "WHOOP Strain (0–21)",
      type: "optimal",
      range: [0, 8, 16, 21], // Low strain: 0-8 (excellent), Moderate: 8-16 (good), High: 16-21 (fair/poor)
    },
    { id: "energy", label: "Energy (1–5)", type: "higher", range: [1, 5] },
    { id: "focus", label: "Focus (1–5)", type: "higher", range: [1, 5] },
    {
      id: "mindfulness",
      label: "Mindfulness (min)",
      type: "higher" as const,
      range: [0, 60],
    },
    {
      id: "journaling",
      label: "Journaling (words)",
      type: "higher" as const,
      range: [0, 200],
    },
    {
      id: "screenTime",
      label: "Screen time (h)",
      type: "lower" as const,
      range: [2, 8],
    },
    {
      id: "socialQuality",
      label: "Social interaction quality (1–5)",
      type: "higher" as const,
      range: [1, 5],
    },
    {
      id: "gratitude",
      label: "Gratitude (0/1)",
      type: "higher" as const,
      range: [0, 1],
    },
    {
      id: "workloadPerception",
      label: "Workload perception (1–3)",
      type: "lower" as const,
      range: [1, 3],
    },
  ],
  HealthChecks: [
    { id: "weight", label: "Weight (kg)", type: "ignore", range: null },
    { id: "bmi", label: "BMI", type: "optimal", range: [16, 20.5, 24.9, 35] },
    {
      id: "waistCircumference",
      label: "Waist circumference (cm)",
      type: "lower" as const,
      range: [70, 100],
    },
    {
      id: "bodyFat",
      label: "Body fat %",
      type: "optimal" as const,
      range: [10, 15, 20, 28],
    },
    {
      id: "bloodPressureSys",
      label: "Blood pressure SYS (mmHg)",
      type: "optimal" as const,
      range: [95, 105, 120, 140],
    },
    {
      id: "bloodPressureDia",
      label: "Blood pressure DIA (mmHg)",
      type: "optimal" as const,
      range: [60, 65, 80, 90],
    },
    {
      id: "fastingGlucose",
      label: "Fasting glucose (mg/dL)",
      type: "lower" as const,
      range: [70, 110],
    },
    { id: "hba1c", label: "HbA1c (%)", type: "lower", range: [4.8, 5.6] },
    { id: "ldl", label: "LDL (mg/dL)", type: "lower", range: [50, 130] },
    { id: "hdl", label: "HDL (mg/dL)", type: "higher", range: [40, 80] },
    {
      id: "triglycerides",
      label: "Triglycerides (mg/dL)",
      type: "lower" as const,
      range: [50, 200],
    },
    {
      id: "totalCholesterol",
      label: "Total cholesterol (mg/dL)",
      type: "optimal" as const,
      range: [120, 150, 200, 240],
    },
    { id: "crp", label: "CRP (mg/L)", type: "lower", range: [0.1, 3.0] },
    {
      id: "vitaminD",
      label: "Vitamin D (ng/mL)",
      type: "optimal" as const,
      range: [20, 30, 50, 80],
    },
  ],
};
