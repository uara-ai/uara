import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getChatsByUserId } from "@/lib/db/queries";

export async function GET() {
  try {
    const user = await requireAuth();

    const chats = await getChatsByUserId({ userId: user.id });

    // Transform the data to match the expected format
    const formattedChats = chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messageCount: chat.messages.length,
    }));

    return NextResponse.json(formattedChats);
  } catch (error) {
    console.error("Chat history error:", error);

    if (error instanceof Error && error.message.includes("Authentication")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
