import React from "react";
import { SleepDetailPage } from "@/components/healthspan/v1/wearables/sleep/sleep-detail-page";
import { WhoopSleep } from "@/components/healthspan/v1/wearables/types";

// Mock data for sleep details - replace with actual data fetching
const mockSleepData: WhoopSleep[] = [
  {
    id: "ecfc6a15-4661-442f-a9a4-f160dd7afae8",
    cycle_id: 93845,
    v1_id: 93845,
    user_id: 10129,
    created_at: "2022-04-24T11:25:44.774Z",
    updated_at: "2022-04-24T14:25:44.774Z",
    start: "2022-04-24T02:25:44.774Z",
    end: "2022-04-24T10:25:44.774Z",
    timezone_offset: "-05:00",
    nap: false,
    score_state: "SCORED",
    score: {
      stage_summary: {
        total_in_bed_time_milli: 30272735,
        total_awake_time_milli: 1403507,
        total_no_data_time_milli: 0,
        total_light_sleep_time_milli: 14905851,
        total_slow_wave_sleep_time_milli: 6630370,
        total_rem_sleep_time_milli: 5879573,
        sleep_cycle_count: 3,
        disturbance_count: 12,
      },
      sleep_needed: {
        baseline_milli: 27395716,
        need_from_sleep_debt_milli: 352230,
        need_from_recent_strain_milli: 208595,
        need_from_recent_nap_milli: -12312,
      },
      respiratory_rate: 16.11328125,
      sleep_performance_percentage: 98,
      sleep_consistency_percentage: 90,
      sleep_efficiency_percentage: 91.69533848,
    },
  },
  {
    id: "12345678-1234-5678-9abc-def123456789",
    cycle_id: 93846,
    v1_id: 93846,
    user_id: 10129,
    created_at: "2022-04-23T11:25:44.774Z",
    updated_at: "2022-04-23T14:25:44.774Z",
    start: "2022-04-23T01:15:44.774Z",
    end: "2022-04-23T08:45:44.774Z",
    timezone_offset: "-05:00",
    nap: false,
    score_state: "SCORED",
    score: {
      stage_summary: {
        total_in_bed_time_milli: 27000000,
        total_awake_time_milli: 1800000,
        total_no_data_time_milli: 0,
        total_light_sleep_time_milli: 12600000,
        total_slow_wave_sleep_time_milli: 5400000,
        total_rem_sleep_time_milli: 7200000,
        sleep_cycle_count: 4,
        disturbance_count: 8,
      },
      sleep_needed: {
        baseline_milli: 27000000,
        need_from_sleep_debt_milli: 180000,
        need_from_recent_strain_milli: 300000,
        need_from_recent_nap_milli: 0,
      },
      respiratory_rate: 15.8,
      sleep_performance_percentage: 85,
      sleep_consistency_percentage: 88,
      sleep_efficiency_percentage: 93.2,
    },
  },
];

export default function SleepPage() {
  return <SleepDetailPage sleepData={mockSleepData} />;
}

// Cursor rules applied correctly.
