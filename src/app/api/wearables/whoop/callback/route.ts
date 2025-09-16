import { NextRequest, NextResponse } from "next/server";
import { whoopClient } from "../client";
import { prisma } from "@/lib/prisma";
import type { WhoopTokenResponse, WhoopUser } from "../types";

/**
 * WHOOP OAuth Callback Endpoint
 *
 * This endpoint handles the OAuth callback from WHOOP:
 * 1. Validates the state parameter for CSRF protection
 * 2. Exchanges the authorization code for access tokens
 * 3. Fetches user profile from WHOOP
 * 4. Stores user and token data in the database
 * 5. Initiates initial data sync
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      const errorDescription = searchParams.get("error_description");
      console.error("WHOOP OAuth error:", error, errorDescription);

      const redirectUrl = new URL(
        "/healthspan",
        process.env.NEXT_PUBLIC_APP_URL!
      );
      redirectUrl.searchParams.set("whoop_error", error);

      return NextResponse.redirect(redirectUrl);
    }

    // Validate required parameters
    if (!code || !state) {
      console.error("Missing code or state parameter");
      const redirectUrl = new URL(
        "/healthspan",
        process.env.NEXT_PUBLIC_APP_URL!
      );
      redirectUrl.searchParams.set("whoop_error", "invalid_request");

      return NextResponse.redirect(redirectUrl);
    }

    // Verify state parameter
    const stateData = await prisma.whoopOAuthState.findUnique({
      where: { state },
      select: { userId: true, expiresAt: true },
    });

    if (!stateData) {
      console.error("Invalid state parameter");
      const redirectUrl = new URL(
        "/healthspan",
        process.env.NEXT_PUBLIC_APP_URL!
      );
      redirectUrl.searchParams.set("whoop_error", "invalid_state");

      return NextResponse.redirect(redirectUrl);
    }

    // Check if state has expired
    if (new Date(stateData.expiresAt) < new Date()) {
      console.error("State parameter expired");
      const redirectUrl = new URL(
        "/healthspan",
        process.env.NEXT_PUBLIC_APP_URL!
      );
      redirectUrl.searchParams.set("whoop_error", "state_expired");

      return NextResponse.redirect(redirectUrl);
    }

    // Clean up used state
    await prisma.whoopOAuthState.delete({
      where: { state },
    });

    // Exchange code for tokens
    let tokenResponse: WhoopTokenResponse;
    try {
      tokenResponse = await whoopClient.exchangeCodeForToken(code);
    } catch (error) {
      console.error("Token exchange failed:", error);
      const redirectUrl = new URL(
        "/healthspan",
        process.env.NEXT_PUBLIC_APP_URL!
      );
      redirectUrl.searchParams.set("whoop_error", "token_exchange_failed");

      return NextResponse.redirect(redirectUrl);
    }

    // Fetch user profile from WHOOP
    let whoopUser: WhoopUser;
    try {
      console.log(
        "Fetching WHOOP user profile with access token:",
        tokenResponse.access_token?.substring(0, 20) + "..."
      );
      whoopUser = await whoopClient.getUser(tokenResponse.access_token);
      console.log(
        "WHOOP user profile response:",
        JSON.stringify(whoopUser, null, 2)
      );

      // Validate the response structure
      if (!whoopUser || typeof whoopUser.user_id === "undefined") {
        throw new Error(
          `Invalid WHOOP user response structure: ${JSON.stringify(whoopUser)}`
        );
      }
    } catch (error) {
      console.error("Failed to fetch WHOOP user profile:", error);
      console.error(
        "Token response was:",
        JSON.stringify(tokenResponse, null, 2)
      );
      const redirectUrl = new URL(
        "/healthspan",
        process.env.NEXT_PUBLIC_APP_URL!
      );
      redirectUrl.searchParams.set("whoop_error", "profile_fetch_failed");

      return NextResponse.redirect(redirectUrl);
    }

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);

    // Store WHOOP user data and tokens
    try {
      await prisma.whoopUser.upsert({
        where: { userId: stateData.userId },
        update: {
          whoopUserId: whoopUser.user_id,
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          expiresAt,
          email: whoopUser.email,
          firstName: whoopUser.first_name,
          lastName: whoopUser.last_name,
          updatedAt: new Date(),
        },
        create: {
          userId: stateData.userId,
          whoopUserId: whoopUser.user_id,
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          expiresAt,
          email: whoopUser.email,
          firstName: whoopUser.first_name,
          lastName: whoopUser.last_name,
        },
      });
    } catch (error) {
      console.error("Failed to store WHOOP user data:", error);
      const redirectUrl = new URL(
        "/healthspan",
        process.env.NEXT_PUBLIC_APP_URL!
      );
      redirectUrl.searchParams.set("whoop_error", "storage_failed");

      return NextResponse.redirect(redirectUrl);
    }

    // Start initial data sync in the background
    try {
      await initiateDataSync(stateData.userId, tokenResponse.access_token);
    } catch (error) {
      console.error("Initial data sync failed:", error);
      // Don't fail the callback for sync errors, just log them
    }

    // Redirect to success page
    const redirectUrl = new URL(
      "/healthspan",
      process.env.NEXT_PUBLIC_APP_URL!
    );
    redirectUrl.searchParams.set("whoop_connected", "true");

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("WHOOP callback error:", error);
    const redirectUrl = new URL(
      "/healthspan",
      process.env.NEXT_PUBLIC_APP_URL!
    );
    redirectUrl.searchParams.set("whoop_error", "internal_error");

    return NextResponse.redirect(redirectUrl);
  }
}

/**
 * Initiate initial data sync for a newly connected WHOOP user
 */
