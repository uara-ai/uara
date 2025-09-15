import { NextRequest, NextResponse } from "next/server";
import { whoopClient } from "../client";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { withAuth } from "@workos-inc/authkit-nextjs";

/**
 * WHOOP OAuth Authorization Endpoint
 *
 * This endpoint initiates the WHOOP OAuth flow by:
 * 1. Generating a secure state parameter for CSRF protection
 * 2. Storing the state and user context in the database
 * 3. Redirecting the user to WHOOP's authorization page
 */
export async function GET(request: NextRequest) {
  try {
    const { user } = await withAuth({ ensureSignedIn: true });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate secure state parameter for CSRF protection
    const state = nanoid(32);

    // Store state in database with user context and expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    try {
      await prisma.whoopOAuthState.create({
        data: {
          state,
          userId: user.id,
          expiresAt,
        },
      });
    } catch (error) {
      console.error("Failed to store OAuth state:", error);
      return NextResponse.json(
        { error: "Failed to initiate authorization" },
        { status: 500 }
      );
    }

    // Generate WHOOP authorization URL
    const authUrl = whoopClient.getAuthUrl(state);

    // Redirect to WHOOP OAuth page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("WHOOP OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
