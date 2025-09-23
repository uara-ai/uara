import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/prisma";
import {
  getDateRange,
  validateTimeline,
  validateScoreState,
  calculatePagination,
  createApiResponse,
  formatWorkoutData,
  getAvailableTimelines,
} from "../helpers";

/**
 * WHOOP Workout Data API
 *
 * GET /api/wearables/whoop/workouts
 *
 * Query Parameters:
 * - timeline: 1d, 3d, 1w, 2w, 1m, 2m (default: 1w)
 * - page: Page number for pagination (default: 1)
 * - limit: Items per page (default: 50, max: 200)
 * - scoreState: SCORED, PENDING_SCORE, UNSCORABLE (optional)
 * - sportId: Specific sport ID to filter by (optional)
 * - minStrain: Minimum strain score (0-21) (optional)
 * - maxStrain: Maximum strain score (0-21) (optional)
 * - minDuration: Minimum duration in minutes (optional)
 * - maxDuration: Maximum duration in minutes (optional)
 * - format: json/csv (default: json)
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { user } = await withAuth({ ensureSignedIn: true });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const timeline = searchParams.get("timeline") || "1w";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const scoreState = searchParams.get("scoreState") || undefined;
    const sportId = searchParams.get("sportId");
    const minStrain = searchParams.get("minStrain");
    const maxStrain = searchParams.get("maxStrain");
    const minDuration = searchParams.get("minDuration");
    const maxDuration = searchParams.get("maxDuration");
    const format = searchParams.get("format") || "json";

    // Validate parameters
    if (!validateTimeline(timeline)) {
      return NextResponse.json(
        {
          error: "Invalid timeline",
          availableTimelines: getAvailableTimelines(),
        },
        { status: 400 }
      );
    }

    try {
      validateScoreState(scoreState);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Validate strain range
    if (
      minStrain &&
      (isNaN(Number(minStrain)) ||
        Number(minStrain) < 0 ||
        Number(minStrain) > 21)
    ) {
      return NextResponse.json(
        { error: "minStrain must be between 0 and 21" },
        { status: 400 }
      );
    }
    if (
      maxStrain &&
      (isNaN(Number(maxStrain)) ||
        Number(maxStrain) < 0 ||
        Number(maxStrain) > 21)
    ) {
      return NextResponse.json(
        { error: "maxStrain must be between 0 and 21" },
        { status: 400 }
      );
    }

    // Validate duration range
    if (
      minDuration &&
      (isNaN(Number(minDuration)) || Number(minDuration) < 0)
    ) {
      return NextResponse.json(
        { error: "minDuration must be a positive number" },
        { status: 400 }
      );
    }
    if (
      maxDuration &&
      (isNaN(Number(maxDuration)) || Number(maxDuration) < 0)
    ) {
      return NextResponse.json(
        { error: "maxDuration must be a positive number" },
        { status: 400 }
      );
    }

    // Check if user has WHOOP connection
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!whoopUser) {
      return NextResponse.json(
        { error: "WHOOP account not connected" },
        { status: 404 }
      );
    }

    // Calculate date range and pagination
    const { startDate, endDate, config } = getDateRange(timeline);
    const { skip, take } = calculatePagination(page, limit, config.maxLimit);

    // Build where clause with workout-specific filters
    const where: any = {
      whoopUserId: user.id,
      start: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (scoreState) {
      where.scoreState = scoreState;
    }

    if (sportId) {
      where.sportId = parseInt(sportId);
    }

    if (minStrain || maxStrain) {
      where.strain = {};
      if (minStrain) where.strain.gte = Number(minStrain);
      if (maxStrain) where.strain.lte = Number(maxStrain);
    }

    // Get total count for pagination
    const totalCount = await prisma.whoopWorkout.count({ where });

    // Fetch workout data
    const workoutData = await prisma.whoopWorkout.findMany({
      where,
      orderBy: { start: "desc" },
      skip,
      take,
      select: {
        id: true,
        workoutId: true,
        sportId: true,
        start: true,
        end: true,
        timezoneOffset: true,
        scoreState: true,
        strain: true,
        averageHeartRate: true,
        maxHeartRate: true,
        kilojoule: true,
        percentRecorded: true,
        distanceMeters: true,
        altitudeGainMeters: true,
        altitudeChangeMeters: true,
        zoneZeroDuration: true,
        zoneOneDuration: true,
        zoneTwoDuration: true,
        zoneThreeDuration: true,
        zoneFourDuration: true,
        zoneFiveDuration: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Apply duration filters if specified (calculated from start/end times)
    let filteredData = workoutData;
    if (minDuration || maxDuration) {
      filteredData = workoutData.filter((workout) => {
        const durationMinutes =
          (new Date(workout.end).getTime() -
            new Date(workout.start).getTime()) /
          (1000 * 60);

        if (minDuration && durationMinutes < Number(minDuration)) return false;
        if (maxDuration && durationMinutes > Number(maxDuration)) return false;

        return true;
      });
    }

    // Format data for response
    const formattedData = filteredData.map((workout) => ({
      ...formatWorkoutData(workout),
      durationMinutes: Math.round(
        (new Date(workout.end).getTime() - new Date(workout.start).getTime()) /
          (1000 * 60)
      ),
      caloriesKcal: workout.kilojoule
        ? Math.round(workout.kilojoule * 0.239006)
        : null, // Convert kJ to kcal
    }));

    // Handle CSV format
    if (format === "csv") {
      const csv = convertWorkoutsToCSV(formattedData);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="whoop-workouts-${timeline}-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    }

    // Create standardized response
    const response = createApiResponse(
      formattedData,
      timeline,
      startDate,
      endDate,
      { page, limit, total: totalCount }
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("WHOOP workouts API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Convert workout data to CSV format
 */
function convertWorkoutsToCSV(workoutData: any[]): string {
  if (workoutData.length === 0) {
    return "No workout data available";
  }

  const headers = [
    "Date",
    "Workout ID",
    "Sport ID",
    "Duration (minutes)",
    "Score State",
    "Strain",
    "Average Heart Rate",
    "Max Heart Rate",
    "Calories (kcal)",
    "Distance (km)",
    "Altitude Gain (m)",
    "Zone 1 (min)",
    "Zone 2 (min)",
    "Zone 3 (min)",
    "Zone 4 (min)",
    "Zone 5 (min)",
    "Percent Recorded",
  ];

  const rows = workoutData.map((workout) => [
    new Date(workout.start).toLocaleDateString(),
    workout.workoutId,
    workout.sportId || "",
    workout.durationMinutes,
    workout.scoreState,
    workout.strain || "",
    workout.averageHeartRate || "",
    workout.maxHeartRate || "",
    workout.caloriesKcal || "",
    workout.distanceKm || "",
    workout.altitudeGainMeters || "",
    workout.zoneOneDurationMinutes || "",
    workout.zoneTwoDurationMinutes || "",
    workout.zoneThreeDurationMinutes || "",
    workout.zoneFourDurationMinutes || "",
    workout.zoneFiveDurationMinutes || "",
    workout.percentRecorded || "",
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

// Cursor rules applied correctly.
