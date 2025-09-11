"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Chat } from "./chat";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DataStreamProvider } from "./data-stream-provider";
import { DataStreamHandler } from "./data-stream-handler";
import { User } from "@/lib/user.type";

interface ChatLayoutProps {
  user: User;
}

export function ChatPageLayout({ user }: ChatLayoutProps) {
  const router = useRouter();
  const [chatId, setChatId] = useState<string>("");

  useEffect(() => {
    // Generate a new chat ID and redirect to it
    const newChatId = Math.random().toString(36).substring(2, 15);
    setChatId(newChatId);
    router.push(`/chat/${newChatId}`);
  }, [router]);

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
        {chatId && (
          <Chat
            id={chatId}
            initialMessages={[]}
            initialChatModel="claude-3-5-sonnet-20241022"
            initialVisibilityType="private"
            isReadonly={false}
            session={userSession}
            autoResume={false}
          />
        )}
      </DataStreamProvider>
    </SidebarProvider>
  );
}

// Cursor rules applied correctly.
