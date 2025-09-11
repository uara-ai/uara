import { actionClient } from "./safe-action";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import {
  getChatsByUserId,
  deleteChatById,
  getChatById,
} from "@/lib/db/queries";

const getChatHistorySchema = z.object({});

export const getChatHistoryAction = actionClient
  .schema(getChatHistorySchema)
  .action(async () => {
    const user = await requireAuth();

    const chats = await getChatsByUserId({ userId: user.id });

    return chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messageCount: chat.messages.length,
    }));
  });

const deleteChatSchema = z.object({
  chatId: z.string(),
});

export const deleteChatAction = actionClient
  .schema(deleteChatSchema)
  .action(async ({ parsedInput }) => {
    const user = await requireAuth();

    // Verify chat exists and user owns it
    const chat = await getChatById({ id: parsedInput.chatId });
    if (!chat) {
      throw new Error("Chat not found");
    }

    if (chat.userId !== user.id) {
      throw new Error("Unauthorized");
    }

    await deleteChatById({ id: parsedInput.chatId });

    return { success: true };
  });

// Cursor rules applied correctly.
