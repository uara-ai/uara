"use client";

import Link from "next/link";
import { Category } from "@/lib/blog-types";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: Category & { count?: number };
  href?: string;
}

export function CategoryCard({ category, href }: CategoryCardProps) {
  // Only show category if it has articles
  if (category.count !== undefined && category.count === 0) {
    return null;
  }

  const content = (
    <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-[#085983]/10 hover:border-[#085983]/30 transition-all duration-300 hover:shadow-lg cursor-pointer h-full">
      <CardContent className="h-full flex flex-col">
        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Icon - minimal and small */}
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#085983]/5 flex items-center justify-center text-lg sm:text-xl border border-[#085983]/20">
                {category.icon}
              </div>
              <h3 className="font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl font-semibold text-[#085983] group-hover:text-[#085983]/80 transition-colors duration-200">
                {category.name}
              </h3>
            </div>
            {category.count !== undefined && category.count > 0 && (
              <span className="flex-shrink-0 text-xs font-medium text-[#085983]/60 bg-[#085983]/10 px-2 py-1 rounded-full">
                {category.count}
              </span>
            )}
          </div>

          <p className="font-[family-name:var(--font-geist-sans)] text-sm text-[#085983]/70 leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Arrow indicator */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-medium text-[#085983]">
            Read articles
          </span>
          <ArrowRight className="w-4 h-4 text-[#085983]" />
        </div>

        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#085983]/0 via-[#085983]/0 to-[#085983]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

// Cursor rules applied correctly.
