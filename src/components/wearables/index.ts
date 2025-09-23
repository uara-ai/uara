// Export all wearables components and types
export { SleepCard } from "./sleep-card";
export { RecoveryCard } from "./recovery-card";
export { StrengthCard } from "./strength-card";
export { WearablesPage } from "./wearables-page";

// Export color utilities
export {
  getSleepColor,
  getRecoveryColor,
  getStrainColor,
  getMetricColor,
  getMetricColorRanges,
  getChartBackground,
  CHART_COLORS,
} from "./chart-colors";

export type {
  BaseWearableData,
  SleepData,
  RecoveryData,
  WorkoutData,
  StrengthData,
  Exercise,
  Set,
  WearablesData,
  WearablesPageProps,
} from "./types";

export type { ColorRange } from "./chart-colors";

// Cursor rules applied correctly.
