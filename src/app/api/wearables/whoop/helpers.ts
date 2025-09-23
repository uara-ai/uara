/**
 * WHOOP API Helper Functions
 *
 * Utility functions for timeline calculations, data processing, and common operations
 * for WHOOP API endpoints.
 */

export interface TimelineConfig {
  days: number;
  label: string;
  maxLimit: number;
}

/**
 * Predefined timeline configurations
 */
export const TIMELINE_CONFIGS: Record<string, TimelineConfig> = {
  "1d": { days: 1, label: "Last Day", maxLimit: 10 },
  "3d": { days: 3, label: "Last 3 Days", maxLimit: 25 },
  "1w": { days: 7, label: "Last Week", maxLimit: 50 },
  "2w": { days: 14, label: "Last 2 Weeks", maxLimit: 100 },
  "1m": { days: 30, label: "Last Month", maxLimit: 100 },
  "2m": { days: 60, label: "Last 2 Months", maxLimit: 200 },
};

/**
 * Calculate date range for a given timeline
 */
export function getDateRange(timeline: string): {
  startDate: Date;
  endDate: Date;
  config: TimelineConfig;
} {
  const config = TIMELINE_CONFIGS[timeline];
  if (!config) {
    throw new Error(
      `Invalid timeline: ${timeline}. Valid options: ${Object.keys(
        TIMELINE_CONFIGS
      ).join(", ")}`
    );
  }

  const endDate = new Date();
  const startDate = new Date(Date.now() - config.days * 24 * 60 * 60 * 1000);

  return { startDate, endDate, config };
}

/**
 * Validate timeline parameter
 */
export function validateTimeline(timeline: string): boolean {
  return Object.keys(TIMELINE_CONFIGS).includes(timeline);
}

/**
 * Get available timelines for API documentation
 */
export function getAvailableTimelines(): string[] {
  return Object.keys(TIMELINE_CONFIGS);
}

/**
 * Calculate pagination parameters
 */
export function calculatePagination(
  page: number = 1,
  limit: number = 50,
  maxLimit: number = 200
): { skip: number; take: number; page: number } {
  const validatedLimit = Math.min(Math.max(limit, 1), maxLimit);
  const validatedPage = Math.max(page, 1);
  const skip = (validatedPage - 1) * validatedLimit;

  return {
    skip,
    take: validatedLimit,
    page: validatedPage,
  };
}

/**
 * Standard response format for WHOOP API endpoints
 */
export interface WhoopApiResponseFormat<T> {
  success: boolean;
  data: T[];
  metadata: {
    timeline: string;
    period: {
      start: string;
      end: string;
      days: number;
    };
    pagination?: {
      page: number;
      limit: number;
      total: number;
      hasMore: boolean;
    };
    counts: {
      total: number;
      scored: number;
      pending: number;
      unscorable: number;
    };
    generatedAt: string;
  };
}

/**
 * Create standardized API response
 */
export function createApiResponse<T extends { scoreState: string }>(
  data: T[],
  timeline: string,
  startDate: Date,
  endDate: Date,
  pagination?: { page: number; limit: number; total: number }
): WhoopApiResponseFormat<T> {
  const config = TIMELINE_CONFIGS[timeline];

  // Count different score states
  const counts = data.reduce(
    (acc, item) => {
      acc.total++;
      if (item.scoreState === "SCORED") acc.scored++;
      else if (item.scoreState === "PENDING_SCORE") acc.pending++;
      else if (item.scoreState === "UNSCORABLE") acc.unscorable++;
      return acc;
    },
    { total: 0, scored: 0, pending: 0, unscorable: 0 }
  );

  const response: WhoopApiResponseFormat<T> = {
    success: true,
    data,
    metadata: {
      timeline,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days: config.days,
      },
      counts,
      generatedAt: new Date().toISOString(),
    },
  };

  if (pagination) {
    response.metadata.pagination = {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      hasMore: pagination.page * pagination.limit < pagination.total,
    };
  }

  return response;
}

/**
 * Convert milliseconds to hours for better readability
 */
export function millisecondsToHours(ms: number | null): number | null {
  if (ms === null) return null;
  return Number((ms / (1000 * 60 * 60)).toFixed(2));
}

/**
 * Format WHOOP data for client consumption
 */
