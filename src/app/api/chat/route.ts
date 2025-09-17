import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";
import { setContext } from "@/lib/ai/context";
import { tools } from "@/lib/ai/tools";
import { LONGEVITY_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { myProvider } from "@/lib/ai/providers";
import { checkRateLimit, createRateLimitHeaders } from "@/lib/rate-limit";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { ChatSDKError } from "@/lib/errors";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { user } = await withAuth();
  if (!user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Check rate limit and get updated status
  const rateLimitData = await checkRateLimit(user?.id);

  const stream = createUIMessageStream({
    execute: ({ writer }) => {
      // Set up typed context with user information
      setContext({
        writer,
        userId: user?.id,
        fullName: user?.firstName || "",
      });

      const result = streamText({
        model: myProvider.languageModel("chat-model"),
        system: LONGEVITY_SYSTEM_PROMPT,
        messages: convertToModelMessages(messages),
        tools: tools(),
        maxOutputTokens: 1000,
        temperature: 0.7,
        onFinish: ({ usage }) => {
          writer.write({ type: "data-usage", data: usage });
        },
      });

      writer.merge(result.toUIMessageStream());
    },
  });

  // Create response with rate limit headers
  const response = createUIMessageStreamResponse({
    stream,
    headers: createRateLimitHeaders(rateLimitData),
  });

  return response;
}