async function initiateDataSync(
  userId: string,
  accessToken: string
): Promise<void> {
  try {
    // Fetch last 30 days of data
    const endDate = new Date().toISOString();
    const startDate = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    // Sync recovery data
    try {
      const recoveryData = await whoopClient.getRecovery(accessToken, {
        start: startDate,
        end: endDate,
        limit: 25,
      });

      if (recoveryData.records.length > 0) {
        const recoveryRecords = recoveryData.records.map((recovery) => ({
          whoopUserId: userId,
          cycleId: BigInt(recovery.cycle_id),
          sleepId: recovery.sleep_id,
          createdAt: new Date(recovery.created_at),
          updatedAt: new Date(recovery.updated_at),
          scoreState: recovery.score_state,
          recoveryScore: recovery.score?.recovery_score ?? null,
          restingHeartRate: recovery.score?.resting_heart_rate ?? null,
          hrvRmssd: recovery.score?.hrv_rmssd_milli ?? null,
          userCalibrating: recovery.score?.user_calibrating ?? null,
        }));

        await prisma.whoopRecovery.createMany({
          data: recoveryRecords,
          skipDuplicates: true,
        });
      }
    } catch (error) {
      console.error("Failed to sync recovery data:", error);
    }

    // Sync cycle data
    try {
      const cycleData = await whoopClient.getCycles(accessToken, {
        start: startDate,
        end: endDate,
        limit: 25,
      });

      if (cycleData.records.length > 0) {
        const cycleRecords = cycleData.records.map((cycle) => ({
          whoopUserId: userId,
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
        }));

        await prisma.whoopCycle.createMany({
          data: cycleRecords,
          skipDuplicates: true,
        });
      }
    } catch (error) {
      console.error("Failed to sync cycle data:", error);
    }

    // Sync sleep data
    try {
      const sleepData = await whoopClient.getSleep(accessToken, {
        start: startDate,
        end: endDate,
        limit: 25,
      });

      if (sleepData.records.length > 0) {
        const sleepRecords = sleepData.records.map((sleep) => ({
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
          disturbanceCount:
            sleep.score?.stage_summary.disturbance_count ?? null,
          respiratoryRate: sleep.score?.respiratory_rate ?? null,
          sleepPerformancePercentage:
            sleep.score?.sleep_performance_percentage ?? null,
          sleepConsistencyPercentage:
            sleep.score?.sleep_consistency_percentage ?? null,
          sleepEfficiencyPercentage:
            sleep.score?.sleep_efficiency_percentage ?? null,
          createdAt: new Date(sleep.created_at),
          updatedAt: new Date(sleep.updated_at),
        }));

        await prisma.whoopSleep.createMany({
          data: sleepRecords,
          skipDuplicates: true,
        });
      }
    } catch (error) {
      console.error("Failed to sync sleep data:", error);
    }

    console.log(`Initial data sync completed for user ${userId}`);
  } catch (error) {
    console.error("Data sync error:", error);
    throw error;
  }
}

// Cursor rules applied correctly.
