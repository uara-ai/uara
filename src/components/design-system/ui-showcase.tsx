"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconPackage, IconChevronRight } from "@tabler/icons-react";
import componentsData from "./components-map.json";

interface Component {
  id: string;
  name: string;
  description: string;
  link: string;
  img: string | null;
}

interface Category {
  id: string;
  name: string;
  description: string;
  components: Component[];
}

export function UIShowcase() {
  const { categories } = componentsData as { categories: Category[] };
  const totalComponents = categories.reduce(
    (total, category) => total + category.components.length,
    0
  );

  return (
    <div className="w-full mx-auto space-y-8 px-6 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6">
        <IconPackage className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
        <div>
          <h1 className="text-2xl font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            UI Components
          </h1>
          <p className="text-[#085983]/60 text-sm mt-1">
            Explore our collection of {totalComponents} reusable components
            organized in {categories.length} categories
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: Category;
}

function CategorySection({ category }: CategorySectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
          {category.name}
        </h2>
        <p className="text-[#085983]/60 text-sm">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {category.components.map((component) => (
          <ComponentCard key={component.id} component={component} />
        ))}
      </div>
    </section>
  );
}

interface ComponentCardProps {
  component: Component;
}

function ComponentCard({ component }: ComponentCardProps) {
  return (
    <Link
      href={component.link}
      className="group bg-gray-50 hover:bg-[#085983]/5 border border-[#085983]/20 hover:border-[#085983]/30 rounded-lg p-4 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1 flex-1">
          <h3 className="font-medium text-[#085983] group-hover:text-[#085983]">
            {component.name}
          </h3>
          <p className="text-sm text-[#085983]/60">{component.description}</p>
        </div>
        <IconChevronRight className="size-4 text-[#085983]/40 group-hover:text-[#085983] group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

// Cursor rules applied correctly.
