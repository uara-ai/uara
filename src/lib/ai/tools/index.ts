import { getWeather } from "./get-weather";
import { analyzeWhoopData } from "./analyze-whoop-data";
import { analyzeBurnRateTool } from "./burn-rate";

export function tools() {
  return {
    getWeather,
    analyzeWhoopData,
    analyzeBurnRate: analyzeBurnRateTool,
  };
}

// Cursor rules applied correctly.
