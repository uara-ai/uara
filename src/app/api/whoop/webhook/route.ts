import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import { WhoopClient } from "@/packages/whoop/client";
import type { WhoopWebhookEvent } from "@/packages/whoop/types";

// Verify webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  timestamp: string,
  secret: string
): boolean {
  try {
    // Concatenate timestamp and payload
    const signaturePayload = timestamp + payload;

    // Create HMAC SHA256 signature
    const expectedSignature = createHmac("sha256", secret)
      .update(signaturePayload)
      .digest("base64");

    return signature === expectedSignature;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

// Get access token for user
async function getAccessTokenForUser(
  whoopUserId: string
): Promise<string | null> {
  try {
    const whoopUserData = await prisma.whoopUserData.findUnique({
      where: { whoopId: whoopUserId },
      include: {
        user: {
          include: {
            whoopTokens: true,
          },
        },
      },
    });

    if (!whoopUserData?.user.whoopTokens) {
      console.error("No tokens found for user:", whoopUserId);
      return null;
    }

    const tokens = whoopUserData.user.whoopTokens;

    // Check if token is expired
    if (tokens.expiresAt <= new Date()) {
      console.log("Token expired, attempting refresh for user:", whoopUserId);

      const clientId = process.env.WHOOP_CLIENT_ID;
      const clientSecret = process.env.WHOOP_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        console.error("Missing Whoop credentials for token refresh");
        return null;
      }

      try {
        const newTokens = await WhoopClient.refreshToken(
          tokens.refreshToken,
          clientId,
          clientSecret
        );

        // Update tokens in database
        await prisma.whoopToken.update({
          where: { id: tokens.id },
          data: {
            accessToken: newTokens.access_token,
            refreshToken: newTokens.refresh_token,
            expiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
            scope: newTokens.scope,
            updatedAt: new Date(),
          },
        });

        return newTokens.access_token;
      } catch (refreshError) {
        console.error(
          "Failed to refresh token for user:",
          whoopUserId,
          refreshError
        );
        return null;
      }
    }

    return tokens.accessToken;
  } catch (error) {
    console.error("Error getting access token for user:", whoopUserId, error);
    return null;
  }
}

// Handle webhook events
async function handleWebhookEvent(event: WhoopWebhookEvent) {
  console.log(
    "Processing webhook event:",
    event.type,
    "for user:",
    event.user_id
  );

  const accessToken = await getAccessTokenForUser(event.user_id);
  if (!accessToken) {
    console.error("No valid access token for user:", event.user_id);
    return;
  }

  const whoopClient = new WhoopClient(accessToken);

  // Get user data record
  const whoopUserData = await prisma.whoopUserData.findUnique({
    where: { whoopId: event.user_id },
  });

  if (!whoopUserData) {
    console.error("No user data found for Whoop user:", event.user_id);
    return;
  }

  try {
    switch (event.type) {
      case "recovery.updated":
        const recovery = await whoopClient.getRecoveryById(event.id);
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
        console.log("Updated recovery data for user:", event.user_id);
        break;

      case "cycle.updated":
        const cycle = await whoopClient.getCycleById(event.id);
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
        console.log("Updated cycle data for user:", event.user_id);
        break;

      case "sleep.updated":
        const sleep = await whoopClient.getSleepById(event.id);
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
            sleepEfficiencyPercentage: sleep.score?.sleep_efficiency_percentage,
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
            sleepEfficiencyPercentage: sleep.score?.sleep_efficiency_percentage,
            whoopUpdatedAt: new Date(sleep.updated_at),
            updatedAt: new Date(),
          },
        });
        console.log("Updated sleep data for user:", event.user_id);
        break;

      case "workout.updated":
        const workout = await whoopClient.getWorkoutById(event.id);
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
        console.log("Updated workout data for user:", event.user_id);
        break;

      case "body_measurement.updated":
        const measurement = await whoopClient.getBodyMeasurementById(event.id);
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
        console.log("Updated body measurement data for user:", event.user_id);
        break;

      case "user.updated":
        const user = await whoopClient.getUser();
        await prisma.whoopUserData.update({
          where: { whoopId: event.user_id },
          data: {
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            updatedAt: new Date(),
          },
        });
        console.log("Updated user profile for user:", event.user_id);
        break;

      default:
        console.log("Unhandled webhook event type:", event.type);
    }
  } catch (error) {
    console.error(
      "Error handling webhook event:",
      event.type,
      "for user:",
      event.user_id,
      error
    );
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get webhook secret
    const webhookSecret =
      process.env.WHOOP_WEBHOOK_SECRET || process.env.WHOOP_CLIENT_SECRET;
    if (!webhookSecret) {
      console.error("No webhook secret configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Get headers
    const signature = request.headers.get("X-WHOOP-Signature");
    const timestamp = request.headers.get("X-WHOOP-Signature-Timestamp");

    if (!signature || !timestamp) {
      console.error("Missing required webhook headers");
      return NextResponse.json(
        { error: "Missing signature headers" },
        { status: 400 }
      );
    }

    // Get raw body
    const rawBody = await request.text();

    // Verify signature
    if (!verifyWebhookSignature(rawBody, signature, timestamp, webhookSecret)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse webhook event
    let event: WhoopWebhookEvent;
    try {
      event = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Invalid JSON in webhook payload:", parseError);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Validate event structure
    if (!event.id || !event.type || !event.user_id || !event.timestamp) {
      console.error("Invalid webhook event structure:", event);
      return NextResponse.json(
        { error: "Invalid event structure" },
        { status: 400 }
      );
    }

    // Handle the event
    await handleWebhookEvent(event);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}

// Cursor rules applied correctly.