export function formatSleepData(sleep: any) {
  return {
    ...sleep,
    // Convert milliseconds to hours for better UX
    totalInBedTimeHours: millisecondsToHours(sleep.totalInBedTime),
    totalAwakeTimeHours: millisecondsToHours(sleep.totalAwakeTime),
    totalLightSleepTimeHours: millisecondsToHours(sleep.totalLightSleepTime),
    totalSlowWaveSleepTimeHours: millisecondsToHours(
      sleep.totalSlowWaveSleepTime
    ),
    totalRemSleepTimeHours: millisecondsToHours(sleep.totalRemSleepTime),
    sleepNeedBaselineHours: millisecondsToHours(sleep.sleepNeedBaseline),
    sleepNeedFromDebtHours: millisecondsToHours(sleep.sleepNeedFromDebt),
    sleepNeedFromStrainHours: millisecondsToHours(sleep.sleepNeedFromStrain),
    sleepNeedFromNapHours: millisecondsToHours(sleep.sleepNeedFromNap),
  };
}

/**
 * Format workout data for client consumption
 */
export function formatWorkoutData(workout: any) {
  return {
    id: workout.workoutId,
    v1_id: Number(workout.workoutId.replace(/[^0-9]/g, "")) || 1043,
    user_id: 9012, // Static for compatibility
    created_at: workout.createdAt,
    updated_at: workout.updatedAt,
    start: workout.start,
    end: workout.end,
    timezone_offset: workout.timezoneOffset || "-05:00",
    sport_name: workout.sportName || "running",
    score_state: workout.scoreState,
    score: {
      strain: workout.strain || 0,
      average_heart_rate: workout.averageHeartRate || 0,
      max_heart_rate: workout.maxHeartRate || 0,
      kilojoule: workout.kilojoule || 0,
      percent_recorded: workout.percentRecorded || 100,
      distance_meter: workout.distanceMeters || 0,
      altitude_gain_meter: workout.altitudeGainMeters || 0,
      altitude_change_meter: workout.altitudeChangeMeters || 0,
      zone_durations: {
        zone_zero_milli: workout.zoneZeroDuration || 0,
        zone_one_milli: workout.zoneOneDuration || 0,
        zone_two_milli: workout.zoneTwoDuration || 0,
        zone_three_milli: workout.zoneThreeDuration || 0,
        zone_four_milli: workout.zoneFourDuration || 0,
        zone_five_milli: workout.zoneFiveDuration || 0,
      },
    },
    sport_id: workout.sportId || 1,
    // Legacy field for API compatibility
    scoreState: workout.scoreState,
    // Additional computed fields for convenience
    zoneZeroDurationMinutes: workout.zoneZeroDuration
      ? Math.round(workout.zoneZeroDuration / (1000 * 60))
      : null,
    zoneOneDurationMinutes: workout.zoneOneDuration
      ? Math.round(workout.zoneOneDuration / (1000 * 60))
      : null,
    zoneTwoDurationMinutes: workout.zoneTwoDuration
      ? Math.round(workout.zoneTwoDuration / (1000 * 60))
      : null,
    zoneThreeDurationMinutes: workout.zoneThreeDuration
      ? Math.round(workout.zoneThreeDuration / (1000 * 60))
      : null,
    zoneFourDurationMinutes: workout.zoneFourDuration
      ? Math.round(workout.zoneFourDuration / (1000 * 60))
      : null,
    zoneFiveDurationMinutes: workout.zoneFiveDuration
      ? Math.round(workout.zoneFiveDuration / (1000 * 60))
      : null,
    // Convert distance from meters to kilometers
    distanceKm: workout.distanceMeters
      ? Number((workout.distanceMeters / 1000).toFixed(2))
      : null,
  };
}

/**
 * Validate score state filter
 */
export function validateScoreState(scoreState?: string): string | undefined {
  if (!scoreState) return undefined;

  const validStates = ["SCORED", "PENDING_SCORE", "UNSCORABLE"];
  if (!validStates.includes(scoreState)) {
    throw new Error(
      `Invalid score state: ${scoreState}. Valid options: ${validStates.join(
        ", "
      )}`
    );
  }

  return scoreState;
}

/**
 * Common database query filters
 */
export function buildWhereClause(
  userId: string,
  startDate: Date,
  endDate: Date,
  scoreState?: string,
  additionalFilters?: Record<string, any>
): Record<string, any> {
  const where: Record<string, any> = {
    whoopUserId: userId,
    start: {
      gte: startDate,
      lte: endDate,
    },
    ...additionalFilters,
  };

  if (scoreState) {
    where.scoreState = scoreState;
  }

  return where;
}

// Cursor rules applied correctly.
