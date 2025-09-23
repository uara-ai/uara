// Standardized color mappings for wearables charts
// Based on Whoop's color scheme and health metric standards

export interface ColorRange {
  min: number;
  max: number;
  color: string;
  label: "excellent" | "good" | "fair" | "poor";
}

// Base color palette using #085983 as primary
export const CHART_COLORS = {
  // Primary brand color
  PRIMARY: "#085983", // Main brand color

  // Sleep colors (primary blue scale)
  SLEEP_EXCELLENT: "#085983", // Primary blue - 85-100%
  SLEEP_GOOD: "#0ea5e9", // Lighter blue - 70-84%
  SLEEP_FAIR: "#f59e0b", // amber-500 - 55-69%
  SLEEP_POOR: "#ef4444", // red-500 - 0-54%

  // Recovery colors (green to red scale with primary)
  RECOVERY_EXCELLENT: "#22c55e", // green-500 - 85-100%
  RECOVERY_GOOD: "#085983", // Primary blue - 70-84%
  RECOVERY_FAIR: "#f59e0b", // amber-500 - 40-69%
  RECOVERY_POOR: "#ef4444", // red-500 - 0-39%

  // Strain colors (green to red scale with primary)
  STRAIN_LOW: "#22c55e", // green-500 - 0-9.9
  STRAIN_MODERATE: "#085983", // Primary blue - 10-14.9
  STRAIN_HIGH: "#ef4444", // red-500 - 15-21
  STRAIN_EXTREME: "#dc2626", // red-600 - 21+

  // Background color for all charts
  BACKGROUND: "#374151", // gray-700
} as const;

// Sleep score color mapping (0-100%)
export const getSleepColor = (score: number): string => {
  if (score >= 85) return CHART_COLORS.SLEEP_EXCELLENT;
  if (score >= 70) return CHART_COLORS.SLEEP_GOOD;
  if (score >= 55) return CHART_COLORS.SLEEP_FAIR;
  return CHART_COLORS.SLEEP_POOR;
};

export const getSleepColorRanges = (): ColorRange[] => [
  {
    min: 85,
    max: 100,
    color: CHART_COLORS.SLEEP_EXCELLENT,
    label: "excellent",
  },
  { min: 70, max: 84, color: CHART_COLORS.SLEEP_GOOD, label: "good" },
  { min: 55, max: 69, color: CHART_COLORS.SLEEP_FAIR, label: "fair" },
  { min: 0, max: 54, color: CHART_COLORS.SLEEP_POOR, label: "poor" },
];

// Recovery score color mapping (0-100%)
export const getRecoveryColor = (score: number): string => {
  if (score >= 85) return CHART_COLORS.RECOVERY_EXCELLENT;
  if (score >= 70) return CHART_COLORS.RECOVERY_GOOD;
  if (score >= 40) return CHART_COLORS.RECOVERY_FAIR;
  return CHART_COLORS.RECOVERY_POOR;
};

export const getRecoveryColorRanges = (): ColorRange[] => [
  {
    min: 85,
    max: 100,
    color: CHART_COLORS.RECOVERY_EXCELLENT,
    label: "excellent",
  },
  { min: 70, max: 84, color: CHART_COLORS.RECOVERY_GOOD, label: "good" },
  { min: 40, max: 69, color: CHART_COLORS.RECOVERY_FAIR, label: "fair" },
  { min: 0, max: 39, color: CHART_COLORS.RECOVERY_POOR, label: "poor" },
];

// Strain score color mapping (0-21+ scale)
export const getStrainColor = (strain: number): string => {
  if (strain >= 21) return CHART_COLORS.STRAIN_EXTREME;
  if (strain >= 15) return CHART_COLORS.STRAIN_HIGH;
  if (strain >= 10) return CHART_COLORS.STRAIN_MODERATE;
  return CHART_COLORS.STRAIN_LOW;
};

export const getStrainColorRanges = (): ColorRange[] => [
  { min: 0, max: 9.9, color: CHART_COLORS.STRAIN_LOW, label: "good" },
  { min: 10, max: 14.9, color: CHART_COLORS.STRAIN_MODERATE, label: "fair" },
  { min: 15, max: 20.9, color: CHART_COLORS.STRAIN_HIGH, label: "poor" },
  { min: 21, max: 25, color: CHART_COLORS.STRAIN_EXTREME, label: "excellent" }, // Note: extreme strain can be "excellent" for athletes
];

// Generic color getter that can be used for any metric
export const getMetricColor = (
  value: number,
  type: "sleep" | "recovery" | "strain"
): string => {
  switch (type) {
    case "sleep":
      return getSleepColor(value);
    case "recovery":
      return getRecoveryColor(value);
    case "strain":
      return getStrainColor(value);
    default:
      return CHART_COLORS.SLEEP_GOOD; // fallback
  }
};

// Get color ranges for any metric type
export const getMetricColorRanges = (
  type: "sleep" | "recovery" | "strain"
): ColorRange[] => {
  switch (type) {
    case "sleep":
      return getSleepColorRanges();
    case "recovery":
      return getRecoveryColorRanges();
    case "strain":
      return getStrainColorRanges();
    default:
      return getSleepColorRanges(); // fallback
  }
};

// Chart configuration helpers
export const getChartBackground = () => CHART_COLORS.BACKGROUND;

// Color utility for converting to different formats if needed
export const hexToHsl = (hex: string): string => {
  // Convert hex to HSL if needed for CSS custom properties
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
    l * 100
  )}%)`;
};

// Cursor rules applied correctly.
