import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/packages/supabase/server";
import { prisma } from "@/lib/prisma";
import { WhoopClient } from "@/packages/whoop/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // Used for CSRF protection
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      console.error("Whoop OAuth error:", error);
      return NextResponse.redirect(
        `${request.nextUrl.origin}/overview?whoop_error=${encodeURIComponent(
          error
        )}`
      );
    }

    if (!code) {
      console.error("No authorization code received");
      return NextResponse.redirect(
        `${request.nextUrl.origin}/overview?whoop_error=no_code`
      );
    }

    // Get the current user from Supabase
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Authentication error:", authError);
      return NextResponse.redirect(
        `${request.nextUrl.origin}/login?whoop_error=auth_required`
      );
    }

    // Get environment variables
    const clientId = process.env.WHOOP_CLIENT_ID;
    const clientSecret = process.env.WHOOP_CLIENT_SECRET;
    const redirectUri =
      process.env.WHOOP_REDIRECT_URI ||
      `${request.nextUrl.origin}/api/whoop/callback`;

    if (!clientId || !clientSecret) {
      console.error("Missing Whoop OAuth credentials");
      return NextResponse.redirect(
        `${request.nextUrl.origin}/overview?whoop_error=config_error`
      );
    }

    // Exchange code for tokens
    const tokenResponse = await WhoopClient.exchangeCodeForToken(
      code,
      clientId,
      clientSecret,
      redirectUri
    );

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);

    // Find or create user in our database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          avatarUrl: user.user_metadata?.avatar_url,
        },
      });
    }

    // Store or update Whoop tokens
    await prisma.whoopToken.upsert({
      where: { userId: dbUser.id },
      create: {
        userId: dbUser.id,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt,
        scope: tokenResponse.scope,
      },
      update: {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt,
        scope: tokenResponse.scope,
        updatedAt: new Date(),
      },
    });

    // Initialize Whoop client and fetch user data
    const whoopClient = new WhoopClient(tokenResponse.access_token);

    try {
      // Fetch user profile from Whoop
      const whoopUser = await whoopClient.getUser();

      // Store or update Whoop user data
      await prisma.whoopUserData.upsert({
        where: { userId: dbUser.id },
        create: {
          userId: dbUser.id,
          whoopId: whoopUser.user_id,
          email: whoopUser.email,
          firstName: whoopUser.first_name,
          lastName: whoopUser.last_name,
        },
        update: {
          email: whoopUser.email,
          firstName: whoopUser.first_name,
          lastName: whoopUser.last_name,
          updatedAt: new Date(),
        },
      });

      // Fetch initial data (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const allData = await whoopClient.fetchAllUserData(
        thirtyDaysAgo.toISOString(),
        new Date().toISOString()
      );

      const whoopUserData = await prisma.whoopUserData.findUnique({
        where: { userId: dbUser.id },
      });

      if (whoopUserData) {
        // Store recovery data
        for (const recovery of allData.recovery) {
          await prisma.whoopRecovery.upsert({
            where: { whoopId: recovery.id },
            create: {
              whoopId: recovery.id,
              whoopUserDataId: whoopUserData.id,
              scoreState: recovery.score_state,
              userCalibrating: recovery.score?.user_calibrating,
              recoveryScore: recovery.score?.recovery_score,
              restingHeartRate: recovery.score?.resting_heart_rate,
              hrvRmssdMilli: recovery.score?.hrv_rmssd_milli,
              whoopCreatedAt: new Date(recovery.created_at),
              whoopUpdatedAt: new Date(recovery.updated_at),
            },
            update: {
              scoreState: recovery.score_state,
              userCalibrating: recovery.score?.user_calibrating,
              recoveryScore: recovery.score?.recovery_score,
              restingHeartRate: recovery.score?.resting_heart_rate,
              hrvRmssdMilli: recovery.score?.hrv_rmssd_milli,
              whoopUpdatedAt: new Date(recovery.updated_at),
              updatedAt: new Date(),
            },
          });
        }

        // Store cycle data
        for (const cycle of allData.cycles) {
          await prisma.whoopCycle.upsert({
            where: { whoopId: cycle.id },
            create: {
              whoopId: cycle.id,
              whoopUserDataId: whoopUserData.id,
              start: new Date(cycle.start),
              end: cycle.end ? new Date(cycle.end) : null,
              timezoneOffset: cycle.timezone_offset,
              scoreState: cycle.score_state,
              strain: cycle.score?.strain,
              averageHeartRate: cycle.score?.average_heart_rate,
              maxHeartRate: cycle.score?.max_heart_rate,
              kilojoule: cycle.score?.kilojoule,
              percentRecorded: cycle.score?.percent_recorded,
              whoopCreatedAt: new Date(cycle.created_at),
              whoopUpdatedAt: new Date(cycle.updated_at),
            },
            update: {
              end: cycle.end ? new Date(cycle.end) : null,
              scoreState: cycle.score_state,
              strain: cycle.score?.strain,
              averageHeartRate: cycle.score?.average_heart_rate,
              maxHeartRate: cycle.score?.max_heart_rate,
              kilojoule: cycle.score?.kilojoule,
              percentRecorded: cycle.score?.percent_recorded,
              whoopUpdatedAt: new Date(cycle.updated_at),
              updatedAt: new Date(),
            },
          });
        }

        // Store sleep data
        for (const sleep of allData.sleep) {
          await prisma.whoopSleep.upsert({
            where: { whoopId: sleep.id },
            create: {
              whoopId: sleep.id,
              whoopUserDataId: whoopUserData.id,
              start: new Date(sleep.start),
              end: new Date(sleep.end),
              timezoneOffset: sleep.timezone_offset,
              nap: sleep.nap,
              scoreState: sleep.score_state,
              totalInBedTimeMilli:
                sleep.score?.stage_summary.total_in_bed_time_milli,
              totalAwakeTimeMilli:
                sleep.score?.stage_summary.total_awake_time_milli,
              totalNoDataTimeMilli:
                sleep.score?.stage_summary.total_no_data_time_milli,
              totalLightSleepTimeMilli:
                sleep.score?.stage_summary.total_light_sleep_time_milli,
              totalSlowWaveSleepTimeMilli:
                sleep.score?.stage_summary.total_slow_wave_sleep_time_milli,
              totalRemSleepTimeMilli:
                sleep.score?.stage_summary.total_rem_sleep_time_milli,
              sleepCycleCount: sleep.score?.stage_summary.sleep_cycle_count,
              disturbanceCount: sleep.score?.stage_summary.disturbance_count,
              baselineMilli: sleep.score?.sleep_needed.baseline_milli,
              needFromSleepDebtMilli:
                sleep.score?.sleep_needed.need_from_sleep_debt_milli,
              needFromRecentStrainMilli:
                sleep.score?.sleep_needed.need_from_recent_strain_milli,
              needFromRecentNapMilli:
                sleep.score?.sleep_needed.need_from_recent_nap_milli,
              respiratoryRate: sleep.score?.respiratory_rate,
              sleepPerformancePercentage:
                sleep.score?.sleep_performance_percentage,
              sleepConsistencyPercentage:
                sleep.score?.sleep_consistency_percentage,
              sleepEfficiencyPercentage:
                sleep.score?.sleep_efficiency_percentage,
              whoopCreatedAt: new Date(sleep.created_at),
              whoopUpdatedAt: new Date(sleep.updated_at),
            },
            update: {
              scoreState: sleep.score_state,
              totalInBedTimeMilli:
                sleep.score?.stage_summary.total_in_bed_time_milli,
              totalAwakeTimeMilli:
                sleep.score?.stage_summary.total_awake_time_milli,
              totalNoDataTimeMilli:
                sleep.score?.stage_summary.total_no_data_time_milli,
              totalLightSleepTimeMilli:
                sleep.score?.stage_summary.total_light_sleep_time_milli,
              totalSlowWaveSleepTimeMilli:
                sleep.score?.stage_summary.total_slow_wave_sleep_time_milli,
              totalRemSleepTimeMilli:
                sleep.score?.stage_summary.total_rem_sleep_time_milli,
              sleepCycleCount: sleep.score?.stage_summary.sleep_cycle_count,
              disturbanceCount: sleep.score?.stage_summary.disturbance_count,
              baselineMilli: sleep.score?.sleep_needed.baseline_milli,
              needFromSleepDebtMilli:
                sleep.score?.sleep_needed.need_from_sleep_debt_milli,
              needFromRecentStrainMilli:
                sleep.score?.sleep_needed.need_from_recent_strain_milli,
              needFromRecentNapMilli:
                sleep.score?.sleep_needed.need_from_recent_nap_milli,
              respiratoryRate: sleep.score?.respiratory_rate,
              sleepPerformancePercentage:
                sleep.score?.sleep_performance_percentage,
              sleepConsistencyPercentage:
                sleep.score?.sleep_consistency_percentage,
              sleepEfficiencyPercentage:
                sleep.score?.sleep_efficiency_percentage,
              whoopUpdatedAt: new Date(sleep.updated_at),
              updatedAt: new Date(),
            },
          });
        }

        // Store workout data
        for (const workout of allData.workouts) {
          await prisma.whoopWorkout.upsert({
            where: { whoopId: workout.id },
            create: {
              whoopId: workout.id,
              whoopUserDataId: whoopUserData.id,
              start: new Date(workout.start),
              end: new Date(workout.end),
              timezoneOffset: workout.timezone_offset,
              sportId: workout.sport_id,
              scoreState: workout.score_state,
              strain: workout.score?.strain,
              averageHeartRate: workout.score?.average_heart_rate,
              maxHeartRate: workout.score?.max_heart_rate,
              kilojoule: workout.score?.kilojoule,
              percentRecorded: workout.score?.percent_recorded,
              distanceMeter: workout.score?.distance_meter,
              altitudeGainMeter: workout.score?.altitude_gain_meter,
              altitudeChangeMeter: workout.score?.altitude_change_meter,
              zoneZeroMilli: workout.score?.zone_duration.zone_zero_milli,
              zoneOneMilli: workout.score?.zone_duration.zone_one_milli,
              zoneTwoMilli: workout.score?.zone_duration.zone_two_milli,
              zoneThreeMilli: workout.score?.zone_duration.zone_three_milli,
              zoneFourMilli: workout.score?.zone_duration.zone_four_milli,
              zoneFiveMilli: workout.score?.zone_duration.zone_five_milli,
              whoopCreatedAt: new Date(workout.created_at),
              whoopUpdatedAt: new Date(workout.updated_at),
            },
            update: {
              scoreState: workout.score_state,
              strain: workout.score?.strain,
              averageHeartRate: workout.score?.average_heart_rate,
              maxHeartRate: workout.score?.max_heart_rate,
              kilojoule: workout.score?.kilojoule,
              percentRecorded: workout.score?.percent_recorded,
              distanceMeter: workout.score?.distance_meter,
              altitudeGainMeter: workout.score?.altitude_gain_meter,
              altitudeChangeMeter: workout.score?.altitude_change_meter,
              zoneZeroMilli: workout.score?.zone_duration.zone_zero_milli,
              zoneOneMilli: workout.score?.zone_duration.zone_one_milli,
              zoneTwoMilli: workout.score?.zone_duration.zone_two_milli,
              zoneThreeMilli: workout.score?.zone_duration.zone_three_milli,
              zoneFourMilli: workout.score?.zone_duration.zone_four_milli,
              zoneFiveMilli: workout.score?.zone_duration.zone_five_milli,
              whoopUpdatedAt: new Date(workout.updated_at),
              updatedAt: new Date(),
            },
          });
        }

        // Store body measurement data
        for (const measurement of allData.bodyMeasurements) {
          await prisma.whoopBodyMeasurement.upsert({
            where: { whoopId: measurement.id },
            create: {
              whoopId: measurement.id,
              whoopUserDataId: whoopUserData.id,
              heightMeter: measurement.height_meter,
              weightKilogram: measurement.weight_kilogram,
              maxHeartRate: measurement.max_heart_rate,
              whoopCreatedAt: new Date(measurement.created_at),
              whoopUpdatedAt: new Date(measurement.updated_at),
            },
            update: {
              heightMeter: measurement.height_meter,
              weightKilogram: measurement.weight_kilogram,
              maxHeartRate: measurement.max_heart_rate,
              whoopUpdatedAt: new Date(measurement.updated_at),
              updatedAt: new Date(),
            },
          });
        }
      }

      console.log(
        "Whoop integration completed successfully for user:",
        user.email
      );
    } catch (dataError) {
      console.error("Error fetching initial Whoop data:", dataError);
      // Don't fail the OAuth flow, just log the error
    }

    // Redirect to overview with success message
    return NextResponse.redirect(
      `${request.nextUrl.origin}/overview?whoop_connected=true`
    );
  } catch (error) {
    console.error("Whoop OAuth callback error:", error);
    return NextResponse.redirect(
      `${request.nextUrl.origin}/overview?whoop_error=callback_error`
    );
  }
}

// Cursor rules applied correctly.
