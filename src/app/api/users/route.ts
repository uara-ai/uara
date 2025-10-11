import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API_KEY not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://app.uara.ai/api/users/count", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `API request failed with status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching users count:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users count" },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
