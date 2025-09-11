import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden">{children}</div>
    </TooltipProvider>
  );
}

// Cursor rules applied correctly.
