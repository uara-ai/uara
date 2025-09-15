// WHOOP API v2 TypeScript definitions
// Based on official WHOOP API v2 documentation

export interface WhoopUser {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface WhoopTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  user_id: number;
}

export interface WhoopRecovery {
  cycle_id: number;
  sleep_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  score_state: "SCORED" | "PENDING_SCORE" | "UNSCORABLE";
  score: {
    user_calibrating: boolean;
    recovery_score: number;
    resting_heart_rate: number;
    hrv_rmssd_milli: number;
  };
}

export interface WhoopCycle {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string | null;
  timezone_offset: string;
  score_state: "SCORED" | "PENDING_SCORE" | "UNSCORABLE";
  score: {
    strain: number;
    average_heart_rate: number;
    max_heart_rate: number;
    kilojoule: number;
    percent_recorded: number;
  } | null;
}

export interface WhoopSleep {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  nap: boolean;
  score_state: "SCORED" | "PENDING_SCORE" | "UNSCORABLE";
  score: {
    stage_summary: {
      total_in_bed_time_milli: number;
      total_awake_time_milli: number;
      total_no_data_time_milli: number;
      total_light_sleep_time_milli: number;
      total_slow_wave_sleep_time_milli: number;
      total_rem_sleep_time_milli: number;
      sleep_cycle_count: number;
      disturbance_count: number;
    };
    sleep_needed: {
      baseline_milli: number;
      need_from_sleep_debt_milli: number;
      need_from_recent_strain_milli: number;
      need_from_recent_nap_milli: number;
    };
    respiratory_rate: number;
    sleep_performance_percentage: number;
    sleep_consistency_percentage: number;
    sleep_efficiency_percentage: number;
  } | null;
}

export interface WhoopWorkout {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  sport_id: number;
  score_state: "SCORED" | "PENDING_SCORE" | "UNSCORABLE";
  score: {
    strain: number;
    average_heart_rate: number;
    max_heart_rate: number;
    kilojoule: number;
    percent_recorded: number;
    distance_meter: number | null;
    altitude_gain_meter: number | null;
    altitude_change_meter: number | null;
    zone_duration: {
      zone_zero_milli: number;
      zone_one_milli: number;
      zone_two_milli: number;
      zone_three_milli: number;
      zone_four_milli: number;
      zone_five_milli: number;
    };
  } | null;
}

export interface WhoopBodyMeasurement {
  height_meter: number | null;
  weight_kilogram: number | null;
  max_heart_rate: number | null;
}

// Webhook event types
export interface WhoopWebhookEvent {
  id: string;
  type:
    | "user.updated"
    | "recovery.updated"
    | "cycle.updated"
    | "sleep.updated"
    | "workout.updated"
    | "body_measurement.updated";
  data: {
    user_id: number;
    id?: number; // Present for specific resource events
  };
  created_at: string;
}

// API Response wrappers
export interface WhoopApiResponse<T> {
  data: T[];
  next_token?: string;
}

export interface WhoopApiSingleResponse<T> {
  data: T;
}

// Database types for storing WHOOP data
export interface StoredWhoopUser {
  id: string;
  userId: string; // Our internal user ID
  whoopUserId: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredWhoopRecovery {
  id: string;
  whoopUserId: string;
  cycleId: number;
  sleepId: number;
  createdAt: Date;
  updatedAt: Date;
  scoreState: string;
  recoveryScore?: number;
  restingHeartRate?: number;
  hrvRmssd?: number;
  userCalibrating?: boolean;
}

export interface StoredWhoopCycle {
  id: string;
  whoopUserId: string;
  cycleId: number;
  start: Date;
  end?: Date;
  timezoneOffset: string;
  scoreState: string;
  strain?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  kilojoule?: number;
  percentRecorded?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredWhoopSleep {
  id: string;
  whoopUserId: string;
  sleepId: number;
  start: Date;
  end: Date;
  timezoneOffset: string;
  nap: boolean;
  scoreState: string;
  totalInBedTime?: number;
  totalAwakeTime?: number;
  totalLightSleepTime?: number;
  totalSlowWaveSleepTime?: number;
  totalRemSleepTime?: number;
  sleepCycleCount?: number;
  disturbanceCount?: number;
  respiratoryRate?: number;
  sleepPerformancePercentage?: number;
  sleepConsistencyPercentage?: number;
  sleepEfficiencyPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoredWhoopWorkout {
  id: string;
  whoopUserId: string;
  workoutId: number;
  start: Date;
  end: Date;
  timezoneOffset: string;
  sportId: number;
  scoreState: string;
  strain?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  kilojoule?: number;
  percentRecorded?: number;
  distanceMeters?: number;
  altitudeGainMeters?: number;
  altitudeChangeMeters?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Error types
export interface WhoopApiError {
  error: string;
  error_description?: string;
}

// Cursor rules applied correctly.
