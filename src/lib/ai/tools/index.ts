import { analyzeWhoopData } from "./analyze-whoop-data";
import { analyzeBurnRateTool } from "./burn-rate";
import { analyzeWhoopRecoveryTool } from "./whoop-recovery";
import { analyzeWhoopSleepTool } from "./whoop-sleep";
import { analyzeWhoopStrainTool } from "./whoop-strain";
import { analyzeWhoopWorkoutTool } from "./whoop-workout";
import {
  autoWhoopRecoveryTool,
  autoWhoopSleepTool,
  autoWhoopStrainTool,
  autoWhoopWorkoutTool,
} from "./whoop-auto-analysis";

export function tools() {
  return {
    analyzeWhoopData,
    analyzeBurnRate: analyzeBurnRateTool,
    // Auto WHOOP tools (with automatic data fetching)
    analyzeWhoopRecovery: autoWhoopRecoveryTool,
    analyzeWhoopSleep: autoWhoopSleepTool,
    analyzeWhoopStrain: autoWhoopStrainTool,
    analyzeWhoopWorkout: autoWhoopWorkoutTool,
    // Manual WHOOP tools (require manual data input)
    analyzeWhoopRecoveryManual: analyzeWhoopRecoveryTool,
    analyzeWhoopSleepManual: analyzeWhoopSleepTool,
    analyzeWhoopStrainManual: analyzeWhoopStrainTool,
    analyzeWhoopWorkoutManual: analyzeWhoopWorkoutTool,
  };
}

// Cursor rules applied correctly.
