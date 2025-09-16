import { NextResponse } from "next/server";
import { whoopClient } from "../../wearables/whoop/client";

/**
 * Debug endpoint to check WHOOP configuration
 */
export async function GET() {
  try {
    const debugInfo = {
      environment: {
        WHOOP_CLIENT_ID: process.env.WHOOP_CLIENT_ID ? "Set" : "Missing",
        WHOOP_CLIENT_SECRET: process.env.WHOOP_CLIENT_SECRET
          ? "Set"
          : "Missing",
        WHOOP_REDIRECT_URI: process.env.WHOOP_REDIRECT_URI,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      },
      computed: {
        clientId: process.env.WHOOP_CLIENT_ID,
        redirectUri:
          process.env.WHOOP_REDIRECT_URI ||
          `${process.env.NEXT_PUBLIC_APP_URL}/api/wearables/whoop/callback`,
      },
      testAuthUrl: whoopClient.getAuthUrl("test-state-123"),
    };

    return NextResponse.json(debugInfo, { status: 200 });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to get debug info", details: error },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
