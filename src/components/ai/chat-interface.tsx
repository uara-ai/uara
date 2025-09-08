"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  className?: string;
}

// Helper function to render health-specific tools
const renderHealthTool = (part: any, addToolResult: any) => {
  const callId = part.toolCallId;

  switch (part.type) {
    case "tool-analyzeLabResults":
      switch (part.state) {
        case "input-streaming":
          return <div>Loading lab analysis...</div>;
        case "input-available":
          return <div>Analyzing lab results for {part.input.testType}...</div>;
        case "output-available":
          return (
            <div>
              <h5 className="font-semibold">Lab Analysis Results:</h5>
              <p>{part.output}</p>
            </div>
          );
        case "output-error":
          return (
            <div className="text-red-600">
              Error analyzing labs: {part.errorText}
            </div>
          );
      }
      break;

    case "tool-getWhoopData":
      switch (part.state) {
        case "input-streaming":
          return <div>Connecting to Whoop...</div>;
        case "input-available":
          return <div>Fetching your Whoop data...</div>;
        case "output-available":
          return (
            <div>
              <h5 className="font-semibold">Whoop Data:</h5>
              <p>Recovery: {part.output.recovery}%</p>
              <p>HRV: {part.output.hrv}ms</p>
            </div>
          );
        case "output-error":
          return (
            <div className="text-red-600">
              Error fetching Whoop data: {part.errorText}
            </div>
          );
      }
      break;

    case "tool-calculateBioAge":
      switch (part.state) {
        case "input-streaming":
          return <div>Calculating biological age...</div>;
        case "input-available":
          return <div>Processing biomarkers...</div>;
        case "output-available":
          return (
            <div>
              <h5 className="font-semibold">Biological Age Analysis:</h5>
              <p>Estimated Bio Age: {part.output.bioAge} years</p>
              <p>Chronological Age: {part.output.chronoAge} years</p>
            </div>
          );
        case "output-error":
          return (
            <div className="text-red-600">
              Error calculating bio age: {part.errorText}
            </div>
          );
      }
      break;

    case "tool-askForConfirmation":
      switch (part.state) {
        case "input-streaming":
          return <div>Loading confirmation request...</div>;
        case "input-available":
          return (
            <div>
              <p className="mb-2">{part.input.message}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    addToolResult({
                      tool: "askForConfirmation",
                      toolCallId: callId,
                      output: "Yes, confirmed.",
                    })
                  }
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    addToolResult({
                      tool: "askForConfirmation",
                      toolCallId: callId,
                      output: "No, denied",
                    })
                  }
                >
                  No
                </Button>
              </div>
            </div>
          );
        case "output-available":
          return (
            <div>
              <p>Confirmation result: {part.output}</p>
            </div>
          );
        case "output-error":
          return <div className="text-red-600">Error: {part.errorText}</div>;
      }
      break;
  }

  return null;
};

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
    stop,
    addToolResult,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
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
        scrollAreaRef.current?.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!isExpanded) {
      setIsExpanded(true);
    }

    sendMessage({ text: input });
    setInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setIsExpanded(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={cn("relative w-full", className)}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Initial state - center of homepage
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl"
                  />
                  <Avatar className="h-16 w-16 border-2 border-white/20 backdrop-blur-sm">
                    <AvatarImage src="/uaraai.jpg" alt="Uara AI" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <Bot className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Meet Uara
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Your AI Longevity Coach
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Get personalized health insights, optimize your biomarkers, and
                extend your healthspan with evidence-based guidance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="w-full max-w-lg"
            >
              <Card className="p-6 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-white/20">
                <form onSubmit={handleChatSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask about your health, biomarkers, or longevity..."
                      className="pr-12 bg-white/70 dark:bg-gray-800/70 border-white/30"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8"
                      disabled={!input.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Analyze my sleep data",
                      "Optimize my recovery",
                      "Plan longevity routine",
                      "Review lab results",
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-white/50 dark:bg-gray-800/50 border-white/30 hover:bg-white/70 dark:hover:bg-gray-800/70"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          // Expanded state - full chat interface
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="flex flex-col h-full max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-4 border-b"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/uaraai.jpg" alt="Uara AI" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold">Uara AI</h2>
                    <p className="text-xs text-muted-foreground">
                      Your Longevity Coach
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  ←
                </Button>
              </motion.div>

              {/* Messages */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-4">
                  <AnimatePresence>
                    {messages.map((message: any, index: number) => (
                      <motion.div
                        key={message.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "flex space-x-3",
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarImage src="/uaraai.jpg" alt="Uara AI" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={cn(
                            "max-w-lg p-3 rounded-lg",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-muted"
                          )}
                        >
                          <div className="whitespace-pre-wrap text-sm">
                            {message.parts.map(
                              (part: any, partIndex: number) => {
                                switch (part.type) {
                                  case "text":
                                    return (
                                      <span key={partIndex}>{part.text}</span>
                                    );

                                  case "step-start":
                                    return partIndex > 0 ? (
                                      <div
                                        key={partIndex}
                                        className="text-gray-500 my-2"
                                      >
                                        <hr className="border-gray-300" />
                                      </div>
                                    ) : null;

                                  // Future health tools - prepared structure
                                  case "tool-analyzeLabResults":
                                  case "tool-getWhoopData":
                                  case "tool-calculateBioAge":
                                  case "tool-askForConfirmation":
                                    return (
                                      <div
                                        key={partIndex}
                                        className="my-2 p-2 bg-blue-50 rounded border"
                                      >
                                        {renderHealthTool(part, addToolResult)}
                                      </div>
                                    );

                                  // Dynamic tools for future extensibility
                                  case "dynamic-tool":
                                    return (
                                      <div
                                        key={partIndex}
                                        className="my-2 p-2 bg-gray-50 rounded border"
                                      >
                                        <h4 className="font-semibold">
                                          Tool: {part.toolName}
                                        </h4>
                                        {part.state === "input-streaming" && (
                                          <pre className="text-xs">
                                            {JSON.stringify(
                                              part.input,
                                              null,
                                              2
                                            )}
                                          </pre>
                                        )}
                                        {part.state === "output-available" && (
                                          <pre className="text-xs">
                                            {JSON.stringify(
                                              part.output,
                                              null,
                                              2
                                            )}
                                          </pre>
                                        )}
                                        {part.state === "output-error" && (
                                          <div className="text-red-600">
                                            Error: {part.errorText}
                                          </div>
                                        )}
                                      </div>
                                    );

                                  default:
                                    return null;
                                }
                              }
                            )}
                          </div>
                          <div className="text-xs opacity-50 mt-1">
                            {formatTime(new Date())}
                          </div>
                        </div>

                        {message.role === "user" && (
                          <Avatar className="h-8 w-8 mt-1">
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex space-x-3"
                    >
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src="/uaraai.jpg" alt="Uara AI" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Sparkles className="h-4 w-4" />
                          </motion.div>
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex space-x-3"
                    >
                      <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg">
                        <div className="text-sm">
                          Sorry, I encountered an error. Please try again.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4 border-t"
              >
                <form onSubmit={handleChatSubmit} className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about your health..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={!input.trim() || isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Cursor rules applied correctly.
