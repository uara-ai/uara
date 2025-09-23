import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { whoopClient } from "../client";
import { withAuth } from "@workos-inc/authkit-nextjs";

/**
 * WHOOP Manual Data Sync Endpoint
 *
 * This endpoint allows manual synchronization of WHOOP data:
 * 1. Validates user authentication
 * 2. Checks for valid WHOOP connection
 * 3. Fetches latest data from WHOOP API
 * 4. Updates local database
 */
export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const { user } = await withAuth({ ensureSignedIn: true });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request parameters
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "7");
    const dataType = searchParams.get("type") || "all"; // all, recovery, cycles, sleep, workouts

    // Validate days parameter
    if (days < 1 || days > 90) {
      return NextResponse.json(
        { error: "Days parameter must be between 1 and 90" },
        { status: 400 }
      );
    }

    // Find WHOOP user data
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: {
        whoopUserId: true,
        accessToken: true,
        refreshToken: true,
        expiresAt: true,
      },
    });

    if (!whoopUser) {
      return NextResponse.json(
        { error: "WHOOP account not connected" },
        { status: 404 }
      );
    }

    // Check if token needs refresh
    let accessToken = whoopUser.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token found for WHOOP account" },
        { status: 401 }
      );
    }

    if (whoopUser.expiresAt && new Date(whoopUser.expiresAt) <= new Date()) {
      if (!whoopUser.refreshToken) {
        return NextResponse.json(
          { error: "No refresh token found for WHOOP account" },
          { status: 401 }
        );
      }

      try {
        const refreshedTokens = await whoopClient.refreshToken(
          whoopUser.refreshToken
        );
        accessToken = refreshedTokens.access_token;

        // Update tokens in database
        const expiresAt = new Date(
          Date.now() + refreshedTokens.expires_in * 1000
        );
        await prisma.whoopUser.update({
          where: { userId: user.id },
          data: {
            accessToken: refreshedTokens.access_token,
            refreshToken: refreshedTokens.refresh_token,
            expiresAt,
            updatedAt: new Date(),
          },
        });

        accessToken = refreshedTokens.access_token;
      } catch (error) {
        console.error("Token refresh failed:", error);
        return NextResponse.json(
          { error: "Failed to refresh WHOOP tokens" },
          { status: 401 }
        );
      }
    }

    // Calculate date range
    const endDate = new Date().toISOString();
    const startDate = new Date(
      Date.now() - days * 24 * 60 * 60 * 1000
    ).toISOString();

    const results = {
      recovery: 0,
      cycles: 0,
      sleep: 0,
      workouts: 0,
      errors: [] as string[],
    };

    // Sync recovery data
    if (dataType === "all" || dataType === "recovery") {
      try {
        const recoveryData = await whoopClient.getRecovery(accessToken!, {
          start: startDate,
          end: endDate,
          limit: 25,
        });

        if (recoveryData.records.length > 0) {
          for (const recovery of recoveryData.records) {
            try {
              await prisma.whoopRecovery.upsert({
                where: {
                  whoopUserId_cycleId: {
                    whoopUserId: user.id,
                    cycleId: BigInt(recovery.cycle_id),
                  },
                },
                update: {
                  sleepId: recovery.sleep_id,
                  updatedAt: new Date(recovery.updated_at),
                  scoreState: recovery.score_state,
                  recoveryScore: recovery.score?.recovery_score ?? null,
                  restingHeartRate: recovery.score?.resting_heart_rate ?? null,
                  hrvRmssd: recovery.score?.hrv_rmssd_milli ?? null,
                  userCalibrating: recovery.score?.user_calibrating ?? null,
                },
                create: {
                  whoopUserId: user.id,
                  cycleId: BigInt(recovery.cycle_id),
                  sleepId: recovery.sleep_id,
                  createdAt: new Date(recovery.created_at),
                  updatedAt: new Date(recovery.updated_at),
                  scoreState: recovery.score_state,
                  recoveryScore: recovery.score?.recovery_score ?? null,
                  restingHeartRate: recovery.score?.resting_heart_rate ?? null,
                  hrvRmssd: recovery.score?.hrv_rmssd_milli ?? null,
                  userCalibrating: recovery.score?.user_calibrating ?? null,
                },
              });
            } catch (error) {
              console.error(
                `Failed to upsert recovery ${recovery.cycle_id}:`,
                error
              );
            }
          }
          results.recovery = recoveryData.records.length;
        }
      } catch (error) {
        results.errors.push(`Recovery fetch error: ${error}`);
      }
    }

    // Sync cycle data
    if (dataType === "all" || dataType === "cycles") {
      try {
        const cycleData = await whoopClient.getCycles(accessToken!, {
          start: startDate,
          end: endDate,
          limit: 25,
        });

        if (cycleData.records.length > 0) {
          for (const cycle of cycleData.records) {
            try {
              await prisma.whoopCycle.upsert({
                where: {
                  whoopUserId_cycleId: {
                    whoopUserId: user.id,
                    cycleId: BigInt(cycle.id),
                  },
                },
                update: {
                  start: new Date(cycle.start),
                  end: cycle.end ? new Date(cycle.end) : null,
                  timezoneOffset: cycle.timezone_offset,
                  scoreState: cycle.score_state,
                  strain: cycle.score?.strain ?? null,
                  averageHeartRate: cycle.score?.average_heart_rate ?? null,
                  maxHeartRate: cycle.score?.max_heart_rate ?? null,
                  kilojoule: cycle.score?.kilojoule ?? null,
                  percentRecorded: cycle.score?.percent_recorded ?? null,
                  updatedAt: new Date(cycle.updated_at),
                },
                create: {
                  whoopUserId: user.id,
                  cycleId: BigInt(cycle.id),
                  start: new Date(cycle.start),
                  end: cycle.end ? new Date(cycle.end) : null,
                  timezoneOffset: cycle.timezone_offset,
                  scoreState: cycle.score_state,
                  strain: cycle.score?.strain ?? null,
                  averageHeartRate: cycle.score?.average_heart_rate ?? null,
                  maxHeartRate: cycle.score?.max_heart_rate ?? null,
                  kilojoule: cycle.score?.kilojoule ?? null,
                  percentRecorded: cycle.score?.percent_recorded ?? null,
                  createdAt: new Date(cycle.created_at),
                  updatedAt: new Date(cycle.updated_at),
                },
              });
            } catch (error) {
              console.error(`Failed to upsert cycle ${cycle.id}:`, error);
            }
          }
          results.cycles = cycleData.records.length;
        }
      } catch (error) {
        results.errors.push(`Cycles fetch error: ${error}`);
      }
    }

    // Sync sleep data
    if (dataType === "all" || dataType === "sleep") {
      try {
        const sleepData = await whoopClient.getSleep(accessToken!, {
          start: startDate,
          end: endDate,
          limit: 25,
        });

        if (sleepData.records.length > 0) {
          for (const sleep of sleepData.records) {
            try {
              await prisma.whoopSleep.upsert({
                where: {
                  whoopUserId_sleepId: {
                    whoopUserId: user.id,
                    sleepId: sleep.id,
                  },
                },
                update: {
                  start: new Date(sleep.start),
                  end: new Date(sleep.end),
                  timezoneOffset: sleep.timezone_offset,
                  nap: sleep.nap,
                  scoreState: sleep.score_state,
                  totalInBedTime:
                    sleep.score?.stage_summary.total_in_bed_time_milli ?? null,
                  totalAwakeTime:
                    sleep.score?.stage_summary.total_awake_time_milli ?? null,
                  totalLightSleepTime:
                    sleep.score?.stage_summary.total_light_sleep_time_milli ??
                    null,
                  totalSlowWaveSleepTime:
                    sleep.score?.stage_summary
                      .total_slow_wave_sleep_time_milli ?? null,
                  totalRemSleepTime:
                    sleep.score?.stage_summary.total_rem_sleep_time_milli ??
                    null,
                  sleepCycleCount:
                    sleep.score?.stage_summary.sleep_cycle_count ?? null,
                  disturbanceCount:
                    sleep.score?.stage_summary.disturbance_count ?? null,
                  respiratoryRate: sleep.score?.respiratory_rate ?? null,
                  sleepPerformancePercentage:
                    sleep.score?.sleep_performance_percentage ?? null,
                  sleepConsistencyPercentage:
                    sleep.score?.sleep_consistency_percentage ?? null,
                  sleepEfficiencyPercentage:
                    sleep.score?.sleep_efficiency_percentage ?? null,
                  sleepNeedBaseline:
                    sleep.score?.sleep_needed.baseline_milli ?? null,
                  sleepNeedFromDebt:
                    sleep.score?.sleep_needed.need_from_sleep_debt_milli ??
                    null,
                  sleepNeedFromStrain:
                    sleep.score?.sleep_needed.need_from_recent_strain_milli ??
                    null,
                  sleepNeedFromNap:
                    sleep.score?.sleep_needed.need_from_recent_nap_milli ??
                    null,
                  updatedAt: new Date(sleep.updated_at),
                },
                create: {
                  whoopUserId: user.id,
                  sleepId: sleep.id,
                  start: new Date(sleep.start),
                  end: new Date(sleep.end),
                  timezoneOffset: sleep.timezone_offset,
                  nap: sleep.nap,
                  scoreState: sleep.score_state,
                  totalInBedTime:
                    sleep.score?.stage_summary.total_in_bed_time_milli ?? null,
                  totalAwakeTime:
                    sleep.score?.stage_summary.total_awake_time_milli ?? null,
                  totalLightSleepTime:
                    sleep.score?.stage_summary.total_light_sleep_time_milli ??
                    null,
                  totalSlowWaveSleepTime:
                    sleep.score?.stage_summary
                      .total_slow_wave_sleep_time_milli ?? null,
                  totalRemSleepTime:
                    sleep.score?.stage_summary.total_rem_sleep_time_milli ??
                    null,
                  sleepCycleCount:
                    sleep.score?.stage_summary.sleep_cycle_count ?? null,
                  disturbanceCount:
                    sleep.score?.stage_summary.disturbance_count ?? null,
                  respiratoryRate: sleep.score?.respiratory_rate ?? null,
                  sleepPerformancePercentage:
                    sleep.score?.sleep_performance_percentage ?? null,
                  sleepConsistencyPercentage:
                    sleep.score?.sleep_consistency_percentage ?? null,
                  sleepEfficiencyPercentage:
                    sleep.score?.sleep_efficiency_percentage ?? null,
                  sleepNeedBaseline:
                    sleep.score?.sleep_needed.baseline_milli ?? null,
                  sleepNeedFromDebt:
                    sleep.score?.sleep_needed.need_from_sleep_debt_milli ??
                    null,
                  sleepNeedFromStrain:
                    sleep.score?.sleep_needed.need_from_recent_strain_milli ??
                    null,
                  sleepNeedFromNap:
                    sleep.score?.sleep_needed.need_from_recent_nap_milli ??
                    null,
                  createdAt: new Date(sleep.created_at),
                  updatedAt: new Date(sleep.updated_at),
                },
              });
            } catch (error) {
              console.error(`Failed to upsert sleep ${sleep.id}:`, error);
            }
          }
          results.sleep = sleepData.records.length;
        }
      } catch (error) {
        results.errors.push(`Sleep fetch error: ${error}`);
      }
    }

    // Sync workout data
    if (dataType === "all" || dataType === "workouts") {
      try {
        const workoutData = await whoopClient.getWorkouts(accessToken!, {
          start: startDate,
          end: endDate,
          limit: 25,
        });

        if (workoutData.records.length > 0) {
          for (const workout of workoutData.records) {
            try {
              await prisma.whoopWorkout.upsert({
                where: {
                  whoopUserId_workoutId: {
                    whoopUserId: user.id,
                    workoutId: workout.id,
                  },
                },
                update: {
                  start: new Date(workout.start),
                  end: new Date(workout.end),
                  timezoneOffset: workout.timezone_offset,
                  sportId: workout.sport_id ?? null,
                  sportName: workout.sport_name ?? null,
                  scoreState: workout.score_state,
                  strain: workout.score?.strain ?? null,
                  averageHeartRate: workout.score?.average_heart_rate ?? null,
                  maxHeartRate: workout.score?.max_heart_rate ?? null,
                  kilojoule: workout.score?.kilojoule ?? null,
                  percentRecorded: workout.score?.percent_recorded ?? null,
                  distanceMeters: workout.score?.distance_meter ?? null,
                  altitudeGainMeters:
                    workout.score?.altitude_gain_meter ?? null,
                  altitudeChangeMeters:
                    workout.score?.altitude_change_meter ?? null,
                  zoneZeroDuration:
                    workout.score?.zone_durations?.zone_zero_milli ?? null,
                  zoneOneDuration:
                    workout.score?.zone_durations?.zone_one_milli ?? null,
                  zoneTwoDuration:
                    workout.score?.zone_durations?.zone_two_milli ?? null,
                  zoneThreeDuration:
                    workout.score?.zone_durations?.zone_three_milli ?? null,
                  zoneFourDuration:
                    workout.score?.zone_durations?.zone_four_milli ?? null,
                  zoneFiveDuration:
                    workout.score?.zone_durations?.zone_five_milli ?? null,
                  updatedAt: new Date(workout.updated_at),
                },
                create: {
                  whoopUserId: user.id,
                  workoutId: workout.id,
                  start: new Date(workout.start),
                  end: new Date(workout.end),
                  timezoneOffset: workout.timezone_offset,
                  sportId: workout.sport_id ?? null,
                  sportName: workout.sport_name ?? null,
                  scoreState: workout.score_state,
                  strain: workout.score?.strain ?? null,
                  averageHeartRate: workout.score?.average_heart_rate ?? null,
                  maxHeartRate: workout.score?.max_heart_rate ?? null,
                  kilojoule: workout.score?.kilojoule ?? null,
                  percentRecorded: workout.score?.percent_recorded ?? null,
                  distanceMeters: workout.score?.distance_meter ?? null,
                  altitudeGainMeters:
                    workout.score?.altitude_gain_meter ?? null,
                  altitudeChangeMeters:
                    workout.score?.altitude_change_meter ?? null,
                  zoneZeroDuration:
                    workout.score?.zone_durations?.zone_zero_milli ?? null,
                  zoneOneDuration:
                    workout.score?.zone_durations?.zone_one_milli ?? null,
                  zoneTwoDuration:
                    workout.score?.zone_durations?.zone_two_milli ?? null,
                  zoneThreeDuration:
                    workout.score?.zone_durations?.zone_three_milli ?? null,
                  zoneFourDuration:
                    workout.score?.zone_durations?.zone_four_milli ?? null,
                  zoneFiveDuration:
                    workout.score?.zone_durations?.zone_five_milli ?? null,
                  createdAt: new Date(workout.created_at),
                  updatedAt: new Date(workout.updated_at),
                },
              });
            } catch (error) {
              console.error(`Failed to upsert workout ${workout.id}:`, error);
            }
          }
          results.workouts = workoutData.records.length;
        }
      } catch (error) {
        results.errors.push(`Workouts fetch error: ${error}`);
      }
    }

    // Update last sync timestamp
    await prisma.whoopUser.update({
      where: { userId: user.id },
      data: {
        lastSyncAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      synced: results,
      period: {
        start: startDate,
        end: endDate,
        days,
      },
    });
  } catch (error) {
    console.error("WHOOP sync error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to check sync status
export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const { user } = await withAuth({ ensureSignedIn: true });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get WHOOP user data
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: {
        whoopUserId: true,
        email: true,
        firstName: true,
        lastName: true,
        lastSyncAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!whoopUser) {
      return NextResponse.json({ connected: false }, { status: 404 });
    }

    // Get data counts
    const [recoveryCount, cycleCount, sleepCount, workoutCount] =
      await Promise.all([
        prisma.whoopRecovery.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopCycle.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopSleep.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopWorkout.count({
          where: { whoopUserId: user.id },
        }),
      ]);

    return NextResponse.json({
      connected: true,
      user: {
        whoopUserId: whoopUser.whoopUserId,
        email: whoopUser.email,
        firstName: whoopUser.firstName,
        lastName: whoopUser.lastName,
        lastSyncAt: whoopUser.lastSyncAt,
        connectedAt: whoopUser.createdAt,
      },
      dataCounts: {
        recovery: recoveryCount,
        cycles: cycleCount,
        sleep: sleepCount,
        workouts: workoutCount,
      },
    });
  } catch (error) {
    console.error("WHOOP status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
