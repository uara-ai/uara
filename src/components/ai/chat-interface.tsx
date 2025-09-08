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
import {
  Send,
  Bot,
  User,
  Sparkles,
  Bed,
  Brain,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ChatInterfaceProps {
  className?: string;
}

const suggestions = [
  {
    title: "Analyze my sleep patterns",
    subtitle: "Get insights from your sleep data and wearables",
    icon: <Bed />,
  },
  {
    title: "Optimize my recovery",
    subtitle: "Improve HRV and recovery metrics",
    icon: <Sparkles />,
  },
  {
    title: "Plan longevity routine",
    subtitle: "Create a personalized anti-aging protocol",
    icon: <Brain />,
  },
  {
    title: "Review lab results",
    subtitle: "Understand your biomarkers and health metrics",
    icon: <FlaskConical />,
  },
];

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
    <div className={cn("relative w-full mt-24", className)}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Initial state - center of homepage with ChatGPT-style design
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-[70vh] max-w-3xl mx-auto px-4"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-center mb-12 flex flex-col items-center justify-center"
            >
              <Image src="/logo.svg" alt="Uara AI" width={100} height={100} />
              <h1 className="text-4xl font-medium text-gray-900 dark:text-gray-100 mb-2">
                uara<span className="text-blue-500">.ai</span>
              </h1>
            </motion.div>

            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleChatSubmit} className="relative">
                <div className="relative group">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask anything"
                    className="w-full h-14 pl-4 pr-16 text-base rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all duration-200 resize-none"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Button
                      type="submit"
                      size="sm"
                      className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-30"
                      variant="ghost"
                      disabled={!input.trim() || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>

            {/* Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="w-full max-w-4xl mt-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion.title}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion.title)}
                    className="group p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <div className="flex items-start space-x-3">
                      {suggestion.icon && (
                        <suggestion.icon.type
                          {...suggestion.icon.props}
                          className="size-5 text-muted-foreground"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                          {suggestion.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {suggestion.subtitle}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Expanded state - full chat interface with ChatGPT-style design
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white dark:bg-gray-900"
          >
            <div className="flex flex-col h-full max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/uaraai.jpg" alt="Uara AI" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                      Uara AI
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your Longevity Coach
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
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
                          "flex space-x-4 w-full",
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        )}
                      >
                        {message.role === "assistant" && (
                          <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                            <AvatarImage src="/uaraai.jpg" alt="Uara AI" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={cn(
                            "max-w-3xl p-4 rounded-2xl",
                            message.role === "user"
                              ? "bg-blue-500 text-white ml-auto"
                              : "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                          <div className="text-xs opacity-60 mt-2">
                            {formatTime(new Date())}
                          </div>
                        </div>

                        {message.role === "user" && (
                          <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
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
                      className="flex space-x-4"
                    >
                      <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                        <AvatarImage src="/uaraai.jpg" alt="Uara AI" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl max-w-3xl">
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Sparkles className="h-4 w-4 text-blue-500" />
                          </motion.div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            Thinking...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex space-x-4"
                    >
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-2xl max-w-3xl">
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
                className="p-4 border-t border-gray-200 dark:border-gray-800"
              >
                <form onSubmit={handleChatSubmit} className="max-w-4xl mx-auto">
                  <div className="relative group">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask about your health..."
                      className="w-full h-12 pl-4 pr-14 text-base rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all duration-200"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Button
                        type="submit"
                        size="sm"
                        className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-30"
                        variant="ghost"
                        disabled={!input.trim() || isLoading}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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
