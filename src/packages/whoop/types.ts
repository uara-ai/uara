// Whoop API v2 Types
export interface WhoopTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface WhoopUser {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface WhoopRecovery {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  score_state: "SCORED" | "PENDING_SCORE" | "UNSCORABLE";
  score?: {
    user_calibrating: boolean;
    recovery_score: number;
    resting_heart_rate: number;
    hrv_rmssd_milli: number;
  };
}

export interface WhoopCycle {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  start: string;
  end?: string;
  timezone_offset: string;
  score_state: "SCORED" | "PENDING_SCORE" | "UNSCORABLE";
  score?: {
    strain: number;
    average_heart_rate: number;
    max_heart_rate: number;
    kilojoule: number;
    percent_recorded: number;
  };
}

export interface WhoopSleep {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  nap: boolean;
  score_state: "SCORED" | "PENDING_SCORE" | "UNSCORABLE";
  score?: {
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
  };
}

export interface WhoopWorkout {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  start: string;
  end: string;
  timezone_offset: string;
  sport_id: number;
  score_state: "SCORED" | "PENDING_SCORE" | "UNSCORABLE";
  score?: {
    strain: number;
    average_heart_rate: number;
    max_heart_rate: number;
    kilojoule: number;
    percent_recorded: number;
    distance_meter?: number;
    altitude_gain_meter?: number;
    altitude_change_meter?: number;
    zone_duration: {
      zone_zero_milli: number;
      zone_one_milli: number;
      zone_two_milli: number;
      zone_three_milli: number;
      zone_four_milli: number;
      zone_five_milli: number;
    };
  };
}

export interface WhoopBodyMeasurement {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  height_meter?: number;
  weight_kilogram?: number;
  max_heart_rate?: number;
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
  user_id: string;
  timestamp: string;
}

// OAuth configuration
export interface WhoopOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export const WHOOP_SCOPES = [
  "read:recovery",
  "read:cycles",
  "read:workout",
  "read:sleep",
  "read:profile",
  "read:body_measurement",
] as const;

export const WHOOP_API_BASE_URL = "https://api.prod.whoop.com";
export const WHOOP_AUTH_URL = `${WHOOP_API_BASE_URL}/oauth/oauth2/auth`;
export const WHOOP_TOKEN_URL = `${WHOOP_API_BASE_URL}/oauth/oauth2/token`;

// Cursor rules applied correctly.
