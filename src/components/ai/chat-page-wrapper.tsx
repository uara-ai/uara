"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useRouter } from "next/navigation";
import { RateLimitProvider } from "@/hooks/use-rate-limit-context";
import { Navbar } from "@/components/navbar";
import { Messages } from "@/components/ai/messages";
import { ChatInput } from "@/components/ai/chat-input";
import { useRateLimitContext } from "@/hooks/use-rate-limit-context";
import { User } from "@/lib/user.type";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

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

function ChatPageContent({ user, chat }: ChatPageWrapperProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
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

  const { messages, status, error, sendMessage, setMessages, addToolResult } =
    useChat({
      id: chat.id,
      transport: new DefaultChatTransport({
        api: `/api/chat/${chat.id}`,
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
        switch (toolCall.toolName) {
          case "getUserLocation":
            addToolResult({
              tool: "getUserLocation",
              toolCallId: toolCall.toolCallId,
              output: "Location access would be handled here",
            });
            break;

          case "getHealthData":
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
    });

  // Load initial messages on mount, but don't interfere with streaming
  useEffect(() => {
    if (chat.messages && chat.messages.length > 0 && messages.length === 0) {
      const formattedMessages = chat.messages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
        parts: [{ type: "text" as const, text: msg.content }],
      }));
      setMessages(formattedMessages);
    }
  }, []); // Only run once on mount

  // Auto-scroll to bottom when new messages arrive (only if user is at or near bottom)
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Small delay to ensure DOM is updated
    setTimeout(scrollToBottom, 50);
  }, [messages.length]); // Only scroll when number of messages changes

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === "submitted") return;

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

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Fixed Navbar */}
      <Navbar
        isDialogOpen={false}
        chatId={chat.id}
        selectedVisibilityType="public"
        status={status}
        user={user}
      />

      {/* Main Chat Container */}
      <div className="flex flex-col flex-1 mt-16 overflow-hidden">
        {/* Chat Header with Title and Navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm shrink-0">
          <div className="max-w-4xl mx-auto flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoHome}
              className="h-8 w-8 p-0 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Go home</span>
            </Button>
            <h1 className="text-lg font-medium truncate text-foreground">
              {chat.title}
            </h1>
          </div>
        </div>

        {/* Messages Container - This is the scrollable area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="space-y-6">
              {messages.map((message: any, index: number) => (
                <div
                  key={message.id || index}
                  className={`flex w-full ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-4xl w-full ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      {message.role === "assistant" ? (
                        <>
                          <AvatarImage src="/logo.svg" alt="Uara AI" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarImage
                            src={
                              user?.profilePictureUrl || user?.avatarUrl || ""
                            }
                            alt={user?.name || user?.firstName || "User"}
                          />
                          <AvatarFallback className="bg-primary text-white">
                            {user?.name?.charAt(0) ||
                              user?.firstName?.charAt(0) || (
                                <UserIcon className="h-4 w-4" />
                              )}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>

                    {/* Message Content */}
                    <div
                      className={`group min-w-0 ${
                        message.role === "user"
                          ? "flex justify-end flex-1"
                          : "flex-1"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-3 relative ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground inline-block max-w-[80%] w-fit"
                            : "bg-muted/50 text-foreground w-full"
                        }`}
                      >
                        <div
                          className={`text-sm leading-relaxed ${
                            message.role === "user"
                              ? ""
                              : "prose prose-sm max-w-none dark:prose-invert"
                          }`}
                        >
                          {message.parts?.map(
                            (part: any, partIndex: number) => {
                              if (part.type === "text") {
                                return message.role === "user" ? (
                                  <span key={partIndex}>{part.text}</span>
                                ) : (
                                  <ReactMarkdown
                                    key={partIndex}
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                    components={{
                                      code: ({
                                        node,
                                        inline,
                                        className,
                                        children,
                                        ...props
                                      }: any) => (
                                        <code
                                          className={`${
                                            inline
                                              ? "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
                                              : "block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"
                                          } ${className || ""}`}
                                          {...props}
                                        >
                                          {children}
                                        </code>
                                      ),
                                      pre: ({ children }) => (
                                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                                          {children}
                                        </pre>
                                      ),
                                    }}
                                  >
                                    {part.text}
                                  </ReactMarkdown>
                                );
                              }
                              return null;
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading State */}
              {status === "submitted" && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-3 max-w-4xl w-full">
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarImage src="/logo.svg" alt="Uara AI" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-muted/50 text-foreground rounded-2xl px-4 py-3 w-full">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-primary rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-3 max-w-4xl w-full">
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarImage src="/logo.svg" alt="Uara AI" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl px-4 py-3 w-full">
                        <div className="text-sm">
                          Sorry, I encountered an error. Please try again.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>
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

export function ChatPageWrapper({ user, chat }: ChatPageWrapperProps) {
  return (
    <RateLimitProvider enabled={!!user}>
      <ChatPageContent user={user} chat={chat} />
    </RateLimitProvider>
  );
}

// Cursor rules applied correctly.
