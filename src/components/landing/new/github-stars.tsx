"use client";

import React, { useState, useEffect } from "react";
import { IconBrandGithub, IconStar } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface GithubStarsProps {
  className?: string;
  showStars?: boolean;
}

export function GithubStars({ className, showStars = true }: GithubStarsProps) {
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
    <div className={cn("flex items-center gap-2 mt-4", className)}>
      {/* GitHub Link */}
      <Link
        href="https://github.com/uara-ai/uara"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-1.5 py-1.5 text-[#085983]/80 hover:text-[#085983] transition-colors"
      >
        {showStars && stars !== null && (
          <>
            <span className="text-xs font-medium"></span>
            <span className="text-xs font-medium flex items-center gap-1">
              Leave a star on
              <IconBrandGithub className="size-3.5" />
              GitHub: ★{stars}
            </span>
          </>
        )}
      </Link>
    </div>
  );
}

// Cursor rules applied correctly.
