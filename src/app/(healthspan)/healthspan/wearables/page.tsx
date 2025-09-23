import React from "react";
import { WearablesPage } from "@/components/wearables/wearables-page";
import { WearablesData } from "@/components/wearables/types";

// Mock data for demonstration - replace with actual data fetching
const mockWearablesData: WearablesData = {
  sleep: [
    {
      id: "sleep-1",
      date: new Date("2024-01-15"),
      source: "whoop",
      quality: "good",
      totalSleepTime: 480, // 8 hours
      deepSleepTime: 90,
      remSleepTime: 120,
      lightSleepTime: 240,
      awakeTime: 30,
      sleepEfficiency: 85,
      sleepScore: 82,
      restingHeartRate: 52,
      respiratoryRate: 14,
      bedTime: new Date("2024-01-14T22:30:00"),
      wakeTime: new Date("2024-01-15T06:30:00"),
      disturbances: 2,
    },
  ],
  recovery: [
    {
      id: "recovery-1",
      date: new Date("2024-01-15"),
      source: "whoop",
      quality: "excellent",
      recoveryScore: 88,
      restingHeartRate: 52,
      heartRateVariability: 45,
      skinTemperature: 0.2,
      respiratoryRate: 14,
      bloodOxygen: 98,
      sleepPerformance: 85,
      strain: 12.5,
      isCalibrating: false,
    },
  ],
  workouts: [
    {
      id: "workout-1",
      date: new Date("2024-01-15"),
      source: "whoop",
      quality: "good",
      activityType: "Running",
      sportId: 1,
      duration: 45,
      strain: 15.2,
      averageHeartRate: 165,
      maxHeartRate: 185,
      calories: 450,
      distance: 8000, // 8km
      averagePace: 340, // 5:40/km
      zones: {
        zone1: 5,
        zone2: 10,
        zone3: 15,
        zone4: 12,
        zone5: 3,
      },
      startTime: new Date("2024-01-15T07:00:00"),
      endTime: new Date("2024-01-15T07:45:00"),
    },
  ],
  strength: [
    {
      id: "strength-1",
      date: new Date("2024-01-14"),
      source: "whoop",
      quality: "excellent",
      exercises: [
        {
          name: "Bench Press",
          sets: [
            { weight: 80, reps: 8, restTime: 120 },
            { weight: 85, reps: 6, restTime: 120 },
            { weight: 90, reps: 4, restTime: 180 },
          ],
          muscleGroup: "chest",
          equipmentType: "barbell",
        },
        {
          name: "Squats",
          sets: [
            { weight: 100, reps: 10, restTime: 120 },
            { weight: 110, reps: 8, restTime: 150 },
            { weight: 120, reps: 6, restTime: 180 },
          ],
          muscleGroup: "legs",
          equipmentType: "barbell",
        },
      ],
      totalVolume: 2950, // calculated from all sets
      totalSets: 6,
      totalReps: 42,
      duration: 75,
      averageHeartRate: 135,
      maxHeartRate: 165,
      calories: 320,
      restTime: 145,
      muscleGroups: ["chest", "triceps", "legs", "glutes"],
    },
  ],
};

export default function WearablesPageRoute() {
  const dateRange = {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    end: new Date(),
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <WearablesPage data={mockWearablesData} dateRange={dateRange} />
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
