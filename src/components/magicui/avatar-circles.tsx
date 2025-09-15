"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface Avatar {
  imageUrl: string;
}
interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: Avatar[];
}

export const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
}: AvatarCirclesProps) => {
  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarUrls.map((url, index) => (
        <img
          key={index}
          className="h-10 w-10 rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm"
          src={url.imageUrl}
          width={40}
          height={40}
          alt={`Avatar ${index + 1}`}
        />
      ))}
      {(numPeople ?? 0) > 0 && (
        <Link
          href="/"
          className="font-[family-name:var(--font-instrument-serif)] font-semibold flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm text-center text-xs text-white hover:bg-white/30 transition-colors"
        >
          +{numPeople}
        </Link>
      )}
    </div>
  );
};
