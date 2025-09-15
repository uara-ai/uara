import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";

/**
 * WHOOP Data Export Endpoint
 *
 * This endpoint exports all WHOOP data for the authenticated user
 * in a downloadable JSON format for data portability and backup purposes.
 */
export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const { user } = await withAuth({ ensureSignedIn: true });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";
    const includeMetadata = searchParams.get("metadata") !== "false";

    // Check if user has WHOOP connection
    const whoopUser = await prisma.whoopUser.findUnique({
      where: { userId: user.id },
      include: {
        recovery: {
          orderBy: { createdAt: "desc" },
        },
        cycles: {
          orderBy: { start: "desc" },
        },
        sleep: {
          orderBy: { start: "desc" },
        },
        workouts: {
          orderBy: { start: "desc" },
        },
      },
    });

    if (!whoopUser) {
      return NextResponse.json(
        { error: "WHOOP account not connected" },
        { status: 404 }
      );
    }

    // Prepare export data
    const exportData: any = {
      user: {
        whoopUserId: whoopUser.whoopUserId,
        email: whoopUser.email,
        firstName: whoopUser.firstName,
        lastName: whoopUser.lastName,
        connectedAt: whoopUser.createdAt,
        lastSyncAt: whoopUser.lastSyncAt,
        disconnectedAt: whoopUser.disconnectedAt,
      },
      data: {
        recovery: whoopUser.recovery.map((record) => ({
          cycleId: record.cycleId,
          sleepId: record.sleepId,
          scoreState: record.scoreState,
          recoveryScore: record.recoveryScore,
          restingHeartRate: record.restingHeartRate,
          hrvRmssd: record.hrvRmssd,
          userCalibrating: record.userCalibrating,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        })),
        cycles: whoopUser.cycles.map((record) => ({
          cycleId: record.cycleId,
          start: record.start,
          end: record.end,
          timezoneOffset: record.timezoneOffset,
          scoreState: record.scoreState,
          strain: record.strain,
          averageHeartRate: record.averageHeartRate,
          maxHeartRate: record.maxHeartRate,
          kilojoule: record.kilojoule,
          percentRecorded: record.percentRecorded,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        })),
        sleep: whoopUser.sleep.map((record) => ({
          sleepId: record.sleepId,
          start: record.start,
          end: record.end,
          timezoneOffset: record.timezoneOffset,
          nap: record.nap,
          scoreState: record.scoreState,
          totalInBedTime: record.totalInBedTime,
          totalAwakeTime: record.totalAwakeTime,
          totalLightSleepTime: record.totalLightSleepTime,
          totalSlowWaveSleepTime: record.totalSlowWaveSleepTime,
          totalRemSleepTime: record.totalRemSleepTime,
          sleepCycleCount: record.sleepCycleCount,
          disturbanceCount: record.disturbanceCount,
          respiratoryRate: record.respiratoryRate,
          sleepPerformancePercentage: record.sleepPerformancePercentage,
          sleepConsistencyPercentage: record.sleepConsistencyPercentage,
          sleepEfficiencyPercentage: record.sleepEfficiencyPercentage,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        })),
        workouts: whoopUser.workouts.map((record) => ({
          workoutId: record.workoutId,
          sportId: record.sportId,
          start: record.start,
          end: record.end,
          timezoneOffset: record.timezoneOffset,
          scoreState: record.scoreState,
          strain: record.strain,
          averageHeartRate: record.averageHeartRate,
          maxHeartRate: record.maxHeartRate,
          kilojoule: record.kilojoule,
          percentRecorded: record.percentRecorded,
          distanceMeters: record.distanceMeters,
          altitudeGainMeters: record.altitudeGainMeters,
          altitudeChangeMeters: record.altitudeChangeMeters,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        })),
      },
    };

    // Add metadata if requested
    if (includeMetadata) {
      exportData._metadata = {
        exportedAt: new Date().toISOString(),
        exportedBy: user.id,
        version: "1.0.0",
        source: "Uara.ai WHOOP Integration",
        counts: {
          recovery: whoopUser.recovery.length,
          cycles: whoopUser.cycles.length,
          sleep: whoopUser.sleep.length,
          workouts: whoopUser.workouts.length,
          total:
            whoopUser.recovery.length +
            whoopUser.cycles.length +
            whoopUser.sleep.length +
            whoopUser.workouts.length,
        },
        dateRange: {
          earliest: getEarliestDate(whoopUser),
          latest: getLatestDate(whoopUser),
        },
        disclaimer:
          "This data export contains personal health information. Handle with care and in accordance with applicable privacy laws.",
      };
    }

    // Format response based on requested format
    if (format === "csv") {
      // Convert to CSV format (simplified)
      const csv = convertToCSV(exportData);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="whoop-data-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    }

    // Default JSON format
    const jsonString = JSON.stringify(exportData, null, 2);

    return new NextResponse(jsonString, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="whoop-data-${
          new Date().toISOString().split("T")[0]
        }.json"`,
        "Content-Length": jsonString.length.toString(),
      },
    });
  } catch (error) {
    console.error("WHOOP export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Get the earliest date from all data types
 */
function getEarliestDate(whoopUser: any): string | null {
  const dates: Date[] = [];

  whoopUser.recovery.forEach((r: any) => dates.push(new Date(r.createdAt)));
  whoopUser.cycles.forEach((c: any) => dates.push(new Date(c.start)));
  whoopUser.sleep.forEach((s: any) => dates.push(new Date(s.start)));
  whoopUser.workouts.forEach((w: any) => dates.push(new Date(w.start)));

  if (dates.length === 0) return null;

  return new Date(Math.min(...dates.map((d) => d.getTime()))).toISOString();
}

/**
 * Get the latest date from all data types
 */
function getLatestDate(whoopUser: any): string | null {
  const dates: Date[] = [];

  whoopUser.recovery.forEach((r: any) => dates.push(new Date(r.updatedAt)));
  whoopUser.cycles.forEach((c: any) => dates.push(new Date(c.end || c.start)));
  whoopUser.sleep.forEach((s: any) => dates.push(new Date(s.end)));
  whoopUser.workouts.forEach((w: any) => dates.push(new Date(w.end)));

  if (dates.length === 0) return null;

  return new Date(Math.max(...dates.map((d) => d.getTime()))).toISOString();
}

/**
 * Convert export data to CSV format (simplified version)
 */
function convertToCSV(exportData: any): string {
  const lines: string[] = [];

  // Add header
  lines.push("# WHOOP Data Export");
  lines.push(`# Exported: ${new Date().toISOString()}`);
  lines.push(`# User: ${exportData.user.email}`);
  lines.push("");

  // Recovery data
  if (exportData.data.recovery.length > 0) {
    lines.push("## Recovery Data");
    lines.push("Date,Recovery Score,Resting HR,HRV RMSSD,User Calibrating");
    exportData.data.recovery.forEach((r: any) => {
      lines.push(
        `${r.createdAt},${r.recoveryScore || ""},${r.restingHeartRate || ""},${
          r.hrvRmssd || ""
        },${r.userCalibrating || ""}`
      );
    });
    lines.push("");
  }

  // Sleep data
  if (exportData.data.sleep.length > 0) {
    lines.push("## Sleep Data");
    lines.push("Date,In Bed Time (ms),Sleep Efficiency %,Sleep Performance %");
    exportData.data.sleep.forEach((s: any) => {
      lines.push(
        `${s.start},${s.totalInBedTime || ""},${
          s.sleepEfficiencyPercentage || ""
        },${s.sleepPerformancePercentage || ""}`
      );
    });
    lines.push("");
  }

  // Add note about full data being available in JSON format
  lines.push(
    "# Note: This is a simplified CSV export. For complete data including all fields,"
  );
  lines.push("# please use the JSON export format.");

  return lines.join("\n");
}

// Cursor rules applied correctly.
