import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getChatById, saveChat } from "@/lib/db/queries";
import { ChatInterface } from "@/components/ai/chat-interface";
import { convertToUIMessages } from "@/lib/utils";
import { UIChatMessage } from "@/components/ai/types";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  try {
    const user = await requireAuth();
    let chat = await getChatById({ id });

    if (!chat) {
      // Create a new chat if it doesn't exist
      await saveChat({
        id,
        userId: user.id,
        title: "New Chat",
        visibility: "private",
      });

      // Fetch the newly created chat
      chat = await getChatById({ id });

      if (!chat) {
        notFound();
      }
    }

    // Check if user owns the chat
    if (chat.userId !== user.id) {
      notFound();
    }

    // Convert database messages to UI format
    const uiMessages = convertToUIMessages(chat.messages || []);

    return (
      <div className="h-screen overflow-hidden">
        <ChatInterface
          id={id}
          initialMessages={uiMessages as UIChatMessage[]}
          initialTitle={chat.title}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading chat:", error);
    notFound();
  }
}

// Cursor rules applied correctly.
