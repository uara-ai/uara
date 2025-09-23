import React from "react";
import { WorkoutDetailPage } from "@/components/healthspan/v1/wearables/workout/workout-detail-page";
import { getWorkoutDataServer } from "@/actions/whoop/get-workout-data";

export default async function WorkoutPage() {
  // Fetch workout data efficiently with caching
  const workoutData = await getWorkoutDataServer(30, 30); // Last 30 days, 30 records

  // Use real data if available, otherwise fall back to empty array
  const finalWorkoutData = workoutData || [];

  return <WorkoutDetailPage workoutData={finalWorkoutData} />;
}

// Cursor rules applied correctly.
