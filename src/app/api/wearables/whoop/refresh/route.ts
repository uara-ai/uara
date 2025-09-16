import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { revalidateWhoopData } from "@/actions/whoop-data-action";

export async function POST(request: NextRequest) {
  try {
    const { user } = await withAuth();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Revalidate cache
    await revalidateWhoopData();

    return NextResponse.json({
      success: true,
      message: "WHOOP data cache refreshed successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error refreshing WHOOP data cache:", error);
    return NextResponse.json(
      { error: "Failed to refresh cache" },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
