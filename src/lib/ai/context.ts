import { type BaseContext, createTypedContext } from "@ai-sdk-tools/artifacts";
import { getWhoopAnalysisDataAction } from "@/actions/whoop-analysis-action";

// Define custom context type with userId and fullName
interface ChatContext extends BaseContext {
  userId: string;
  fullName: string;
  whoopData?: {
    recovery?: any;
    sleep?: any;
    strain?: any;
    workout?: any;
  };
}

// Create typed context helpers
const { setContext, getContext } = createTypedContext<ChatContext>();

// Helper function to get current user context (can be used in tools)
export function getCurrentUser() {
  const context = getContext();
  return {
    id: context.userId,
    fullName: context.fullName,
  };
}

// Helper function to preload WHOOP data for a specific analysis type
export async function preloadWhoopData(
  analysisType: "recovery" | "sleep" | "strain" | "workout",
  days: number = 30
) {
  try {
    const result = await getWhoopAnalysisDataAction({
      analysisType,
      days,
    });

    if (result.data) {
      const context = getContext();
      const updatedContext = {
        ...context,
        whoopData: {
          ...context.whoopData,
          [analysisType]: result.data,
        },
      };
      setContext(updatedContext);
      return result.data;
    }
    return null;
  } catch (error) {
    console.error(`Error preloading WHOOP ${analysisType} data:`, error);
    return null;
  }
}

// Helper function to get preloaded WHOOP data
export function getWhoopData(
  analysisType: "recovery" | "sleep" | "strain" | "workout"
) {
  const context = getContext();
  return context.whoopData?.[analysisType] || null;
}

export { setContext, getContext };
