"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  isAnimating?: boolean;
  className?: string;
}

export function AnimatedCounter({
  value,
  isAnimating = false,
  className,
}: AnimatedCounterProps) {
  return (
    <span
      className={cn(
        "inline-block transition-all duration-500 ease-out",
        isAnimating && "animate-pulse scale-125 font-bold",
        className
      )}
      key={value} // Force re-render when value changes for fresh animation
      style={{
        textShadow: isAnimating ? "0 0 8px currentColor" : "none",
        transform: isAnimating ? "scale(1.25)" : "scale(1)",
      }}
    >
      {value}
    </span>
  );
}

// Cursor rules applied correctly.
