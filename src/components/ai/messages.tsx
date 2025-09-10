"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User as UserIcon, Ellipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { User } from "@/lib/user.type";
import { renderHealthTool } from "./health-tools";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

interface MessagesProps {
  messages: any[];
  user?: User | null;
  status: string;
  error: any;
  addToolResult: any;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function Messages({
  messages,
  user,
  status,
  error,
  addToolResult,
  messagesEndRef,
}: MessagesProps) {
  const isLoading = status === "submitted";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-none mx-auto px-4 py-6">
        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((message: any, index: number) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "flex gap-3 max-w-4xl w-full",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
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
                          src={user?.profilePictureUrl || user?.avatarUrl || ""}
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

                  <div
                    className={cn(
                      "group min-w-0",
                      message.role === "user"
                        ? "flex justify-end flex-1"
                        : "flex-1"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 relative",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground inline-block max-w-[80%] w-fit"
                          : "bg-muted/50 text-foreground w-full"
                      )}
                    >
                      <div
                        className={cn(
                          "text-sm leading-relaxed",
                          message.role === "user"
                            ? ""
                            : "prose prose-sm max-w-none dark:prose-invert"
                        )}
                      >
                        {message.parts.map((part: any, partIndex: number) => {
                          switch (part.type) {
                            case "text":
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
                                        className={cn(
                                          inline
                                            ? "bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
                                            : "block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto",
                                          className
                                        )}
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
                                    h1: ({ children }) => (
                                      <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                                        {children}
                                      </h1>
                                    ),
                                    h2: ({ children }) => (
                                      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                                        {children}
                                      </h2>
                                    ),
                                    h3: ({ children }) => (
                                      <h3 className="text-md font-medium mb-2 text-gray-900 dark:text-gray-100">
                                        {children}
                                      </h3>
                                    ),
                                    p: ({ children }) => (
                                      <p className="mb-3 last:mb-0 text-gray-900 dark:text-gray-100">
                                        {children}
                                      </p>
                                    ),
                                    ul: ({ children }) => (
                                      <ul className="list-disc list-inside mb-3 space-y-1 text-gray-900 dark:text-gray-100">
                                        {children}
                                      </ul>
                                    ),
                                    ol: ({ children }) => (
                                      <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-900 dark:text-gray-100">
                                        {children}
                                      </ol>
                                    ),
                                    li: ({ children }) => (
                                      <li className="text-gray-900 dark:text-gray-100">
                                        {children}
                                      </li>
                                    ),
                                    blockquote: ({ children }) => (
                                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300">
                                        {children}
                                      </blockquote>
                                    ),
                                    table: ({ children }) => (
                                      <div className="overflow-x-auto my-4">
                                        <table className="min-w-full border border-gray-300 dark:border-gray-600">
                                          {children}
                                        </table>
                                      </div>
                                    ),
                                    th: ({ children }) => (
                                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left text-gray-900 dark:text-gray-100">
                                        {children}
                                      </th>
                                    ),
                                    td: ({ children }) => (
                                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100">
                                        {children}
                                      </td>
                                    ),
                                    a: ({ children, href }) => (
                                      <a
                                        href={href}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {children}
                                      </a>
                                    ),
                                    strong: ({ children }) => (
                                      <strong className="font-semibold text-gray-900 dark:text-gray-100">
                                        {children}
                                      </strong>
                                    ),
                                    em: ({ children }) => (
                                      <em className="italic text-gray-900 dark:text-gray-100">
                                        {children}
                                      </em>
                                    ),
                                  }}
                                >
                                  {part.text}
                                </ReactMarkdown>
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
                                      {JSON.stringify(part.input, null, 2)}
                                    </pre>
                                  )}
                                  {part.state === "output-available" && (
                                    <pre className="text-xs">
                                      {JSON.stringify(part.output, null, 2)}
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
                        })}
                      </div>

                      <div
                        className={cn(
                          "text-xs mt-2 transition-opacity",
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatTime(new Date())}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex w-full justify-start"
            >
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
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      </motion.div>
                      <span className="text-sm text-muted-foreground">
                        thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex w-full justify-start"
            >
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
            </motion.div>
          )}

          {/* Invisible div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
