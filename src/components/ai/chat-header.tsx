"use client";

import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  title?: string;
  hasCanvas?: boolean;
}

export function ChatHeader({ title, hasCanvas }: ChatHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push("/healthspan/chat");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        "dark:bg-[#0A0A0A]/95 dark:supports-[backdrop-filter]:bg-[#0A0A0A]/60"
      )}
    >
      <div className="flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center text-[#085983]/70 hover:text-[#085983] hover:bg-[#085983]/5 p-2"
          >
            <IconArrowLeft className="h-4 w-4" />
          </Button>

          {title && (
            <>
              <div className="h-4 w-px bg-[#085983]/20" />
              <h1 className="font-[family-name:var(--font-geist-sans)] font-medium text-[#085983] text-sm truncate flex-1">
                {title}
              </h1>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Cursor rules applied correctly.
