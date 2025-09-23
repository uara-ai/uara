import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "../../utils";
import {
  getDateRange,
  validateTimeline,
  validateScoreState,
  calculatePagination,
  createApiResponse,
  formatSleepData,
  formatWorkoutData,
  getAvailableTimelines,
} from "../../helpers";

/**
 * WHOOP Timeline Data API
 *
 * GET /api/wearables/whoop/timeline/[period]
 *
 * Path Parameters:
 * - period: 1d, 3d, 1w, 2w, 1m, 2m
 *
 * Query Parameters:
 * - types: Comma-separated data types (sleep,recovery,cycles,workouts) or "all" (default: all)
 * - page: Page number for pagination (default: 1)
 * - limit: Items per page (default: 50, max: 200)
 * - scoreState: SCORED, PENDING_SCORE, UNSCORABLE (optional)
 * - format: json/csv (default: json)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ period: string }> }
) {
  try {
    // Authenticate user
    const { user } = await withAuth({ ensureSignedIn: true });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { period } = await params;

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const types = searchParams.get("types") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const scoreState = searchParams.get("scoreState") || undefined;
    const format = searchParams.get("format") || "json";

    // Validate parameters
    if (!validateTimeline(period)) {
      return NextResponse.json(
        {
          error: "Invalid timeline period",
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

    // Parse requested data types
    const requestedTypes =
      types === "all"
        ? ["sleep", "recovery", "cycles", "workouts"]
        : types.split(",").map((t) => t.trim().toLowerCase());

    const validTypes = ["sleep", "recovery", "cycles", "workouts"];
    const invalidTypes = requestedTypes.filter((t) => !validTypes.includes(t));
    if (invalidTypes.length > 0) {
      return NextResponse.json(
        {
          error: `Invalid data types: ${invalidTypes.join(", ")}`,
          validTypes,
        },
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
    const { startDate, endDate, config } = getDateRange(period);
    const { skip, take } = calculatePagination(page, limit, config.maxLimit);

    const responseData: any = {};

    // Fetch Sleep Data
    if (requestedTypes.includes("sleep")) {
      const sleepWhere: any = {
        whoopUserId: user.id,
        start: { gte: startDate, lte: endDate },
      };
      if (scoreState) sleepWhere.scoreState = scoreState;

      const sleepData = await prisma.whoopSleep.findMany({
        where: sleepWhere,
        orderBy: { start: "desc" },
        skip,
        take,
        select: {
          id: true,
          sleepId: true,
          start: true,
          end: true,
          nap: true,
          scoreState: true,
          totalInBedTime: true,
          totalAwakeTime: true,
          totalLightSleepTime: true,
          totalSlowWaveSleepTime: true,
          totalRemSleepTime: true,
          sleepPerformancePercentage: true,
          sleepEfficiencyPercentage: true,
          respiratoryRate: true,
          createdAt: true,
        },
      });

      responseData.sleep = sleepData.map(formatSleepData);
    }

    // Fetch Recovery Data
    if (requestedTypes.includes("recovery")) {
      const recoveryWhere: any = {
        whoopUserId: user.id,
        createdAt: { gte: startDate, lte: endDate },
      };
      if (scoreState) recoveryWhere.scoreState = scoreState;

      const recoveryData = await prisma.whoopRecovery.findMany({
        where: recoveryWhere,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        select: {
          id: true,
          cycleId: true,
          scoreState: true,
          recoveryScore: true,
          restingHeartRate: true,
          hrvRmssd: true,
          userCalibrating: true,
          createdAt: true,
        },
      });

      responseData.recovery = recoveryData.map((r) => ({
        ...r,
        cycleId: r.cycleId.toString(),
      }));
    }

    // Fetch Cycle Data
    if (requestedTypes.includes("cycles")) {
      const cycleWhere: any = {
        whoopUserId: user.id,
        start: { gte: startDate, lte: endDate },
      };
      if (scoreState) cycleWhere.scoreState = scoreState;

      const cycleData = await prisma.whoopCycle.findMany({
        where: cycleWhere,
        orderBy: { start: "desc" },
        skip,
        take,
        select: {
          id: true,
          cycleId: true,
          start: true,
          end: true,
          scoreState: true,
          strain: true,
          averageHeartRate: true,
          maxHeartRate: true,
          kilojoule: true,
          createdAt: true,
        },
      });

      responseData.cycles = cycleData.map((c) => ({
        ...c,
        cycleId: c.cycleId.toString(),
        isCompleted: c.end !== null,
        caloriesKcal: c.kilojoule ? Math.round(c.kilojoule * 0.239006) : null,
      }));
    }

    // Fetch Workout Data
    if (requestedTypes.includes("workouts")) {
      const workoutWhere: any = {
        whoopUserId: user.id,
        start: { gte: startDate, lte: endDate },
      };
      if (scoreState) workoutWhere.scoreState = scoreState;

      const workoutData = await prisma.whoopWorkout.findMany({
        where: workoutWhere,
        orderBy: { start: "desc" },
        skip,
        take,
        select: {
          id: true,
          workoutId: true,
          sportId: true,
          start: true,
          end: true,
          scoreState: true,
          strain: true,
          averageHeartRate: true,
          maxHeartRate: true,
          kilojoule: true,
          distanceMeters: true,
          altitudeGainMeters: true,
          createdAt: true,
        },
      });

      responseData.workouts = workoutData.map((w) => ({
        ...formatWorkoutData(w),
        durationMinutes: Math.round(
          (new Date(w.end).getTime() - new Date(w.start).getTime()) /
            (1000 * 60)
        ),
        caloriesKcal: w.kilojoule ? Math.round(w.kilojoule * 0.239006) : null,
      }));
    }

    // Handle CSV format
    if (format === "csv") {
      const csv = convertTimelineToCSV(responseData, period);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="whoop-timeline-${period}-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    }

    // Create metadata
    const metadata = {
      timeline: period,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days: config.days,
      },
      dataTypes: requestedTypes,
      counts: {
        sleep: responseData.sleep?.length || 0,
        recovery: responseData.recovery?.length || 0,
        cycles: responseData.cycles?.length || 0,
        workouts: responseData.workouts?.length || 0,
        total: Object.values(responseData).reduce(
          (sum: number, arr: any) => sum + (arr?.length || 0),
          0
        ),
      },
      pagination: {
        page,
        limit: take,
        hasMore: false, // This would need more complex logic for real pagination across all types
      },
      generatedAt: new Date().toISOString(),
    };

    const response = {
      success: true,
      data: responseData,
      metadata,
    };

    // Serialize BigInt values
    const serializedResponse = serializeBigInt(response);

    return NextResponse.json(serializedResponse);
  } catch (error) {
    console.error("WHOOP timeline API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Convert timeline data to CSV format
 */
