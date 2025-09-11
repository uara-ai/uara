import { requireAuth } from "@/lib/auth";
import { getChatById, getVotesByChatId, voteMessage } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameter chatId is required."
    ).toResponse();
  }

  try {
    const user = await requireAuth();

    const chat = await getChatById({ id: chatId });

    if (!chat) {
      return new ChatSDKError("not_found:chat").toResponse();
    }

    if (chat.userId !== user.id) {
      return new ChatSDKError("forbidden:vote").toResponse();
    }

    const votes = await getVotesByChatId({ id: chatId });

    return Response.json(votes, { status: 200 });
  } catch (error) {
    console.error("Get votes error:", error);
    return new ChatSDKError("unauthorized:vote").toResponse();
  }
}

export async function PATCH(request: Request) {
  const {
    chatId,
    messageId,
    type,
  }: { chatId: string; messageId: string; type: "up" | "down" } =
    await request.json();

  if (!chatId || !messageId || !type) {
    return new ChatSDKError(
      "bad_request:api",
      "Parameters chatId, messageId, and type are required."
    ).toResponse();
  }

  try {
    const user = await requireAuth();

    const chat = await getChatById({ id: chatId });

    if (!chat) {
      return new ChatSDKError("not_found:vote").toResponse();
    }

    if (chat.userId !== user.id) {
      return new ChatSDKError("forbidden:vote").toResponse();
    }

    await voteMessage({
      chatId,
      messageId,
      type: type,
    });

    return new Response("Message voted", { status: 200 });
  } catch (error) {
    console.error("Vote error:", error);
    return new ChatSDKError("unauthorized:vote").toResponse();
  }
}
