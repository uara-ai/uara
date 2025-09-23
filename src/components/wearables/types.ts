// Standardized interfaces for wearables data
export interface BaseWearableData {
  id: string;
  date: Date;
  source: "whoop" | "oura" | "garmin" | "apple" | "fitbit";
  quality: "excellent" | "good" | "fair" | "poor";
}

export interface SleepData extends BaseWearableData {
  totalSleepTime: number; // in minutes
  deepSleepTime: number; // in minutes
  remSleepTime: number; // in minutes
  lightSleepTime: number; // in minutes
  awakeTime: number; // in minutes
  sleepEfficiency: number; // percentage (0-100)
  sleepScore: number; // normalized score (0-100)
  restingHeartRate: number; // bpm
  respiratoryRate: number; // breaths per minute
  bedTime: Date;
  wakeTime: Date;
  disturbances: number;
}

export interface RecoveryData extends BaseWearableData {
  recoveryScore: number; // normalized score (0-100)
  restingHeartRate: number; // bpm
  heartRateVariability: number; // RMSSD in ms
  skinTemperature: number; // deviation from baseline in °C
  respiratoryRate: number; // breaths per minute
  bloodOxygen?: number; // SpO2 percentage
  sleepPerformance: number; // percentage (0-100)
  strain: number; // cumulative strain score
  isCalibrating?: boolean;
}

export interface WorkoutData extends BaseWearableData {
  activityType: string; // e.g., "Running", "Cycling", "Strength Training"
  sportId?: number;
  duration: number; // in minutes
  strain: number; // strain score
  averageHeartRate: number; // bpm
  maxHeartRate: number; // bpm
  calories: number; // kcal
  distance?: number; // in meters
  altitudeGain?: number; // in meters
  averagePace?: number; // in seconds per km
  zones: {
    zone1: number; // minutes in each HR zone
    zone2: number;
    zone3: number;
    zone4: number;
    zone5: number;
  };
  startTime: Date;
  endTime: Date;
}

export interface StrengthData extends BaseWearableData {
  exercises: Exercise[];
  totalVolume: number; // total weight lifted in kg
  totalSets: number;
  totalReps: number;
  duration: number; // in minutes
  averageHeartRate: number; // bpm
  maxHeartRate: number; // bpm
  calories: number; // kcal
  restTime: number; // average rest time between sets in seconds
  muscleGroups: string[]; // e.g., ["chest", "triceps", "shoulders"]
}

export interface Exercise {
  name: string;
  sets: Set[];
  muscleGroup: string;
  equipmentType: "barbell" | "dumbbell" | "machine" | "bodyweight" | "cable";
}

export interface Set {
  weight: number; // in kg
  reps: number;
  duration?: number; // for time-based exercises, in seconds
  restTime?: number; // rest after this set, in seconds
}

// Props for card components
export interface SleepCardProps {
  data: SleepData;
  showDetails?: boolean;
  className?: string;
}

export interface RecoveryCardProps {
  data: RecoveryData;
  showDetails?: boolean;
  className?: string;
}

export interface WorkoutCardProps {
  data: WorkoutData;
  showDetails?: boolean;
  className?: string;
}

export interface StrengthCardProps {
  data: StrengthData;
  showDetails?: boolean;
  className?: string;
}

// Combined props for wearables overview
export interface WearablesData {
  sleep?: SleepData[];
  recovery?: RecoveryData[];
  workouts?: WorkoutData[];
  strength?: StrengthData[];
}

export interface WearablesPageProps {
  data: WearablesData;
  dateRange?: {
    start: Date;
    end: Date;
  };
  className?: string;
}

// Cursor rules applied correctly.
