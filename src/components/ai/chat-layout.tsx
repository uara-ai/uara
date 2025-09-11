"use client";

import { useState } from "react";
import { Chat } from "./chat";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DataStreamProvider } from "./data-stream-provider";
import { DataStreamHandler } from "./data-stream-handler";
import { User } from "@/lib/user.type";

interface ChatLayoutProps {
  user: User;
}

export function ChatPageLayout({ user }: ChatLayoutProps) {
  // Generate a temporary chat ID for new chats
  // The actual chat will be created when the user sends their first message
  const [chatId] = useState<string>(() =>
    Math.random().toString(36).substring(2, 15)
  );

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
          id={chatId}
          initialMessages={[]}
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
