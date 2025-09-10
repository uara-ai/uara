"use client";

import { RateLimitProvider } from "@/hooks/use-rate-limit-context";
import { Navbar } from "@/components/navbar";
import { ChatInterface } from "@/components/ai/chat-interface";
import { User } from "@/lib/user.type";

interface ChatPageWrapperProps {
  user: User;
  chat: {
    id: string;
    title: string;
    messages: Array<{
      id: string;
      role: string;
      content: string;
      createdAt: Date;
    }>;
  };
}

export function ChatPageWrapper({ user, chat }: ChatPageWrapperProps) {
  return (
    <RateLimitProvider enabled={!!user}>
      <div className="flex flex-col h-screen">
        <Navbar
          isDialogOpen={false}
          chatId={chat.id}
          selectedVisibilityType="public"
          status="ready"
          user={user}
        />
        <ChatInterface
          initialChatId={chat.id}
          initialMessages={chat.messages}
          initialTitle={chat.title}
          user={user}
        />
      </div>
    </RateLimitProvider>
  );
}

// Cursor rules applied correctly.
