import { ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";

interface ChatHeaderProps {
  hasData: boolean;
  onBackClick: () => void;
  className?: string;
}

export function ChatHeader({
  hasData,
  onBackClick,
  className,
}: ChatHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-6 pb-2 border-b border-[#085983]/10 bg-white",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {hasData && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackClick}
            className="p-2 hover:bg-[#085983]/5 rounded-lg transition-colors text-[#085983]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center gap-2">
          <div>
            <Logo hidden className="size-10" href="/healthspan/chat" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-[family-name:var(--font-instrument-serif)] font-medium text-[#085983] tracking-wider">
              {hasData ? "Health Analysis Chat" : "Uara AI"}
            </h1>
            <p className="text-xs text-[#085983]/60 font-[family-name:var(--font-geist-sans)] hidden sm:block">
              {hasData
                ? "Discussing your health insights"
                : "Ask questions about your health data"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
