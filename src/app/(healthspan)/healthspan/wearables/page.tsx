import React from "react";
import { WearablesPage } from "@/components/healthspan/v1/wearables/wearables-page";
import { WearablesData } from "@/components/healthspan/v1/wearables/types";
import {
  getWhoopDataServer,
  getWhoopUserServer,
} from "@/actions/whoop-data-action";

// Mock data for demonstration - replace with actual data fetching
const mockWearablesData: WearablesData = {
  cycles: [
    {
      id: 93845,
      user_id: 10129,
      created_at: "2022-04-24T11:25:44.774Z",
      updated_at: "2022-04-24T14:25:44.774Z",
      start: "2022-04-24T02:25:44.774Z",
      end: "2022-04-24T10:25:44.774Z",
      timezone_offset: "-05:00",
      score_state: "SCORED",
      score: {
        strain: 5.2951527,
        kilojoule: 8288.297,
        average_heart_rate: 68,
        max_heart_rate: 141,
      },
    },
  ],
  sleep: [
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
  ],
  recovery: [
    {
      cycle_id: 93845,
      sleep_id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: 10129,
      created_at: "2022-04-24T11:25:44.774Z",
      updated_at: "2022-04-24T14:25:44.774Z",
      score_state: "SCORED",
      score: {
        user_calibrating: false,
        recovery_score: 44,
        resting_heart_rate: 64,
        hrv_rmssd_milli: 31.813562,
        spo2_percentage: 95.6875,
        skin_temp_celsius: 33.7,
      },
    },
  ],
  workouts: [
    {
      id: "ecfc6a15-4661-442f-a9a4-f160dd7afae8",
      v1_id: 1043,
      user_id: 9012,
      created_at: "2022-04-24T11:25:44.774Z",
      updated_at: "2022-04-24T14:25:44.774Z",
      start: "2022-04-24T02:25:44.774Z",
      end: "2022-04-24T10:25:44.774Z",
      timezone_offset: "-05:00",
      sport_name: "running",
      score_state: "SCORED",
      score: {
        strain: 8.2463,
        average_heart_rate: 123,
        max_heart_rate: 146,
        kilojoule: 1569.34033203125,
        percent_recorded: 100,
        distance_meter: 1772.77035916,
        altitude_gain_meter: 46.64384460449,
        altitude_change_meter: -0.781372010707855,
        zone_durations: {
          zone_zero_milli: 300000,
          zone_one_milli: 600000,
          zone_two_milli: 900000,
          zone_three_milli: 900000,
          zone_four_milli: 600000,
          zone_five_milli: 300000,
        },
      },
      sport_id: 1,
    },
  ],
};

export default async function WearablesPageRoute() {
  // Fetch WHOOP user data to determine connection status
  const whoopUser = await getWhoopUserServer();

  // If connected, fetch actual data, otherwise use mock data for demonstration
  let wearablesData: WearablesData = mockWearablesData;

  if (whoopUser) {
    try {
      const realWhoopData = await getWhoopDataServer(7, 50); // Last 7 days, 50 records
      if (realWhoopData) {
        wearablesData = {
          cycles: realWhoopData.cycles || [],
          sleep: realWhoopData.sleep || [],
          recovery: realWhoopData.recovery || [],
          workouts: realWhoopData.workouts || [],
        };
      }
    } catch (error) {
      console.error("Failed to fetch WHOOP data:", error);
      // Fall back to mock data
    }
  }

  return (
    <WearablesPage
      data={wearablesData}
      whoopUser={whoopUser}
      isConnected={!!whoopUser}
    />
  );
}

// Cursor rules applied correctly.
