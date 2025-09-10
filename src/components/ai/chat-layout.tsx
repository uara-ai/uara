"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/lib/user.type";
import { Navbar } from "@/components/navbar";
import { Messages } from "./messages";
import { ChatInput } from "./chat-input";
import { useRateLimitContext } from "@/hooks/use-rate-limit-context";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ChatLayoutProps {
  user: User | null;
}

export function ChatLayout({ user }: ChatLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [hasProcessedInitialMessage, setHasProcessedInitialMessage] =
    useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get rate limit context for real-time updates
  const { updateFromHeaders, decrementCounter } = useRateLimitContext();

  // Custom fetch function to capture rate limit headers
  const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, init);

    // Redirect unauthenticated users to login
    if (response.status === 401) {
      router.push("/login");
    }

    // Extract rate limit headers and update context
    if (response.headers.has("X-Rate-Limit-Remaining")) {
      updateFromHeaders(response.headers);
    }

    return response;
  };

  const { messages, status, error, sendMessage, stop, addToolResult } = useChat(
    {
      transport: new DefaultChatTransport({
        api: "/api/chat",
        fetch: customFetch,
      }),

      // Automatically submit when all tool results are available
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

      // Handle client-side tools that are automatically executed
      async onToolCall({ toolCall }) {
        // Check if it's a dynamic tool first for proper type narrowing
        if (toolCall.dynamic) {
          return;
        }

        // Example: Handle future client-side tools here
        // For now, we'll prepare the structure for future health tools
        switch (toolCall.toolName) {
          case "getUserLocation":
            // Future: Get user location for health providers
            addToolResult({
              tool: "getUserLocation",
              toolCallId: toolCall.toolCallId,
              output: "Location access would be handled here",
            });
            break;

          case "getHealthData":
            // Future: Get health data from wearables
            addToolResult({
              tool: "getHealthData",
              toolCallId: toolCall.toolCallId,
              output: "Health data would be retrieved here",
            });
            break;
        }
      },

      onFinish: () => {
        // Scroll to bottom when message finishes
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
    }
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle initial message from search params - pre-fill input instead of auto-sending
  useEffect(() => {
    const initialMessage = searchParams.get("message");
    if (initialMessage && !hasProcessedInitialMessage) {
      // Pre-fill the input with the initial message
      setInput(initialMessage);

      // Set the chat title
      setChatTitle("New Chat");

      // Mark as processed to prevent duplicates
      setHasProcessedInitialMessage(true);

      // Clear the URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, hasProcessedInitialMessage]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === "submitted") return;

    // Store the message text before clearing input
    const messageText = input;
    setInput("");

    // If this is the first message (no existing messages), create a new chat
    if (messages.length === 0) {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                id: crypto.randomUUID(),
                role: "user",
                parts: [{ type: "text", text: messageText }],
              },
            ],
          }),
        });

        const chatId = response.headers.get("X-Chat-Id");
        if (chatId) {
          // Navigate to the new chat page
          router.push(`/chat/${chatId}`);
          return;
        }
      } catch (error) {
        console.error("Error creating chat:", error);
        // Fall back to local chat
      }
    }

    // For existing chats or fallback, use the normal flow
    decrementCounter();
    sendMessage({ text: messageText });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleCloseChat = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Fixed Navbar */}
      <Navbar
        isDialogOpen={false}
        chatId={null}
        selectedVisibilityType="public"
        status={status}
        user={user}
      />

      {/* Main Content Container with max-width */}
      <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full mt-16 min-h-0">
        {/* Chat Header with Title */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm shrink-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium truncate text-foreground">
              {chatTitle}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseChat}
            className="ml-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Area - Flexible, scrollable */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <Messages
            messages={messages}
            user={user}
            status={status}
            error={error}
            addToolResult={addToolResult}
            messagesEndRef={messagesEndRef}
          />
        </div>

        {/* Fixed Chat Input at Bottom */}
        <div className="border-t border-border bg-background shrink-0">
          <ChatInput
            input={input}
            status={status}
            onInputChange={handleInputChange}
            onSubmit={handleChatSubmit}
            inputRef={inputRef}
          />
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
