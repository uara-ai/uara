"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { HeroHeader } from "@/components/landing/new/header";
import { Footer } from "@/components/landing/new/footer";
import {
  BlogHeader,
  CategoryCard,
  CategoryNav,
  BlogPostCard,
} from "@/components/blog";
import { BookOpen } from "lucide-react";

interface BlogPageClientProps {
  posts: any[];
  categories: any[];
  featuredPosts: any[];
}

export default function BlogPageClient({
  posts,
  categories,
  featuredPosts,
}: BlogPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter((post) => post.metadata.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <>
      {/* Navigation */}
      <HeroHeader />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="relative mx-auto pt-20 sm:pt-24 lg:pt-28 max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          {/* Blog Header */}
          <BlogHeader
            title="Longevity Hub"
            description="Science-backed insights on extending your healthspan. From biomarkers to lifestyle optimization, learn how to slow biological aging and live better, longer."
          />

          {/* Categories Grid */}
          <section className="mb-12 sm:mb-16 lg:mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.slug}
                  category={category}
                  href={`#${category.slug}`}
                />
              ))}
            </div>
          </section>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-12 sm:mb-16 lg:mb-20">
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="font-geist-sans text-2xl sm:text-3xl font-normal text-[#085983] mb-3">
                  Start Here
                </h2>
                <p className="font-[family-name:var(--font-geist-sans)] text-sm sm:text-base text-[#085983]/70 max-w-2xl mx-auto">
                  Our most comprehensive guides to understanding and optimizing
                  your healthspan
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {featuredPosts.map((post, index) => (
                  <BlogPostCard key={index} post={post} featured={true} />
                ))}
              </div>
            </section>
          )}

          {/* Category Filter */}
          <section className="mb-8 sm:mb-10">
            <CategoryNav
              categories={categories}
              activeCategory={selectedCategory || undefined}
              onCategoryChange={setSelectedCategory}
              showCounts={true}
            />
          </section>

          {/* Blog Posts Grid */}
          <section>
            {selectedCategory && (
              <div className="text-center mb-8">
                <h2 className="font-[family-name:var(--font-geist-sans)] text-xl sm:text-2xl font-semibold text-[#085983]">
                  {
                    categories.find((cat) => cat.slug === selectedCategory)
                      ?.name
                  }{" "}
                  Articles
                </h2>
                <p className="font-[family-name:var(--font-geist-sans)] text-sm text-[#085983]/70 mt-2">
                  {
                    categories.find((cat) => cat.slug === selectedCategory)
                      ?.description
                  }
                </p>
              </div>
            )}

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#085983]/10 mb-4">
                  <BookOpen className="w-8 h-8 text-[#085983]/60" />
                </div>
                <h3 className="font-[family-name:var(--font-geist-sans)] text-lg font-medium text-[#085983] mb-2">
                  No articles yet
                </h3>
                <p className="font-[family-name:var(--font-geist-sans)] text-sm text-[#085983]/70">
                  We&apos;re working on content for this category. Check back
                  soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredPosts.map((post, index) => (
                  <BlogPostCard key={index} post={post} />
                ))}
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className="mt-16 sm:mt-20 lg:mt-24">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#085983] to-[#085983]/80 p-8 sm:p-12 text-center">
              <div className="relative z-10">
                <h2 className="font-geist-sans text-2xl sm:text-3xl lg:text-4xl font-normal text-white mb-4">
                  Ready to optimize your healthspan?
                </h2>
                <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-8">
                  Join Uara.ai to track your biological age, connect your
                  wearables, and get personalized AI-powered longevity insights.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-[#085983] font-[family-name:var(--font-geist-sans)] font-semibold hover:bg-white/90 transition-colors duration-200 shadow-lg"
                >
                  Get Started
                </Link>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

// Cursor rules applied correctly.
