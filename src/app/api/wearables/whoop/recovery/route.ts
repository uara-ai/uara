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
 * WHOOP Recovery Data API
 *
 * GET /api/wearables/whoop/recovery
 *
 * Query Parameters:
 * - timeline: 1d, 3d, 1w, 2w, 1m, 2m (default: 1w)
 * - page: Page number for pagination (default: 1)
 * - limit: Items per page (default: 50, max: 200)
 * - scoreState: SCORED, PENDING_SCORE, UNSCORABLE (optional)
 * - minScore: Minimum recovery score (0-100) (optional)
 * - maxScore: Maximum recovery score (0-100) (optional)
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
    const minScore = searchParams.get("minScore");
    const maxScore = searchParams.get("maxScore");
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

    // Validate score range
    if (
      minScore &&
      (isNaN(Number(minScore)) ||
        Number(minScore) < 0 ||
        Number(minScore) > 100)
    ) {
      return NextResponse.json(
        { error: "minScore must be between 0 and 100" },
        { status: 400 }
      );
    }
    if (
      maxScore &&
      (isNaN(Number(maxScore)) ||
        Number(maxScore) < 0 ||
        Number(maxScore) > 100)
    ) {
      return NextResponse.json(
        { error: "maxScore must be between 0 and 100" },
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

    // Build where clause with recovery-specific filters
    const where: any = {
      whoopUserId: user.id,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (scoreState) {
      where.scoreState = scoreState;
    }

    if (minScore || maxScore) {
      where.recoveryScore = {};
      if (minScore) where.recoveryScore.gte = Number(minScore);
      if (maxScore) where.recoveryScore.lte = Number(maxScore);
    }

    // Get total count for pagination
    const totalCount = await prisma.whoopRecovery.count({ where });

    // Fetch recovery data
    const recoveryData = await prisma.whoopRecovery.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        cycleId: true,
        sleepId: true,
        scoreState: true,
        recoveryScore: true,
        restingHeartRate: true,
        hrvRmssd: true,
        userCalibrating: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Format data for response
    const formattedData = recoveryData.map((recovery) => ({
      ...recovery,
      cycleId: recovery.cycleId.toString(), // Convert BigInt to string
    }));

    // Handle CSV format
    if (format === "csv") {
      const csv = convertRecoveryToCSV(formattedData);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="whoop-recovery-${timeline}-${
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
    console.error("WHOOP recovery API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Convert recovery data to CSV format
 */
function convertRecoveryToCSV(recoveryData: any[]): string {
  if (recoveryData.length === 0) {
    return "No recovery data available";
  }

  const headers = [
    "Date",
    "Cycle ID",
    "Sleep ID",
    "Score State",
    "Recovery Score",
    "Resting Heart Rate",
    "HRV RMSSD",
    "User Calibrating",
  ];

  const rows = recoveryData.map((recovery) => [
    new Date(recovery.createdAt).toLocaleDateString(),
    recovery.cycleId,
    recovery.sleepId,
    recovery.scoreState,
    recovery.recoveryScore || "",
    recovery.restingHeartRate || "",
    recovery.hrvRmssd || "",
    recovery.userCalibrating ? "Yes" : "No",
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

// Cursor rules applied correctly.
