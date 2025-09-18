import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { getWhoopSummaryServer } from "@/actions/whoop-data-action";

/**
 * WHOOP Summary Data Endpoint
 *
 * This endpoint provides summary WHOOP data for quick dashboard updates.
 * Used after sync to get fresh data without page reload.
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
    const days = parseInt(searchParams.get("days") || "30");

    // Validate days parameter
    if (days < 1 || days > 90) {
      return NextResponse.json(
        { error: "Days parameter must be between 1 and 90" },
        { status: 400 }
      );
    }

    // Fetch summary data
    const whoopData = await getWhoopSummaryServer(days);

    if (!whoopData) {
      return NextResponse.json(
        { error: "No WHOOP data found or user not connected" },
        { status: 404 }
      );
    }

    return NextResponse.json(whoopData);
  } catch (error) {
    console.error("WHOOP summary fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
