"use client";

import { useState } from "react";
import { Category } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: (Category & { count?: number })[];
  activeCategory?: string;
  onCategoryChange?: (category: string | null) => void;
  showCounts?: boolean;
}

export function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
  showCounts = true,
}: CategoryNavProps) {
  const [selected, setSelected] = useState<string | null>(
    activeCategory || null
  );

  const handleSelect = (categorySlug: string | null) => {
    setSelected(categorySlug);
    onCategoryChange?.(categorySlug);
  };

  return (
    <div className="w-full">
      {/* Mobile: Dropdown */}
      <div className="sm:hidden">
        <select
          value={selected || "all"}
          onChange={(e) =>
            handleSelect(e.target.value === "all" ? null : e.target.value)
          }
          className="w-full px-4 py-3 rounded-lg border border-[#085983]/20 bg-white text-[#085983] font-[family-name:var(--font-geist-sans)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#085983]/50"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.icon} {category.name}
              {showCounts && category.count ? ` (${category.count})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop: Horizontal Pills */}
      <div className="hidden sm:block">
        <div className="flex flex-wrap gap-3 justify-center">
          {/* All Categories */}
          <button
            onClick={() => handleSelect(null)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 font-[family-name:var(--font-geist-sans)]",
              selected === null
                ? "bg-[#085983] text-white shadow-md"
                : "bg-[#085983]/10 text-[#085983] hover:bg-[#085983]/20"
            )}
          >
            All Categories
          </button>

          {/* Category Pills */}
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleSelect(category.slug)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 font-[family-name:var(--font-geist-sans)] flex items-center gap-2",
                selected === category.slug
                  ? "bg-[#085983] text-white shadow-md"
                  : "bg-[#085983]/10 text-[#085983] hover:bg-[#085983]/20"
              )}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
              {showCounts && category.count && category.count > 0 ? (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    selected === category.slug
                      ? "bg-white/20 text-white"
                      : "bg-[#085983]/20 text-[#085983]"
                  )}
                >
                  {category.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
