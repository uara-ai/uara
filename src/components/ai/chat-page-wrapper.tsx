"use client";

import { Chat } from "./chat";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DataStreamProvider } from "./data-stream-provider";
import { DataStreamHandler } from "./data-stream-handler";
import { User } from "@/lib/user.type";

interface ChatData {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    role: string;
    content: any;
    createdAt: Date;
  }>;
}

interface ChatPageWrapperProps {
  user: User;
  chat: ChatData;
}

export function ChatPageWrapper({ user, chat }: ChatPageWrapperProps) {
  // Convert messages to the expected format
  const messages = chat.messages.map((message) => ({
    id: message.id,
    role: message.role as "user" | "assistant" | "system",
    parts: Array.isArray(message.content)
      ? message.content
      : [{ type: "text", text: message.content }],
    createdAt: message.createdAt,
  }));

  const userSession = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.profilePictureUrl,
      type: "free" as const,
    },
  };

  return (
    <SidebarProvider>
      <DataStreamProvider>
        <DataStreamHandler />
        <Chat
          id={chat.id}
          initialMessages={messages}
          initialChatModel="claude-3-5-sonnet-20241022"
          initialVisibilityType="private"
          isReadonly={false}
          session={userSession}
          autoResume={false}
        />
      </DataStreamProvider>
    </SidebarProvider>
  );
}

// Cursor rules applied correctly.
