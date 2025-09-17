import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ChatLayoutProps {
  children: ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return <TooltipProvider>{children}</TooltipProvider>;
}

// Cursor rules applied correctly.
