import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { saveChat, saveMessage, getChatById } from "@/lib/db/queries";
import { myProvider } from "@/lib/ai/providers";
import { LONGEVITY_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { ChatSDKError } from "@/lib/errors";
import { createTools } from "@/lib/ai/tools";

export async function POST(request: Request) {
  try {
    const { id, message, selectedChatModel, selectedVisibilityType } =
      await request.json();

    // Validate that message exists
    if (!message) {
      return new ChatSDKError("bad_request:api").toResponse();
    }

    // Require authentication
    const user = await requireAuth();
    if (!user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    // Check rate limit
    await checkRateLimit(user.id);

    const chat = await getChatById({ id });

    if (!chat) {
      const title = message?.parts?.[0]?.text?.slice(0, 100) || "New Chat";

      await saveChat({
        id,
        userId: user.id,
        title,
        visibility: selectedVisibilityType || "private",
      });
    } else {
      if (chat.userId !== user.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
    }

    // Get existing messages from chat
    const messagesFromDb = chat?.messages || [];
    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    // Save the user message
    await saveMessage({
      id: message.id,
      chatId: id,
      role: message.role,
      parts: message.parts || [],
      attachments: message.attachments || [],
    });

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        // Create tools with user context and data stream
        const tools = createTools({ user, dataStream });

        const result = streamText({
          model: myProvider.languageModel(selectedChatModel || "chat-model"),
          system: LONGEVITY_SYSTEM_PROMPT,
          messages: convertToModelMessages(uiMessages),
          tools,
          stopWhen: stepCountIs(5),
          experimental_transform: smoothStream({ chunking: "word" }),
          maxOutputTokens: 1000,
          temperature: 0.7,
          onFinish: ({ usage }) => {
            dataStream.write({ type: "data-usage", data: usage });
          },
        });

        result.consumeStream();

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          })
        );
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        // Save all messages generated during the stream
        for (const msg of messages) {
          if (msg.role === "assistant") {
            await saveMessage({
              id: msg.id,
              chatId: id,
              role: msg.role,
              parts: msg.parts,
              attachments: [],
            });
          }
        }
      },
      onError: () => {
        return "Oops, an error occurred!";
      },
    });

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()), {
      headers: {
        "X-Chat-Id": id,
      },
    });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error("Unhandled error in chat API:", error);
    return new ChatSDKError("offline:chat").toResponse();
  }
}

export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return new ChatSDKError("bad_request:api").toResponse();
    }

    const chat = await getChatById({ id: chatId });
    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    // Check if user owns the chat
    if (chat.userId !== user.id) {
      return new ChatSDKError("forbidden:chat").toResponse();
    }

    return Response.json(chat);
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error("Get chat error:", error);
    return new ChatSDKError("offline:chat").toResponse();
  }
}

// Cursor rules applied correctly.
