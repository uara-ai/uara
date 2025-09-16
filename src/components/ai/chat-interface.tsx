"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { generateId, UIMessage, DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import { Overview } from "@/components/ai/overview";
import { ThinkingMessage } from "@/components/ai/thinking-message";
import { ActiveToolCall } from "@/components/ai/active-tool-call";
import { ChatHeader } from "@/components/ai/chat-header";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai/elements/conversation";
import {
  Message,
  MessageContent,
  MessageAvatar,
} from "@/components/ai/elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
} from "@/components/ai/elements/prompt-input";
import { Response } from "@/components/ai/elements/response";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { UIChatMessage } from "./types";
import { AIDevtools } from "ai-sdk-devtools";

interface ChatInterfaceProps {
  id?: string;
  initialMessages?: UIChatMessage[];
  initialTitle?: string | null;
}

export function ChatInterface({
  id,
  initialMessages = [],
  initialTitle,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [chatTitle, setChatTitle] = useState<string | undefined>(
    initialTitle || undefined
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Generate a consistent chat ID - use provided ID or generate one
  const chatId = useMemo(() => id ?? generateId(), [id]);

  // Check if we're currently on the root path (no chatId in URL)
  const isOnRootPath =
    pathname === "/healthspan/chat" || pathname === "/healthspan/chat/";

  // Track overview visibility
  const [showOverview, setShowOverview] = useState(isOnRootPath);

  // Load user data
  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    }
    loadUser();
  }, []);

  const updateUrl = (chatId?: string) => {
    if (chatId) {
      setIsTransitioning(true);
      // Add a small delay to ensure the chat is saved to the database first
      setTimeout(() => {
        router.push(`/healthspan/chat/${chatId}`);
        // Reset transition state after navigation
        setTimeout(() => setIsTransitioning(false), 200);
      }, 100);
    }
  };

  // Create authenticated fetch function
  const authenticatedFetch = useMemo(
    () =>
      Object.assign(
        async (url: RequestInfo | URL, requestOptions?: RequestInit) => {
          return fetch(url, {
            ...requestOptions,
            headers: {
              ...requestOptions?.headers,
              "Content-Type": "application/json",
            },
          });
        }
      ),
    []
  );

  const { messages, sendMessage, setMessages, status } = useChat<UIMessage>({
    id: chatId,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      fetch: authenticatedFetch,
      prepareSendMessagesRequest({ messages, id }) {
        console.log("📨 Preparing request:", {
          id,
          messagesCount: messages.length,
        });
        return {
          body: {
            id,
            message: messages[messages.length - 1],
            selectedChatModel: "chat-model",
            selectedVisibilityType: "private",
          },
        };
      },
    }),
    onData: (dataPart) => {
      console.log("📡 Received data:", dataPart);
      // Handle title data parts as they stream in
      if (dataPart.type === "data-title") {
        setChatTitle((dataPart as any).data.title);

        if (typeof document !== "undefined") {
          document.title = `${(dataPart as any).data.title} | Uara.ai`;
        }
      }
    },
  });

  // Debug: Track messages changes
  useEffect(() => {
    console.log("💬 Messages updated:", messages.length, messages);
  }, [messages]);

  // Set initial messages if provided
  useEffect(() => {
    if (
      initialMessages &&
      initialMessages.length > 0 &&
      messages.length === 0
    ) {
      console.log("🔄 Setting initial messages:", initialMessages);
      setMessages(initialMessages as UIMessage[]);
    }
  }, [initialMessages, messages.length, setMessages]);

  // Clear messages and title when navigating back to root path
  useEffect(() => {
    // Only clear when explicitly navigating back to the root chat path
    // Don't clear during the transition from overview to chat with ID
    if (
      (pathname === "/healthspan/chat" || pathname === "/healthspan/chat/") &&
      !isTransitioning
    ) {
      const isNavigatingBackToRoot = !pathname.includes("/healthspan/chat/");
      if (isNavigatingBackToRoot) {
        setMessages([]);
        setChatTitle(undefined);
        setShowOverview(true);
      }
    }
  }, [pathname, setMessages, isTransitioning]);

  // Hide header immediately when transitioning to chat
  useEffect(() => {
    if (!isOnRootPath && showOverview) {
      setShowOverview(false);
    }
  }, [isOnRootPath, showOverview]);

  // Update chat title when initialTitle changes
  useEffect(() => {
    if (initialTitle) {
      setChatTitle(initialTitle);
    }
  }, [initialTitle]);

  // Set document title when chat title is available
  useEffect(() => {
    if (chatTitle && typeof document !== "undefined") {
      document.title = `${chatTitle} | Uara.ai`;
    }
  }, [chatTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim()) {
      // Start header animation immediately when user sends first message
      if (isOnRootPath && messages.length === 0 && showOverview) {
        setShowOverview(false);
      }

      // If we're on the root path and this is the first message, update URL
      if (isOnRootPath && messages.length === 0) {
        updateUrl(chatId);
      }

      sendMessage({
        role: "user",
        parts: [{ type: "text", text: input }],
      });

      setInput("");
    }
  };

  const handleToolCall = async ({
    toolName,
    toolParams,
    text,
  }: {
    toolName: string;
    toolParams: Record<string, any>;
    text: string;
  }) => {
    console.log("🚀 Quick action triggered:", { toolName, toolParams, text });
    console.log("📊 Current state:", {
      isOnRootPath,
      messagesLength: messages.length,
      showOverview,
      chatId,
      pathname,
    });

    // Start header animation immediately when user sends first message
    if (isOnRootPath && messages.length === 0 && showOverview) {
      console.log("🎯 Hiding overview");
      setShowOverview(false);
    }

    // If we're on the root path and this is the first message, update URL
    if (isOnRootPath && messages.length === 0) {
      console.log("🔗 Updating URL to:", `/healthspan/chat/${chatId}`);
      updateUrl(chatId);
    }

    console.log("📤 Sending message...");
    sendMessage({
      role: "user",
      parts: [{ type: "text", text }],
      metadata: {
        internal: false, // Changed to false so the message is visible
        toolCall: {
          toolName,
          toolParams,
        },
      } as any,
    });
  };

  if (status === "error") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#085983] mb-2">
            Something went wrong
          </h2>
          <p className="text-[#085983]/60">Failed to load chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      {/* Header */}
      <ChatHeader title={chatTitle} />

      {/* Main chat container */}
      <div className="relative w-full">
        {showOverview && <Overview onToolCall={handleToolCall} />}

        <div
          className={cn(
            "w-full mx-auto pb-0 relative size-full h-[calc(100vh-86px)]",
            showOverview && "h-[calc(100vh-400px)]"
          )}
        >
          <div className="flex flex-col h-full w-full">
            <Conversation className="h-full w-full">
              <ConversationContent className="px-6 mx-auto mt-16 mb-28 max-w-[770px]">
                {messages.map((message) => {
                  // Skip rendering internal/hidden messages
                  if ((message.metadata as any)?.internal) {
                    return null;
                  }

                  return (
                    <div key={message.id} className="w-full">
                      {message.role !== "system" && (
                        <Message from={message.role} key={message.id}>
                          <MessageContent>
                            {message.parts?.map((part, partIndex) => {
                              if (part.type === "text") {
                                return (
                                  <Response key={`text-${partIndex}`}>
                                    {part.text}
                                  </Response>
                                );
                              }

                              if (part.type?.startsWith("tool-")) {
                                const toolOutput = (part as any).output;
                                const shouldHide =
                                  toolOutput?.display === "hidden";

                                if (shouldHide) {
                                  // Check if this message has text content - if so, don't show the pill
                                  const hasTextContent = message.parts?.some(
                                    (p) => p.type === "text" && p.text?.trim()
                                  );

                                  if (hasTextContent) {
                                    return null; // Hide pill when we have AI analysis
                                  }

                                  const toolName = part.type.replace(
                                    "tool-",
                                    ""
                                  );
                                  return (
                                    <ActiveToolCall
                                      key={`tool-call-${partIndex}`}
                                      toolName={toolName}
                                    />
                                  );
                                }

                                // Show full tool output for tools that want to be displayed
                                return (
                                  <Response key={`tool-result-${partIndex}`}>
                                    {toolOutput?.content || toolOutput}
                                  </Response>
                                );
                              }

                              return null;
                            })}
                          </MessageContent>

                          {message.role === "user" && user && (
                            <MessageAvatar
                              src={user.pictureUrl || "/placeholder-avatar.png"}
                              name={user.name || "You"}
                            />
                          )}
                        </Message>
                      )}
                    </div>
                  );
                })}

                {status === "submitted" &&
                  messages.length > 0 &&
                  messages[messages.length - 1]?.role === "user" && (
                    <ThinkingMessage />
                  )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            <div className="absolute bottom-4 left-0 right-0 z-20 px-6">
              <div className="mx-auto w-full bg-background pt-2 max-w-[770px]">
                <PromptInput onSubmit={handleSubmit}>
                  <PromptInputTextarea
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                    placeholder="Ask me about your health and longevity..."
                  />
                  <PromptInputToolbar className="pb-1 px-4">
                    <PromptInputTools>
                      <PromptInputButton className="-ml-2">
                        <svg
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </PromptInputButton>
                    </PromptInputTools>
                    <PromptInputSubmit
                      status={status}
                      className="mr-0 mb-2"
                      size="icon"
                    />
                  </PromptInputToolbar>
                </PromptInput>
              </div>
            </div>
          </div>
        </div>
      </div>
      {process.env.NODE_ENV === "development" && (
        <AIDevtools
          config={{
            position: "bottom",
          }}
        />
      )}
    </div>
  );
}

// Cursor rules applied correctly.
