"use client";

import { Message, MessageContent } from "@/components/ai/elements/message";
import { Loader } from "@/components/ai/elements/loader";
import { cn } from "@/lib/utils";

interface ThinkingMessageProps {
  className?: string;
}

export function ThinkingMessage({ className }: ThinkingMessageProps) {
  return (
    <Message from="assistant" className={cn("", className)}>
      <MessageContent>
        <div className="flex items-center gap-2 text-[#085983]/60">
          <Loader size={16} />
          <span className="text-sm font-medium">Thinking...</span>
        </div>
      </MessageContent>
    </Message>
  );
}

// Cursor rules applied correctly.
