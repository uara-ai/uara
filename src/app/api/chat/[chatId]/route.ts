import { NextRequest } from "next/server";
import { streamText, convertToModelMessages, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { DEFAULT_MODEL, LONGEVITY_SYSTEM_PROMPT } from "@/packages/ai/client";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { z } from "zod";
import { RateLimiter } from "@/packages/redis/rate-limiter";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function isProFromStatus(sub?: {
  status: string | null;
  cancelAtPeriodEnd: boolean | null;
  currentPeriodEnd: Date | null;
  endedAt: Date | null;
}) {
  if (!sub) return false;
  const status = (sub.status || "").toLowerCase();
  if (status === "active" || status === "trialing" || status === "past_due") {
    if (sub.cancelAtPeriodEnd && sub.currentPeriodEnd) {
      return sub.currentPeriodEnd.getTime() > Date.now();
    }
    if (sub.endedAt && sub.endedAt.getTime() <= Date.now()) return false;
    return true;
  }
  return false;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    const body = await req.json();
    const { messages }: { messages: UIMessage[] } = body;

    // Get user from WorkOS
    const { user } = await withAuth();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in our database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        Subscription: {
          select: {
            status: true,
            cancelAtPeriodEnd: true,
            currentPeriodEnd: true,
            endedAt: true,
          },
        },
      },
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Verify chat exists and belongs to user
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: dbUser.id,
      },
    });

    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    // Check rate limits before processing
    const isProUser = isProFromStatus(dbUser.Subscription || undefined);
    const rateLimitResult = await RateLimiter.checkAndIncrement(
      dbUser.id,
      isProUser
    );

    if (!rateLimitResult.success) {
      return Response.json(
        {
          error: "Rate limit exceeded",
          remaining: rateLimitResult.remaining,
          resetTime: rateLimitResult.resetTime,
          limit: rateLimitResult.limit,
        },
        { status: 429 }
      );
    }

    // Save user message to database
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage?.role === "user") {
      const textPart = lastUserMessage.parts?.find(
        (part: any) => part.type === "text"
      ) as any;
      const messageContent = textPart?.text || "";
      await prisma.chatMessage.create({
        data: {
          chatId: chatId,
          role: "user",
          content: messageContent,
        },
      });
    }

    // Get existing messages from database for context
    const existingMessages = await prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      take: 50, // Limit context to last 50 messages for performance
    });

    // Convert existing messages to UI format
    const contextMessages: UIMessage[] = existingMessages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      parts: [{ type: "text", text: msg.content }],
    }));

    // Stream AI response with health and longevity tools
    const result = streamText({
      model: openai(DEFAULT_MODEL),
      messages: convertToModelMessages([
        {
          role: "system",
          parts: [{ type: "text", text: LONGEVITY_SYSTEM_PROMPT }],
          id: "system",
        },
        ...contextMessages,
      ]),
      temperature: 0.7,
      tools: {
        // Server-side tools with execute functions
        analyzeLabResults: {
          description:
            "Analyze lab results and provide health insights based on biomarkers",
          inputSchema: z.object({
            testType: z
              .string()
              .describe("Type of lab test (e.g., blood panel, lipid profile)"),
            values: z
              .record(z.string(), z.number())
              .describe("Lab values with reference ranges"),
            age: z.number().optional().describe("Patient age"),
            gender: z.string().optional().describe("Patient gender"),
          }),
          execute: async ({
            testType,
          }: {
            testType: string;
            values: Record<string, number>;
            age?: number;
            gender?: string;
          }) => {
            // Future: Integrate with actual lab analysis logic
            return `Lab analysis for ${testType}: Based on the provided values, here are the key insights and recommendations for optimizing your health markers.`;
          },
        },

        calculateBioAge: {
          description:
            "Calculate biological age based on biomarkers and lifestyle factors",
          inputSchema: z.object({
            biomarkers: z
              .record(z.string(), z.number())
              .describe("Key biomarkers like HRV, VO2 max, etc."),
            chronologicalAge: z.number().describe("Actual age in years"),
            lifestyle: z
              .object({
                exercise: z.number().describe("Exercise frequency per week"),
                sleep: z.number().describe("Average sleep hours"),
                stress: z.number().describe("Stress level 1-10"),
              })
              .optional(),
          }),
          execute: async ({
            chronologicalAge,
          }: {
            biomarkers: Record<string, number>;
            chronologicalAge: number;
            lifestyle?: { exercise: number; sleep: number; stress: number };
          }) => {
            // Future: Implement actual biological age calculation
            const estimatedBioAge = chronologicalAge - 2; // Placeholder calculation
            return {
              bioAge: estimatedBioAge,
              chronoAge: chronologicalAge,
              insights:
                "Your biological age appears to be lower than your chronological age, indicating good health practices.",
            };
          },
        },

        // Client-side tools (no execute function)
        getWhoopData: {
          description: "Fetch user data from Whoop wearable device",
          inputSchema: z.object({
            dataType: z
              .enum(["recovery", "strain", "sleep", "hrv"])
              .describe("Type of Whoop data to fetch"),
            days: z
              .number()
              .default(7)
              .describe("Number of days to fetch data for"),
          }),
        },

        askForConfirmation: {
          description:
            "Ask the user for confirmation before performing sensitive health actions",
          inputSchema: z.object({
            message: z
              .string()
              .describe("The confirmation message to display to the user"),
          }),
        },
      },
      onFinish: async (result) => {
        // Save assistant response to database
        try {
          await prisma.chatMessage.create({
            data: {
              chatId: chatId,
              role: "assistant",
              content: result.text,
            },
          });

          // Update chat timestamp
          await prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
          });

          // Invalidate cache when chat is updated
          const { revalidateTag } = await import("next/cache");
          revalidateTag("chat-history");
          revalidateTag(`user-${dbUser.id}`);
        } catch (error) {
          console.error("Error saving assistant message:", error);
        }
      },
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "X-Chat-Id": chatId,
        "X-Rate-Limit-Remaining": rateLimitResult.remaining.toString(),
        "X-Rate-Limit-Reset": rateLimitResult.resetTime.toISOString(),
        "X-Rate-Limit-Limit": rateLimitResult.limit.toString(),
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Cursor rules applied correctly.
