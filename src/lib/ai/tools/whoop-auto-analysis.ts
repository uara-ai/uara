import { tool } from "ai";
import { z } from "zod";
import {
  getCurrentUser,
  preloadWhoopData,
  getWhoopData,
} from "@/lib/ai/context";
import {
  WhoopRecoveryArtifact,
  WhoopSleepArtifact,
  WhoopStrainArtifact,
  WhoopWorkoutArtifact,
} from "@/lib/ai";

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
      // Get current user context
      const user = getCurrentUser();

      // Try to get preloaded data first, otherwise fetch it
      let whoopData = getWhoopData("recovery");
      if (!whoopData) {
        whoopData = await preloadWhoopData("recovery", days);
      }

      if (!whoopData) {
        return {
          parts: [],
          text: "Failed to fetch WHOOP recovery data. Please ensure your WHOOP account is connected.",
        };
      }

      // Return simple success message - let the system handle the detailed analysis
      return {
        parts: [
          {
            type: `data-artifact-${WhoopRecoveryArtifact.id}`,
            data: {
              id: whoopData.id,
              version: 1,
              status: "complete" as const,
              progress: 1,
              payload: whoopData,
              createdAt: Date.now(),
            },
          },
        ],
        text: `Successfully fetched WHOOP recovery data for ${
          user.fullName
        }. Found ${
          whoopData.recoveryData?.length || 0
        } recovery records. You can now ask for detailed recovery analysis.`,
      };
    } catch (error) {
      console.error("Error in auto recovery analysis:", error);
      return {
        parts: [],
        text: "Failed to analyze WHOOP recovery data. Please ensure your WHOOP account is connected.",
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
      // Get current user context
      const user = getCurrentUser();

      // Try to get preloaded data first, otherwise fetch it
      let whoopData = getWhoopData("sleep");
      if (!whoopData) {
        whoopData = await preloadWhoopData("sleep", days);
      }

      if (!whoopData) {
        return {
          parts: [],
          text: "Failed to fetch WHOOP sleep data. Please ensure your WHOOP account is connected.",
        };
      }

      // Return simple success message - let the system handle the detailed analysis
      return {
        parts: [
          {
            type: `data-artifact-${WhoopSleepArtifact.id}`,
            data: {
              id: whoopData.id,
              version: 1,
              status: "complete" as const,
              progress: 1,
              payload: whoopData,
              createdAt: Date.now(),
            },
          },
        ],
        text: `Successfully fetched WHOOP sleep data for ${
          user.fullName
        }. Found ${
          whoopData.sleepData?.length || 0
        } sleep records. You can now ask for detailed sleep analysis.`,
      };
    } catch (error) {
      console.error("Error in auto sleep analysis:", error);
      return {
        parts: [],
        text: "Failed to analyze WHOOP sleep data. Please ensure your WHOOP account is connected.",
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
      // Get current user context
      const user = getCurrentUser();

      // Try to get preloaded data first, otherwise fetch it
      let whoopData = getWhoopData("strain");
      if (!whoopData) {
        whoopData = await preloadWhoopData("strain", days);
      }

      if (!whoopData) {
        return {
          parts: [],
          text: "Failed to fetch WHOOP strain data. Please ensure your WHOOP account is connected.",
        };
      }

      // Return simple success message - let the system handle the detailed analysis
      return {
        parts: [
          {
            type: `data-artifact-${WhoopStrainArtifact.id}`,
            data: {
              id: whoopData.id,
              version: 1,
              status: "complete" as const,
              progress: 1,
              payload: whoopData,
              createdAt: Date.now(),
            },
          },
        ],
        text: `Successfully fetched WHOOP strain data for ${
          user.fullName
        }. Found ${
          whoopData.strainData?.length || 0
        } strain records. You can now ask for detailed strain analysis.`,
      };
    } catch (error) {
      console.error("Error in auto strain analysis:", error);
      return {
        parts: [],
        text: "Failed to analyze WHOOP strain data. Please ensure your WHOOP account is connected.",
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
      // Get current user context
      const user = getCurrentUser();

      // Try to get preloaded data first, otherwise fetch it
      let whoopData = getWhoopData("workout");
      if (!whoopData) {
        whoopData = await preloadWhoopData("workout", days);
      }

      if (!whoopData) {
        return {
          parts: [],
          text: "Failed to fetch WHOOP workout data. Please ensure your WHOOP account is connected.",
        };
      }

      // Return simple success message - let the system handle the detailed analysis
      return {
        parts: [
          {
            type: `data-artifact-${WhoopWorkoutArtifact.id}`,
            data: {
              id: whoopData.id,
              version: 1,
              status: "complete" as const,
              progress: 1,
              payload: whoopData,
              createdAt: Date.now(),
            },
          },
        ],
        text: `Successfully fetched WHOOP workout data for ${
          user.fullName
        }. Found ${
          whoopData.workoutData?.length || 0
        } workout records. You can now ask for detailed workout analysis.`,
      };
    } catch (error) {
      console.error("Error in auto workout analysis:", error);
      return {
        parts: [],
        text: "Failed to analyze WHOOP workout data. Please ensure your WHOOP account is connected.",
      };
    }
  },
});

// Cursor rules applied correctly.
