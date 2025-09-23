import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/prisma";
import {
  getDateRange,
  validateTimeline,
  validateScoreState,
  calculatePagination,
  createApiResponse,
  formatSleepData,
  buildWhereClause,
  getAvailableTimelines,
} from "../helpers";

/**
 * WHOOP Sleep Data API
 *
 * GET /api/wearables/whoop/sleep
 *
 * Query Parameters:
 * - timeline: 1d, 3d, 1w, 2w, 1m, 2m (default: 1w)
 * - page: Page number for pagination (default: 1)
 * - limit: Items per page (default: 50, max: 200)
 * - scoreState: SCORED, PENDING_SCORE, UNSCORABLE (optional)
 * - nap: true/false (optional) - filter by nap vs main sleep
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
    const napFilter = searchParams.get("nap");
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

    // Build additional filters
    const additionalFilters: Record<string, any> = {};
    if (napFilter !== null) {
      additionalFilters.nap = napFilter === "true";
    }

    // Build where clause
    const where = buildWhereClause(
      user.id,
      startDate,
      endDate,
      scoreState,
      additionalFilters
    );

    // Get total count for pagination
    const totalCount = await prisma.whoopSleep.count({ where });

    // Fetch sleep data
    const sleepData = await prisma.whoopSleep.findMany({
      where,
      orderBy: { start: "desc" },
      skip,
      take,
      select: {
        id: true,
        sleepId: true,
        start: true,
        end: true,
        timezoneOffset: true,
        nap: true,
        scoreState: true,
        totalInBedTime: true,
        totalAwakeTime: true,
        totalNoDataTime: true,
        totalLightSleepTime: true,
        totalSlowWaveSleepTime: true,
        totalRemSleepTime: true,
        sleepCycleCount: true,
        disturbanceCount: true,
        respiratoryRate: true,
        sleepPerformancePercentage: true,
        sleepConsistencyPercentage: true,
        sleepEfficiencyPercentage: true,
        sleepNeedBaseline: true,
        sleepNeedFromDebt: true,
        sleepNeedFromStrain: true,
        sleepNeedFromNap: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Format data for response
    const formattedData = sleepData.map(formatSleepData);

    // Handle CSV format
    if (format === "csv") {
      const csv = convertSleepToCSV(formattedData);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="whoop-sleep-${timeline}-${
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
    console.error("WHOOP sleep API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Convert sleep data to CSV format
 */
function convertSleepToCSV(sleepData: any[]): string {
  if (sleepData.length === 0) {
    return "No sleep data available";
  }

  const headers = [
    "Date",
    "Sleep ID",
    "Is Nap",
    "Score State",
    "In Bed Time (hours)",
    "Awake Time (hours)",
    "Light Sleep (hours)",
    "Deep Sleep (hours)",
    "REM Sleep (hours)",
    "Sleep Cycles",
    "Disturbances",
    "Respiratory Rate",
    "Sleep Performance %",
    "Sleep Efficiency %",
    "Sleep Consistency %",
  ];

  const rows = sleepData.map((sleep) => [
    new Date(sleep.start).toLocaleDateString(),
    sleep.sleepId,
    sleep.nap ? "Yes" : "No",
    sleep.scoreState,
    sleep.totalInBedTimeHours || "",
    sleep.totalAwakeTimeHours || "",
    sleep.totalLightSleepTimeHours || "",
    sleep.totalSlowWaveSleepTimeHours || "",
    sleep.totalRemSleepTimeHours || "",
    sleep.sleepCycleCount || "",
    sleep.disturbanceCount || "",
    sleep.respiratoryRate || "",
    sleep.sleepPerformancePercentage || "",
    sleep.sleepEfficiencyPercentage || "",
    sleep.sleepConsistencyPercentage || "",
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

// Cursor rules applied correctly.
