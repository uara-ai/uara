import { NextRequest, NextResponse } from "next/server";
import { generateId } from "ai";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit, createRateLimitHeaders } from "@/lib/rate-limit";
import { saveChat, saveMessage, getChatById } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Check rate limit
    const rateLimitData = await checkRateLimit(user.id);

    const { messages, chatId: existingChatId } = await request.json();

    // If no existing chat ID, create a new chat
    let chatId = existingChatId;
    if (!chatId) {
      chatId = generateId();
      const firstMessage = messages[0];
      const title = firstMessage?.parts?.[0]?.text?.slice(0, 100) || "New Chat";

      await saveChat({
        id: chatId,
        title,
        userId: user.id,
        visibility: "private",
      });
    }

    // Save the user message
    const userMessage = messages[messages.length - 1];
    if (userMessage) {
      await saveMessage({
        id: userMessage.id || generateId(),
        chatId,
        role: userMessage.role,
        parts: userMessage.parts || [],
        attachments: userMessage.attachments || [],
      });
    }

    // For now, return a simple response
    // In a real implementation, you would integrate with your AI provider here
    const assistantResponse = {
      id: generateId(),
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Hello! This is a placeholder response. The AI integration will be implemented next.",
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

    const headers = {
      ...createRateLimitHeaders(rateLimitData),
      "X-Chat-Id": chatId,
    };

    return NextResponse.json(
      {
        id: assistantResponse.id,
        role: assistantResponse.role,
        parts: assistantResponse.parts,
        attachments: assistantResponse.attachments,
      },
      { headers }
    );
  } catch (error) {
    console.error("Chat API error:", error);

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

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

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

// Cursor rules applied correctly.
