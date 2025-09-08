import { prisma } from "@/lib/prisma";
import { withAuth } from "@workos-inc/authkit-nextjs";

export async function GET() {
  try {
    // Get user from WorkOS
    const { user } = await withAuth();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in our database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Get all chats for user
    const chats = await prisma.chat.findMany({
      where: {
        userId: dbUser.id,
      },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return Response.json(chats);
  } catch (error) {
    console.error("Get chats error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Cursor rules applied correctly.
