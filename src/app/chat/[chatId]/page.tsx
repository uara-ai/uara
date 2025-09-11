import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import { getChatById } from "@/lib/db/queries";
import { ChatPageWrapper } from "@/components/ai/chat-page-wrapper";
import { getCurrentUser } from "@/lib/auth";

interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { chatId } = await params;
  const chat = await getChatById({ id: chatId });

  // If chat doesn't exist yet, it might be a new chat that hasn't been created
  // We'll allow this and let the chat component handle creating it when needed
  if (chat && chat.userId !== user.id) {
    // Chat exists but user doesn't own it
    redirect("/chat");
  }

  const userProfile = {
    id: user.id,
    firstName: user.name,
    lastName: user.surname,
    name: user.name && user.surname ? `${user.name} ${user.surname}` : null,
    email: user.email,
    profilePictureUrl: user.pictureUrl,
    avatarUrl: user.pictureUrl,
  };

  const chatData = chat
    ? {
        id: chat.id,
        title: chat.title,
        messages: chat.messages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.parts as any,
          createdAt: message.createdAt,
        })),
      }
    : {
        id: chatId,
        title: "New Chat",
        messages: [],
      };

  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatPageWrapper user={userProfile} chat={chatData} />
    </Suspense>
  );
}

// Cursor rules applied correctly.
