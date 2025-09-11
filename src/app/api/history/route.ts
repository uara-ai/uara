import { requireAuth } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { getChatsByUserId } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const startingAfter = searchParams.get("starting_after");
    const endingBefore = searchParams.get("ending_before");

    if (startingAfter && endingBefore) {
      return new ChatSDKError(
        "bad_request:api",
        "Only one of starting_after or ending_before can be provided."
      ).toResponse();
    }

    const user = await requireAuth();

    if (!user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const chats = await getChatsByUserId({
      userId: user.id,
      limit,
      startingAfter,
      endingBefore,
    });

    // Return the expected format for the sidebar
    const response = {
      chats,
      hasMore: chats.length === limit,
    };

    return Response.json(response);
  } catch (error) {
    console.error("Chat history API error:", error);
    return new ChatSDKError("offline:chat").toResponse();
  }
}
