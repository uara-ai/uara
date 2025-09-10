"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface ChatHeaderProps {
  messages: any[];
  onClose: () => void;
}

export function ChatHeader({ messages, onClose }: ChatHeaderProps) {
  const getChatTitle = () => {
    if (messages.length > 0 && messages[0]?.parts) {
      const textPart = messages[0].parts.find(
        (part: any) => part.type === "text"
      ) as any;
      if (textPart && textPart.text) {
        return (
          textPart.text.slice(0, 50) + (textPart.text.length > 50 ? "..." : "")
        );
      }
    }
    return "New Chat";
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-800 "
    >
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/logo.svg" alt="Uara AI" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium text-gray-900 dark:text-gray-100 text-sm capitalize">
            {getChatTitle()}
          </h2>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xs"
      >
        ×
      </Button>
    </motion.div>
  );
}

// Cursor rules applied correctly.
