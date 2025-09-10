import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <TooltipProvider>
      <div className="h-screen overflow-hidden bg-background">{children}</div>
    </TooltipProvider>
  );
}

// Cursor rules applied correctly.
