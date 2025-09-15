import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";

/**
 * WHOOP Data Retrieval Endpoint
 *
 * This endpoint fetches stored WHOOP data for the authenticated user.
 * Used primarily for debugging and data visualization purposes.
 */
export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const { user } = await withAuth({ ensureSignedIn: true });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const days = parseInt(searchParams.get("days") || "30");
    const dataType = searchParams.get("type") || "all";

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Check if user has WHOOP connection
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: { id: true, userId: true },
    });

    if (!whoopUser) {
      return NextResponse.json(
        { error: "WHOOP account not connected" },
        { status: 404 }
      );
    }

    const data: any = {};

    // Fetch recovery data
    if (dataType === "all" || dataType === "recovery") {
      data.recovery = await prisma.whoopRecovery.findMany({
        where: {
          whoopUserId: user.id,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
    }

    // Fetch cycle data
    if (dataType === "all" || dataType === "cycles") {
      data.cycles = await prisma.whoopCycle.findMany({
        where: {
          whoopUserId: user.id,
          start: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { start: "desc" },
        take: limit,
      });
    }

    // Fetch sleep data
    if (dataType === "all" || dataType === "sleep") {
      data.sleep = await prisma.whoopSleep.findMany({
        where: {
          whoopUserId: user.id,
          start: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { start: "desc" },
        take: limit,
      });
    }

    // Fetch workout data
    if (dataType === "all" || dataType === "workouts") {
      data.workouts = await prisma.whoopWorkout.findMany({
        where: {
          whoopUserId: user.id,
          start: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { start: "desc" },
        take: limit,
      });
    }

    // Add metadata
    const metadata = {
      userId: user.id,
      whoopUserId: whoopUser.id,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days,
      },
      limits: {
        perType: limit,
        requested: dataType,
      },
      counts: {
        recovery: data.recovery?.length || 0,
        cycles: data.cycles?.length || 0,
        sleep: data.sleep?.length || 0,
        workouts: data.workouts?.length || 0,
      },
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      ...data,
      _metadata: metadata,
    });
  } catch (error) {
    console.error("WHOOP data fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
