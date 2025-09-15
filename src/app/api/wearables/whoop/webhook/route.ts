import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { whoopClient } from "../client";
import type { WhoopWebhookEvent } from "../types";
import crypto from "crypto";

/**
 * WHOOP Webhook Endpoint
 *
 * This endpoint receives real-time updates from WHOOP when user data changes:
 * 1. Verifies webhook signature for security
 * 2. Processes different event types (recovery, cycle, sleep, workout, etc.)
 * 3. Fetches updated data from WHOOP API
 * 4. Updates local database with fresh data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-whoop-signature");

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event: WhoopWebhookEvent = JSON.parse(body);

    console.log(
      `Received WHOOP webhook event: ${event.type} for user ${event.data.user_id}`
    );

    // Process the webhook event
    await processWebhookEvent(event);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WHOOP webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Verify webhook signature using HMAC-SHA256
 */
function verifyWebhookSignature(
  body: string,
  signature: string | null
): boolean {
  if (!signature) {
    return false;
  }

  const webhookSecret =
    process.env.WHOOP_WEBHOOK_SECRET || process.env.WHOOP_CLIENT_SECRET;
  if (!webhookSecret) {
    console.error("Missing WHOOP webhook secret");
    return false;
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body, "utf8")
      .digest("hex");

    // Remove "sha256=" prefix if present
    const cleanSignature = signature.replace("sha256=", "");

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(cleanSignature, "hex")
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

/**
 * Process different types of webhook events
 */
async function processWebhookEvent(event: WhoopWebhookEvent): Promise<void> {
  // Find the user associated with this WHOOP user ID
  const whoopUser = await prisma.whoopUser.findUnique({
    where: { whoopUserId: event.data.user_id },
    select: {
      userId: true,
      accessToken: true,
      refreshToken: true,
      expiresAt: true,
    },
  });

  if (!whoopUser) {
    console.error(`No user found for WHOOP user ID ${event.data.user_id}`);
    return;
  }

  // Check if token needs refresh
  let accessToken = whoopUser.accessToken;
  if (!accessToken) {
    console.error("No access token found for WHOOP user");
    return;
  }

  if (whoopUser.expiresAt && new Date(whoopUser.expiresAt) <= new Date()) {
    if (!whoopUser.refreshToken) {
      console.error("No refresh token found for WHOOP user");
      return;
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
        where: { userId: whoopUser.userId },
        data: {
          accessToken: refreshedTokens.access_token,
          refreshToken: refreshedTokens.refresh_token,
          expiresAt,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Token refresh failed:", error);
      return;
    }
  }

  // Process event based on type
  switch (event.type) {
    case "recovery.updated":
      await handleRecoveryUpdate(whoopUser.userId, accessToken, event.data.id);
      break;

    case "cycle.updated":
      await handleCycleUpdate(whoopUser.userId, accessToken, event.data.id);
      break;

    case "sleep.updated":
      await handleSleepUpdate(whoopUser.userId, accessToken, event.data.id);
      break;

    case "workout.updated":
      await handleWorkoutUpdate(whoopUser.userId, accessToken, event.data.id);
      break;

    case "body_measurement.updated":
      await handleBodyMeasurementUpdate(whoopUser.userId, accessToken);
      break;

    case "user.updated":
      await handleUserUpdate(whoopUser.userId, accessToken);
      break;

    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }
}

/**
 * Handle recovery data updates
 */
async function handleRecoveryUpdate(
  userId: string,
  accessToken: string,
  recoveryId?: number
): Promise<void> {
  try {
    if (!recoveryId) {
      console.error("Recovery ID missing in webhook event");
      return;
    }

    const recovery = await whoopClient.getRecoveryById(accessToken, recoveryId);

    await prisma.whoopRecovery.upsert({
      where: {
        whoopUserId_cycleId: {
          whoopUserId: userId,
          cycleId: recovery.cycle_id,
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
        whoopUserId: userId,
        cycleId: recovery.cycle_id,
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

    console.log(
      `Updated recovery data for user ${userId}, cycle ${recovery.cycle_id}`
    );
  } catch (error) {
    console.error("Error handling recovery update:", error);
  }
}

/**
 * Handle cycle data updates
 */
async function handleCycleUpdate(
  userId: string,
  accessToken: string,
  cycleId?: number
): Promise<void> {
  try {
    if (!cycleId) {
      console.error("Cycle ID missing in webhook event");
      return;
    }

    const cycle = await whoopClient.getCycleById(accessToken, cycleId);

    await prisma.whoopCycle.upsert({
      where: {
        whoopUserId_cycleId: {
          whoopUserId: userId,
          cycleId: cycle.id,
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
        whoopUserId: userId,
        cycleId: cycle.id,
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

    console.log(`Updated cycle data for user ${userId}, cycle ${cycle.id}`);
  } catch (error) {
    console.error("Error handling cycle update:", error);
  }
}

/**
 * Handle sleep data updates
 */
async function handleSleepUpdate(
  userId: string,
  accessToken: string,
  sleepId?: number
): Promise<void> {
  try {
    if (!sleepId) {
      console.error("Sleep ID missing in webhook event");
      return;
    }

    const sleep = await whoopClient.getSleepById(accessToken, sleepId);

    await prisma.whoopSleep.upsert({
      where: {
        whoopUserId_sleepId: {
          whoopUserId: userId,
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
          sleep.score?.stage_summary.total_light_sleep_time_milli ?? null,
        totalSlowWaveSleepTime:
          sleep.score?.stage_summary.total_slow_wave_sleep_time_milli ?? null,
        totalRemSleepTime:
          sleep.score?.stage_summary.total_rem_sleep_time_milli ?? null,
        sleepCycleCount: sleep.score?.stage_summary.sleep_cycle_count ?? null,
        disturbanceCount: sleep.score?.stage_summary.disturbance_count ?? null,
        respiratoryRate: sleep.score?.respiratory_rate ?? null,
        sleepPerformancePercentage:
          sleep.score?.sleep_performance_percentage ?? null,
        sleepConsistencyPercentage:
          sleep.score?.sleep_consistency_percentage ?? null,
        sleepEfficiencyPercentage:
          sleep.score?.sleep_efficiency_percentage ?? null,
        updatedAt: new Date(sleep.updated_at),
      },
      create: {
        whoopUserId: userId,
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
          sleep.score?.stage_summary.total_light_sleep_time_milli ?? null,
        totalSlowWaveSleepTime:
          sleep.score?.stage_summary.total_slow_wave_sleep_time_milli ?? null,
        totalRemSleepTime:
          sleep.score?.stage_summary.total_rem_sleep_time_milli ?? null,
        sleepCycleCount: sleep.score?.stage_summary.sleep_cycle_count ?? null,
        disturbanceCount: sleep.score?.stage_summary.disturbance_count ?? null,
        respiratoryRate: sleep.score?.respiratory_rate ?? null,
        sleepPerformancePercentage:
          sleep.score?.sleep_performance_percentage ?? null,
        sleepConsistencyPercentage:
          sleep.score?.sleep_consistency_percentage ?? null,
        sleepEfficiencyPercentage:
          sleep.score?.sleep_efficiency_percentage ?? null,
        createdAt: new Date(sleep.created_at),
        updatedAt: new Date(sleep.updated_at),
      },
    });

    console.log(`Updated sleep data for user ${userId}, sleep ${sleep.id}`);
  } catch (error) {
    console.error("Error handling sleep update:", error);
  }
}

/**
 * Handle workout data updates
 */
async function handleWorkoutUpdate(
  userId: string,
  accessToken: string,
  workoutId?: number
): Promise<void> {
  try {
    if (!workoutId) {
      console.error("Workout ID missing in webhook event");
      return;
    }

    const workout = await whoopClient.getWorkoutById(accessToken, workoutId);

    await prisma.whoopWorkout.upsert({
      where: {
        whoopUserId_workoutId: {
          whoopUserId: userId,
          workoutId: workout.id,
        },
      },
      update: {
        start: new Date(workout.start),
        end: new Date(workout.end),
        timezoneOffset: workout.timezone_offset,
        sportId: workout.sport_id,
        scoreState: workout.score_state,
        strain: workout.score?.strain ?? null,
        averageHeartRate: workout.score?.average_heart_rate ?? null,
        maxHeartRate: workout.score?.max_heart_rate ?? null,
        kilojoule: workout.score?.kilojoule ?? null,
        percentRecorded: workout.score?.percent_recorded ?? null,
        distanceMeters: workout.score?.distance_meter ?? null,
        altitudeGainMeters: workout.score?.altitude_gain_meter ?? null,
        altitudeChangeMeters: workout.score?.altitude_change_meter ?? null,
        updatedAt: new Date(workout.updated_at),
      },
      create: {
        whoopUserId: userId,
        workoutId: workout.id,
        start: new Date(workout.start),
        end: new Date(workout.end),
        timezoneOffset: workout.timezone_offset,
        sportId: workout.sport_id,
        scoreState: workout.score_state,
        strain: workout.score?.strain ?? null,
        averageHeartRate: workout.score?.average_heart_rate ?? null,
        maxHeartRate: workout.score?.max_heart_rate ?? null,
        kilojoule: workout.score?.kilojoule ?? null,
        percentRecorded: workout.score?.percent_recorded ?? null,
        distanceMeters: workout.score?.distance_meter ?? null,
        altitudeGainMeters: workout.score?.altitude_gain_meter ?? null,
        altitudeChangeMeters: workout.score?.altitude_change_meter ?? null,
        createdAt: new Date(workout.created_at),
        updatedAt: new Date(workout.updated_at),
      },
    });

    console.log(
      `Updated workout data for user ${userId}, workout ${workout.id}`
    );
  } catch (error) {
    console.error("Error handling workout update:", error);
  }
}

/**
 * Handle body measurement updates
 */
async function handleBodyMeasurementUpdate(
  userId: string,
  accessToken: string
): Promise<void> {
  try {
    const bodyMeasurement = await whoopClient.getBodyMeasurement(accessToken);

    // Update the user's body measurement data
    await prisma.whoopUser.update({
      where: { userId },
      data: {
        heightMeter: bodyMeasurement.height_meter,
        weightKilogram: bodyMeasurement.weight_kilogram,
        maxHeartRate: bodyMeasurement.max_heart_rate,
        updatedAt: new Date(),
      },
    });

    console.log(`Updated body measurement data for user ${userId}`);
  } catch (error) {
    console.error("Error handling body measurement update:", error);
  }
}

/**
 * Handle user profile updates
 */
async function handleUserUpdate(
  userId: string,
  accessToken: string
): Promise<void> {
  try {
    const whoopUser = await whoopClient.getUser(accessToken);

    // Update the user's profile data
    await prisma.whoopUser.update({
      where: { userId },
      data: {
        email: whoopUser.email,
        firstName: whoopUser.first_name,
        lastName: whoopUser.last_name,
        updatedAt: new Date(),
      },
    });

    console.log(`Updated user profile data for user ${userId}`);
  } catch (error) {
    console.error("Error handling user update:", error);
  }
}

// Cursor rules applied correctly.
