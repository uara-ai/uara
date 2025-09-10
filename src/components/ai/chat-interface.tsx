"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "@/lib/user.type";
import { WelcomeScreen } from "./welcome-screen";
import { ChatHeader } from "./chat-header";
import { Messages } from "./messages";
import { ChatInput } from "./chat-input";
import { useRateLimitContext } from "@/hooks/use-rate-limit-context";

interface ChatInterfaceProps {
  className?: string;
  user?: User | null;
  initialChatId?: string;
  initialMessages?: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: Date;
  }>;
  initialTitle?: string;
}

export function ChatInterface({
  className,
  user,
  initialChatId,
  initialMessages,
}: ChatInterfaceProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(!!initialChatId);
  const [currentChatId, setCurrentChatId] = useState<string | null>(
    initialChatId || null
  );
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
    stop,
    addToolResult,
  } = useChat({
    id: currentChatId || undefined,
    transport: new DefaultChatTransport({
      api: currentChatId ? `/api/chat/${currentChatId}` : "/api/chat",
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

    onFinish: (options) => {
      // Scroll to bottom when message finishes
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
  });

  // Load initial messages if provided
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      const formattedMessages = initialMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
        parts: [{ type: "text" as const, text: msg.content }],
      }));
      setMessages(formattedMessages);
    }
  }, [initialMessages, setMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === "submitted") return;

    // Always expand to chat mode when sending a message
    setIsExpanded(true);

    // Immediately decrement counter for instant feedback
    decrementCounter();

    sendMessage({ text: input });
    setInput("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setIsExpanded(true);

    // Immediately decrement counter for instant feedback
    decrementCounter();

    sendMessage({ text: suggestion });
  };

  const handleCloseChat = () => {
    // If we're on a specific chat page (have initialChatId), navigate to homepage
    if (initialChatId) {
      router.push("/");
    } else {
      // Otherwise just collapse the chat interface
      setIsExpanded(false);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full",
        isExpanded ? "mt-0" : "mt-24",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <WelcomeScreen
            input={input}
            status={status}
            onInputChange={handleInputChange}
            onSubmit={handleChatSubmit}
            onSuggestionClick={handleSuggestionClick}
            inputRef={inputRef}
          />
        ) : (
          // Expanded state - chat interface with minimal header, navbar stays in place
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full pt-16" // Add top padding to account for navbar
          >
            <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
              <ChatHeader messages={messages} onClose={handleCloseChat} />

              <Messages
                messages={messages}
                user={user}
                status={status}
                error={error}
                addToolResult={addToolResult}
                messagesEndRef={messagesEndRef}
              />

              <ChatInput
                input={input}
                status={status}
                onInputChange={handleInputChange}
                onSubmit={handleChatSubmit}
                inputRef={inputRef}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Cursor rules applied correctly.
