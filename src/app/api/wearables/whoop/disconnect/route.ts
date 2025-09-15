import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";

/**
 * WHOOP Disconnect Endpoint
 *
 * This endpoint allows users to disconnect their WHOOP account:
 * 1. Validates user authentication
 * 2. Removes all WHOOP data for the user
 * 3. Optionally preserves historical data based on user preference
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get the current user
    const { user } = await withAuth({ ensureSignedIn: true });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request parameters
    const { searchParams } = new URL(request.url);
    const preserveData = searchParams.get("preserve_data") === "true";

    // Check if user has WHOOP connection
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: { whoopUserId: true },
    });

    if (!whoopUser) {
      return NextResponse.json(
        { error: "WHOOP account not connected" },
        { status: 404 }
      );
    }

    if (preserveData) {
      // Only remove authentication data, keep historical health data
      try {
        await prisma.whoopUser.update({
          where: { userId: user.id },
          data: {
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            disconnectedAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return NextResponse.json({
          success: true,
          message: "WHOOP account disconnected, historical data preserved",
          dataPreserved: true,
        });
      } catch (error) {
        console.error("Failed to disconnect WHOOP user:", error);
        return NextResponse.json(
          { error: "Failed to disconnect WHOOP account" },
          { status: 500 }
        );
      }
    } else {
      // Remove all WHOOP data for the user
      try {
        await prisma.$transaction([
          prisma.whoopRecovery.deleteMany({
            where: { whoopUserId: user.id },
          }),
          prisma.whoopCycle.deleteMany({
            where: { whoopUserId: user.id },
          }),
          prisma.whoopSleep.deleteMany({
            where: { whoopUserId: user.id },
          }),
          prisma.whoopWorkout.deleteMany({
            where: { whoopUserId: user.id },
          }),
          prisma.whoopUser.delete({
            where: { userId: user.id },
          }),
        ]);

        return NextResponse.json({
          success: true,
          message: "WHOOP account disconnected and all data removed",
          dataPreserved: false,
        });
      } catch (error) {
        console.error("Failed to delete WHOOP data:", error);
        return NextResponse.json(
          { error: "Failed to disconnect WHOOP account" },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("WHOOP disconnect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user can disconnect
export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const { user } = await withAuth({ ensureSignedIn: true });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check WHOOP connection status
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      select: {
        whoopUserId: true,
        accessToken: true,
        disconnectedAt: true,
        createdAt: true,
      },
    });

    if (!whoopUser) {
      return NextResponse.json({
        connected: false,
        canDisconnect: false,
      });
    }

    // Get data counts to show user what would be affected
    const [recoveryCount, cycleCount, sleepCount, workoutCount] =
      await Promise.all([
        prisma.whoopRecovery.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopCycle.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopSleep.count({
          where: { whoopUserId: user.id },
        }),
        prisma.whoopWorkout.count({
          where: { whoopUserId: user.id },
        }),
      ]);

    const totalRecords = recoveryCount + cycleCount + sleepCount + workoutCount;

    return NextResponse.json({
      connected: !!whoopUser.accessToken,
      canDisconnect: true,
      isDisconnected: !!whoopUser.disconnectedAt,
      connectedSince: whoopUser.createdAt,
      dataToDelete: {
        recovery: recoveryCount,
        cycles: cycleCount,
        sleep: sleepCount,
        workouts: workoutCount,
        total: totalRecords,
      },
    });
  } catch (error) {
    console.error("WHOOP disconnect status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
