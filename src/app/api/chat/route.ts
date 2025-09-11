import { NextRequest, NextResponse } from "next/server";
import { streamText, generateId } from "ai";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { saveChat, saveMessage, getChatById } from "@/lib/db/queries";
import { myProvider } from "@/lib/ai/providers";
import { LONGEVITY_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    // Check rate limit
    await checkRateLimit(user.id);

    const { message, id: chatIdFromBody } = await request.json();

    // Validate that message exists
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if chat exists, if not create it
    let chatId = chatIdFromBody;
    let chat = null;

    if (chatId) {
      chat = await getChatById({ id: chatId });
    }

    if (!chatId || !chat) {
      // If no chat ID provided or chat doesn't exist, create a new one
      if (!chatId) {
        chatId = generateId();
      }

      const title = message?.parts?.[0]?.text?.slice(0, 100) || "New Chat";

      await saveChat({
        id: chatId,
        title,
        userId: user.id,
        visibility: "private",
      });
    } else {
      // Verify user owns the existing chat
      if (chat.userId !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    // Save the user message
    const userMessageId = message.id || generateId();
    await saveMessage({
      id: userMessageId,
      chatId,
      role: message.role,
      parts: message.parts || [],
      attachments: message.attachments || [],
    });

    // Convert message parts to a simple string for the AI
    const userMessageText =
      message.parts
        ?.map((part: any) => part.text || part.content || "")
        .join(" ") || "";

    // Get chat history to provide context
    const existingChat =
      chat || (chatId ? await getChatById({ id: chatId }) : null);
    const chatHistory = existingChat?.messages || [];

    // Convert chat history to the format expected by AI SDK
    const previousMessages = chatHistory.map((msg: any) => ({
      role: msg.role as "user" | "assistant" | "system",
      content: Array.isArray(msg.parts)
        ? msg.parts
            .map((part: any) => part.text || part.content || "")
            .join(" ")
        : msg.parts || "",
    }));

    // Generate streaming response using the AI provider
    const stream = streamText({
      model: myProvider.languageModel("chat-model"),
      messages: [
        { role: "system", content: LONGEVITY_SYSTEM_PROMPT },
        ...previousMessages,
        { role: "user", content: userMessageText },
      ],
      maxOutputTokens: 1000,
      temperature: 0.7,
      async onFinish({ text }) {
        // Save the assistant response after streaming is complete
        const assistantResponse = {
          id: generateId(),
          chatId,
          role: "assistant",
          parts: [{ type: "text", text }],
          attachments: [],
        };

        await saveMessage(assistantResponse);
      },
    });

    return stream.toTextStreamResponse({
      headers: {
        "X-Chat-Id": chatId,
      },
    });
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
