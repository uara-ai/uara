import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params;

    // Get user from WorkOS
    const { user } = await withAuth();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in our database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Get chat with messages
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: dbUser.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            toolInvocations: true,
          },
        },
      },
    });

    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    return Response.json(chat);
  } catch (error) {
    console.error("Get chat error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  try {
    const { chatId } = params;

    // Get user from WorkOS
    const { user } = await withAuth();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in our database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Delete chat (messages will be deleted via cascade)
    const deletedChat = await prisma.chat.deleteMany({
      where: {
        id: chatId,
        userId: dbUser.id,
      },
    });

    if (deletedChat.count === 0) {
      return Response.json({ error: "Chat not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete chat error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Cursor rules applied correctly.
