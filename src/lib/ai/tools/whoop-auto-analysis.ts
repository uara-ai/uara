import { tool } from "ai";
import { z } from "zod";
import { getWhoopAnalysisDataAction } from "@/actions/whoop-analysis-action";

// Auto WHOOP Recovery Analysis Tool
export const autoWhoopRecoveryTool = tool({
  description:
    "Automatically analyze WHOOP recovery data with detailed insights on HRV, resting heart rate, and recovery trends. Use when users ask about recovery analysis, HRV trends, stress levels, or recovery optimization.",
  inputSchema: z.object({
    days: z
      .number()
      .min(1)
      .max(90)
      .default(30)
      .describe("Number of days to analyze"),
  }),
  execute: async ({ days }) => {
    try {
      // Fetch recovery data automatically
      const result = await getWhoopAnalysisDataAction({
        analysisType: "recovery",
        days,
      });

      if (!result.data) {
        return {
          error: result.serverError || "Failed to fetch WHOOP recovery data",
          hasData: false,
        };
      }

      // Return simple success message - the actual analysis will be triggered via artifacts
      const recoveryData =
        "recoveryData" in result.data ? result.data.recoveryData : [];
      return {
        text: `Successfully fetched WHOOP recovery data for analysis. Found ${recoveryData.length} recovery records.`,
        hasData: true,
      };
    } catch (error) {
      console.error("Error in auto recovery analysis:", error);
      return {
        error:
          "Failed to analyze WHOOP recovery data. Please ensure your WHOOP account is connected.",
        hasData: false,
      };
    }
  },
});

// Auto WHOOP Sleep Analysis Tool
export const autoWhoopSleepTool = tool({
  description:
    "Automatically analyze WHOOP sleep data with detailed insights on sleep performance, efficiency, stages, and optimization recommendations. Use when users ask about sleep analysis, sleep quality, sleep stages, or sleep optimization.",
  inputSchema: z.object({
    days: z
      .number()
      .min(1)
      .max(90)
      .default(30)
      .describe("Number of days to analyze"),
  }),
  execute: async ({ days }) => {
    try {
      // Fetch sleep data automatically
      const result = await getWhoopAnalysisDataAction({
        analysisType: "sleep",
        days,
      });

      if (!result.data) {
        return {
          error: result.serverError || "Failed to fetch WHOOP sleep data",
          hasData: false,
        };
      }

      // Return simple success message - the actual analysis will be triggered via artifacts
      const sleepData = "sleepData" in result.data ? result.data.sleepData : [];
      return {
        text: `Successfully fetched WHOOP sleep data for analysis. Found ${sleepData.length} sleep records.`,
        hasData: true,
      };
    } catch (error) {
      console.error("Error in auto sleep analysis:", error);
      return {
        error:
          "Failed to analyze WHOOP sleep data. Please ensure your WHOOP account is connected.",
        hasData: false,
      };
    }
  },
});

// Auto WHOOP Strain Analysis Tool
export const autoWhoopStrainTool = tool({
  description:
    "Automatically analyze WHOOP strain data with insights on training load, intensity distribution, and strain-recovery balance. Use when users ask about strain analysis, training load, workout intensity, or training optimization.",
  inputSchema: z.object({
    days: z
      .number()
      .min(1)
      .max(90)
      .default(30)
      .describe("Number of days to analyze"),
  }),
  execute: async ({ days }) => {
    try {
      // Fetch strain data automatically
      const result = await getWhoopAnalysisDataAction({
        analysisType: "strain",
        days,
      });

      if (!result.data) {
        return {
          error: result.serverError || "Failed to fetch WHOOP strain data",
          hasData: false,
        };
      }

      // Return simple success message - the actual analysis will be triggered via artifacts
      const strainData =
        "strainData" in result.data ? result.data.strainData : [];
      return {
        text: `Successfully fetched WHOOP strain data for analysis. Found ${strainData.length} strain records.`,
        hasData: true,
      };
    } catch (error) {
      console.error("Error in auto strain analysis:", error);
      return {
        error:
          "Failed to analyze WHOOP strain data. Please ensure your WHOOP account is connected.",
        hasData: false,
      };
    }
  },
});

// Auto WHOOP Workout Analysis Tool
export const autoWhoopWorkoutTool = tool({
  description:
    "Automatically analyze WHOOP workout data with detailed insights on workout performance, sport-specific analysis, and training optimization. Use when users ask about workout analysis, training performance, sport-specific insights, or workout optimization.",
  inputSchema: z.object({
    days: z
      .number()
      .min(1)
      .max(90)
      .default(30)
      .describe("Number of days to analyze"),
  }),
  execute: async ({ days }) => {
    try {
      // Fetch workout data automatically
      const result = await getWhoopAnalysisDataAction({
        analysisType: "workout",
        days,
      });

      if (!result.data) {
        return {
          error: result.serverError || "Failed to fetch WHOOP workout data",
          hasData: false,
        };
      }

      // Return simple success message - the actual analysis will be triggered via artifacts
      const workoutData =
        "workoutData" in result.data ? result.data.workoutData : [];
      return {
        text: `Successfully fetched WHOOP workout data for analysis. Found ${workoutData.length} workout records.`,
        hasData: true,
      };
    } catch (error) {
      console.error("Error in auto workout analysis:", error);
      return {
        error:
          "Failed to analyze WHOOP workout data. Please ensure your WHOOP account is connected.",
        hasData: false,
      };
    }
  },
});

// Cursor rules applied correctly.
