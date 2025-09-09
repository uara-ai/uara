import { notFound } from "next/navigation";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { getChatDetailsAction } from "@/actions/chat-history-action";
import { ChatInterface } from "@/components/ai/chat-interface";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const resolvedParams = await params;
  const { user } = await withAuth();

  if (!user?.id) {
    notFound();
  }

  try {
    const result = await getChatDetailsAction({
      chatId: resolvedParams.chatId,
    });

    if (!result.data) {
      notFound();
    }

    const chat = result.data;

    return (
      <div className="flex flex-col h-screen">
        <ChatInterface
          initialChatId={chat.id}
          initialMessages={chat.messages}
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
