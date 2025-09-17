"use client";

import { Send, Plus, Mic, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconMessage,
  IconChartBar,
  IconHeart,
  IconMoon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  status: "ready" | "streaming" | "submitted" | "error";
  className?: string;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  status,
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as any);
    }
  };

  const quickActions = [
    {
      icon: <IconHeart className="h-4 w-4" />,
      label: "Analyze Recovery",
      prompt:
        "Analyze my recent recovery trends and give me actionable insights",
    },
    {
      icon: <IconMoon className="h-4 w-4" />,
      label: "Sleep Analysis",
      prompt: "What patterns do you see in my sleep data? Any recommendations?",
    },
    {
      icon: <IconChartBar className="h-4 w-4" />,
      label: "Health Summary",
      prompt: "Give me a comprehensive health summary based on all my data",
    },
    {
      icon: <IconMessage className="h-4 w-4" />,
      label: "Ask Anything",
      prompt: "",
    },
  ];

  return (
    <div
      className={cn(
        "border-t border-[#085983]/10 bg-white p-4 max-w-4xl w-full mx-auto",
        className
      )}
    >
      <form onSubmit={onSubmit} className="space-y-3">
        {/* Input Area */}
        <div
          className={cn(
            "relative rounded-2xl border transition-all duration-200",
            isFocused
              ? "border-[#085983] shadow-sm ring-2 ring-[#085983]/10"
              : "border-[#085983]/20 hover:border-[#085983]/40"
          )}
        >
          {/* Attachment Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute left-3 top-3 p-1.5 hover:bg-[#085983]/10 text-[#085983]/60 hover:text-[#085983] transition-colors"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {quickActions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.prompt && setInput(action.prompt)}
                  className="flex items-center gap-2"
                >
                  {action.icon}
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={status !== "ready"}
            placeholder="Ask about your health data, recovery, sleep, or longevity tips..."
            className="min-h-[56px] max-h-32 pl-12 pr-24 py-4 border-0 resize-none focus-visible:ring-0 font-[family-name:var(--font-geist-sans)] text-sm placeholder:text-[#085983]/50 bg-transparent"
            rows={1}
          />

          {/* Action Buttons */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button
              type="submit"
              disabled={status !== "ready" || !input.trim()}
              size="sm"
              className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
                input.trim() && status === "ready"
                  ? "bg-[#085983] hover:bg-[#085983]/90 text-white shadow-sm"
                  : "bg-[#085983]/10 text-[#085983]/40 cursor-not-allowed"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="flex items-center justify-between text-xs text-[#085983]/50 font-[family-name:var(--font-geist-sans)]">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span
            className={cn(
              "transition-opacity",
              input.length > 500 ? "opacity-100" : "opacity-0"
            )}
          >
            {input.length}/1000
          </span>
        </div>
      </form>
    </div>
  );
}

// Cursor rules applied correctly.
