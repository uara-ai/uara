"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  status: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function ChatInput({
  input,
  status,
  onInputChange,
  onSubmit,
  inputRef,
}: ChatInputProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="p-4 border-t border-gray-200 dark:border-gray-800"
    >
      <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
        <div className="relative group">
          <Input
            ref={inputRef}
            value={input}
            onChange={onInputChange}
            placeholder="Ask about your health..."
            className="w-full h-12 pl-4 pr-14 text-base rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all duration-200"
            disabled={false}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Button
              type="submit"
              size="sm"
              className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-30"
              variant="ghost"
              disabled={!input.trim() || status === "submitted"}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

// Cursor rules applied correctly.
