"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { unstable_cache } from "next/cache";

// Get user chat history with caching
const getCachedChatHistory = (userId: string) =>
  unstable_cache(
    async () => {
      console.log("Fetching chat history for user:", userId);
      const chats = await prisma.chat.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 50, // Limit to last 50 chats for performance
        distinct: ["id"], // Ensure no duplicate chat IDs
      });

      console.log("Found chats:", chats.length);
      return chats.map((chat) => ({
        id: chat.id,
        title: chat.title,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        messageCount: chat._count.messages,
      }));
    },
    ["chat-history", userId], // Use userId in cache key for user-specific caching
    {
      revalidate: 300, // Cache for 5 minutes
      tags: ["chat-history", `user-${userId}`],
    }
  )();

export const getChatHistoryAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    const { user } = await withAuth();
    if (!user?.id) throw new Error("Not authenticated");

    return await getCachedChatHistory(user.id);
  });

// Get specific chat details
export const getChatDetailsAction = actionClient
  .schema(z.object({ chatId: z.string() }))
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) throw new Error("Not authenticated");

    const chat = await prisma.chat.findFirst({
      where: {
        id: parsedInput.chatId,
        userId: user.id, // Ensure user can only access their own chats
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        messages: {
          select: {
            id: true,
            role: true,
            content: true,
            createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      throw new Error("Chat not found or access denied");
    }

    return chat;
  });

// Delete chat
export const deleteChatAction = actionClient
  .schema(z.object({ chatId: z.string() }))
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) throw new Error("Not authenticated");

    // Verify ownership before deletion
    const chat = await prisma.chat.findFirst({
      where: {
        id: parsedInput.chatId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!chat) {
      throw new Error("Chat not found or access denied");
    }

    await prisma.chat.delete({
      where: { id: parsedInput.chatId },
    });

    // Revalidate cache after deletion
    const { revalidateTag } = await import("next/cache");
    revalidateTag("chat-history");
    revalidateTag(`user-${user.id}`);

    return { success: true };
  });

// Update chat title
export const updateChatTitleAction = actionClient
  .schema(
    z.object({
      chatId: z.string(),
      title: z.string().min(1, "Title is required").max(100, "Title too long"),
    })
  )
  .action(async ({ parsedInput }) => {
    const { user } = await withAuth();
    if (!user?.id) throw new Error("Not authenticated");

    // Verify ownership before update
    const chat = await prisma.chat.findFirst({
      where: {
        id: parsedInput.chatId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (!chat) {
      throw new Error("Chat not found or access denied");
    }

    await prisma.chat.update({
      where: { id: parsedInput.chatId },
      data: { title: parsedInput.title },
    });

    // Revalidate cache after update
    const { revalidateTag } = await import("next/cache");
    revalidateTag("chat-history");
    revalidateTag(`user-${user.id}`);

    return { success: true };
  });

// Cursor rules applied correctly.
