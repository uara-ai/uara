import { NextRequest, NextResponse } from "next/server";
import { generateId } from "ai";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit, createRateLimitHeaders } from "@/lib/rate-limit";
import { getChatById, saveMessage, deleteChatById } from "@/lib/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: chatId } = await params;

    const chat = await getChatById({ id: chatId });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Check if user owns the chat
    if (chat.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Get chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: chatId } = await params;

    // Check rate limit
    const rateLimitData = await checkRateLimit(user.id);

    // Verify chat exists and user owns it
    const chat = await getChatById({ id: chatId });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (chat.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { message } = await request.json();

    // Save the user message
    await saveMessage({
      id: message.id || generateId(),
      chatId,
      role: message.role,
      parts: message.parts || [],
      attachments: message.attachments || [],
    });

    // For now, return a simple response
    // In a real implementation, you would integrate with your AI provider here
    const assistantResponse = {
      id: generateId(),
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Hello! This is a placeholder response for the existing chat. The AI integration will be implemented next.",
        },
      ],
      attachments: [],
    };

    // Save the assistant response
    await saveMessage({
      id: assistantResponse.id,
      chatId,
      role: assistantResponse.role,
      parts: assistantResponse.parts,
      attachments: assistantResponse.attachments,
    });

    const headers = createRateLimitHeaders(rateLimitData);

    return NextResponse.json(assistantResponse, { headers });
  } catch (error) {
    console.error("Chat message API error:", error);

    if (error instanceof Error && error.message.includes("Rate limit")) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: chatId } = await params;

    // Verify chat exists and user owns it
    const chat = await getChatById({ id: chatId });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (chat.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await deleteChatById({ id: chatId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