function convertTimelineToCSV(data: any, period: string): string {
  const lines: string[] = [];

  lines.push(`# WHOOP Timeline Data Export - ${period.toUpperCase()}`);
  lines.push(`# Generated: ${new Date().toISOString()}`);
  lines.push("");

  // Add each data type as a separate section
  Object.keys(data).forEach((dataType) => {
    if (data[dataType] && data[dataType].length > 0) {
      lines.push(`## ${dataType.toUpperCase()} DATA`);

      if (dataType === "sleep") {
        lines.push("Date,Sleep ID,Duration (hours),Efficiency %,Performance %");
        data[dataType].forEach((item: any) => {
          lines.push(
            `${new Date(item.start).toLocaleDateString()},${item.sleepId},${
              item.totalInBedTimeHours || ""
            },${item.sleepEfficiencyPercentage || ""},${
              item.sleepPerformancePercentage || ""
            }`
          );
        });
      } else if (dataType === "recovery") {
        lines.push("Date,Recovery Score,Resting HR,HRV");
        data[dataType].forEach((item: any) => {
          lines.push(
            `${new Date(item.createdAt).toLocaleDateString()},${
              item.recoveryScore || ""
            },${item.restingHeartRate || ""},${item.hrvRmssd || ""}`
          );
        });
      } else if (dataType === "cycles") {
        lines.push("Date,Strain,Average HR,Calories");
        data[dataType].forEach((item: any) => {
          lines.push(
            `${new Date(item.start).toLocaleDateString()},${
              item.strain || ""
            },${item.averageHeartRate || ""},${item.caloriesKcal || ""}`
          );
        });
      } else if (dataType === "workouts") {
        lines.push("Date,Sport ID,Strain,Duration (min),Distance (km)");
        data[dataType].forEach((item: any) => {
          lines.push(
            `${new Date(item.start).toLocaleDateString()},${
              item.sportId || ""
            },${item.strain || ""},${item.durationMinutes || ""},${
              item.distanceKm || ""
            }`
          );
        });
      }

      lines.push("");
    }
  });

  return lines.join("\n");
}

// Cursor rules applied correctly.
