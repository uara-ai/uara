import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { prisma } from "@/lib/prisma";
import { serializeBigInt } from "../utils";
import {
  getDateRange,
  validateTimeline,
  validateScoreState,
  calculatePagination,
  createApiResponse,
  getAvailableTimelines,
} from "../helpers";

/**
 * WHOOP Cycle Data API
 *
 * GET /api/wearables/whoop/cycles
 *
 * Query Parameters:
 * - timeline: 1d, 3d, 1w, 2w, 1m, 2m (default: 1w)
 * - page: Page number for pagination (default: 1)
 * - limit: Items per page (default: 50, max: 200)
 * - scoreState: SCORED, PENDING_SCORE, UNSCORABLE (optional)
 * - minStrain: Minimum strain score (0-21) (optional)
 * - maxStrain: Maximum strain score (0-21) (optional)
 * - completed: true/false - filter by completed cycles (optional)
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
    const minStrain = searchParams.get("minStrain");
    const maxStrain = searchParams.get("maxStrain");
    const completed = searchParams.get("completed");
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

    // Build where clause with cycle-specific filters
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

    if (minStrain || maxStrain) {
      where.strain = {};
      if (minStrain) where.strain.gte = Number(minStrain);
      if (maxStrain) where.strain.lte = Number(maxStrain);
    }

    if (completed !== null && completed !== undefined) {
      if (completed === "true") {
        where.end = { not: null };
      } else if (completed === "false") {
        where.end = null;
      }
    }

    // Get total count for pagination
    const totalCount = await prisma.whoopCycle.count({ where });

    // Fetch cycle data
    const cycleData = await prisma.whoopCycle.findMany({
      where,
      orderBy: { start: "desc" },
      skip,
      take,
      select: {
        id: true,
        cycleId: true,
        start: true,
        end: true,
        timezoneOffset: true,
        scoreState: true,
        strain: true,
        averageHeartRate: true,
        maxHeartRate: true,
        kilojoule: true,
        percentRecorded: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Format data for response
    const formattedData = cycleData.map((cycle) => ({
      ...cycle,
      cycleId: cycle.cycleId.toString(), // Convert BigInt to string
      durationHours: cycle.end
        ? Number(
            (
              (new Date(cycle.end).getTime() -
                new Date(cycle.start).getTime()) /
              (1000 * 60 * 60)
            ).toFixed(2)
          )
        : null,
      isCompleted: cycle.end !== null,
      caloriesKcal: cycle.kilojoule
        ? Math.round(cycle.kilojoule * 0.239006)
        : null, // Convert kJ to kcal
    }));

    // Handle CSV format
    if (format === "csv") {
      const csv = convertCyclesToCSV(formattedData);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="whoop-cycles-${timeline}-${
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

    // Serialize BigInt values
    const serializedResponse = serializeBigInt(response);

    return NextResponse.json(serializedResponse);
  } catch (error) {
    console.error("WHOOP cycles API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Convert cycle data to CSV format
 */
function convertCyclesToCSV(cycleData: any[]): string {
  if (cycleData.length === 0) {
    return "No cycle data available";
  }

  const headers = [
    "Start Date",
    "End Date",
    "Cycle ID",
    "Score State",
    "Strain",
    "Average Heart Rate",
    "Max Heart Rate",
    "Calories (kcal)",
    "Duration (hours)",
    "Percent Recorded",
    "Completed",
  ];

  const rows = cycleData.map((cycle) => [
    new Date(cycle.start).toLocaleString(),
    cycle.end ? new Date(cycle.end).toLocaleString() : "Ongoing",
    cycle.cycleId,
    cycle.scoreState,
    cycle.strain || "",
    cycle.averageHeartRate || "",
    cycle.maxHeartRate || "",
    cycle.caloriesKcal || "",
    cycle.durationHours || "",
    cycle.percentRecorded || "",
    cycle.isCompleted ? "Yes" : "No",
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

// Cursor rules applied correctly.
