"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User as UserIcon, Sparkles, Ellipsis } from "lucide-react";
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
    <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
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
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  <AvatarImage src="/logo.svg" alt="Uara AI" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "p-4 rounded-2xl",
                  message.role === "user"
                    ? "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 ml-auto max-w-lg shadow-sm"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 max-w-3xl"
                )}
              >
                <div
                  className={cn(
                    "text-sm",
                    message.role === "user" ? "" : "whitespace-pre-wrap"
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
                          <div key={partIndex} className="text-gray-500 my-2">
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
                <div className="text-xs opacity-60 mt-2">
                  {formatTime(new Date())}
                </div>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  <AvatarImage
                    src={user?.profilePictureUrl || user?.avatarUrl || ""}
                    alt={user?.name || user?.firstName || "User"}
                  />
                  <AvatarFallback className="bg-primary text-white">
                    {user?.name?.charAt(0) || user?.firstName?.charAt(0) || (
                      <UserIcon className="h-4 w-4" />
                    )}
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
              <AvatarImage src="/logo.svg" alt="Uara AI" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl max-w-3xl">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Ellipsis className="h-4 w-4 text-blue-500" />
                </motion.div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  thinking
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

        {/* Invisible div for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
