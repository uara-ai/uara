import { analyzeWhoopData } from "./analyze-whoop-data";
import { analyzeBurnRateTool } from "./burn-rate";
import { analyzeWhoopRecoveryTool } from "./whoop-recovery";
import { analyzeWhoopSleepTool } from "./whoop-sleep";
import { analyzeWhoopStrainTool } from "./whoop-strain";
import { analyzeWhoopWorkoutTool } from "./whoop-workout";

export function tools() {
  return {
    analyzeWhoopData,
    analyzeBurnRate: analyzeBurnRateTool,
    analyzeWhoopRecovery: analyzeWhoopRecoveryTool,
    analyzeWhoopSleep: analyzeWhoopSleepTool,
    analyzeWhoopStrain: analyzeWhoopStrainTool,
    analyzeWhoopWorkout: analyzeWhoopWorkoutTool,
  };
}

// Cursor rules applied correctly.
