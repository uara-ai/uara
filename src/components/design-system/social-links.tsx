"use client";

import React, { useState, useEffect } from "react";
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandX,
  IconStar,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SocialLinksProps {
  className?: string;
  showStars?: boolean;
}

export function SocialLinks({ className, showStars = true }: SocialLinksProps) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    if (!showStars) return;

    const fetchStars = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/uara-ai/uara"
        );
        const data = await response.json();
        setStars(data.stargazers_count || 0);
      } catch (error) {
        setStars(0);
      }
    };

    fetchStars();
  }, [showStars]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* GitHub Link */}
      <Link
        href="https://github.com/uara-ai/uara"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-1.5 px-2 py-1.5 text-[#085983]/60 hover:text-[#085983] transition-colors"
      >
        <IconBrandGithub className="size-4" />
        {showStars && stars !== null && (
          <>
            <IconStar className="size-3 fill-current" />
            <span className="text-xs font-medium">{stars}</span>
          </>
        )}
      </Link>

      {/* Twitter/X Link */}
      <Link
        href="https://x.com/uaradotai"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center px-2 py-1.5 text-[#085983]/60 hover:text-[#085983] transition-colors"
      >
        <IconBrandX className="size-4" />
      </Link>

      {/* Discord Link */}
      <Link
        href="https://discord.gg/f7fSp6vQcK"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center px-2 py-1.5 text-[#085983]/60 hover:text-[#085983] transition-colors"
      >
        <IconBrandDiscord className="size-4" />
      </Link>
    </div>
  );
}

// Cursor rules applied correctly.
