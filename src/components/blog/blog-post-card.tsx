"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock } from "lucide-react";
import { getCategoryInfo } from "@/lib/blog-types";
import Image from "next/image";

interface BlogPostCardProps {
  post: {
    slug: string;
    metadata: {
      title: string;
      summary: string;
      publishedAt: string;
      image?: string;
      category?: string;
      tags?: string[];
      readingTime?: string;
      featured?: boolean;
    };
    source: string;
  };
  featured?: boolean;
}

export function BlogPostCard({ post, featured = false }: BlogPostCardProps) {
  const category = post.metadata.category
    ? getCategoryInfo(post.metadata.category)
    : null;

  const readingTime =
    post.metadata.readingTime ||
    `${Math.ceil(post.source.split(/\s+/).length / 200)} min read`;

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative bg-white rounded-2xl border border-[#085983]/10 hover:border-[#085983]/20 transition-all duration-300 hover:shadow-xl overflow-hidden">
          {/* Featured Image */}
          {post.metadata.image && (
            <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden bg-gradient-to-br from-[#085983]/10 to-[#085983]/5">
              <Image
                src={post.metadata.image}
                alt={post.metadata.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent"></div>

              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-[#085983] text-white border-none font-medium">
                  ✨ Featured
                </Badge>
              </div>

              {/* Category */}
              {category && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 backdrop-blur-sm text-[#085983] border-none font-medium">
                    {category.icon} {category.name}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Meta Info */}
            <div className="flex items-center gap-3 mb-4 text-sm text-[#085983]/60">
              <time
                dateTime={post.metadata.publishedAt}
                className="font-[family-name:var(--font-geist-sans)]"
              >
                {formatDate(post.metadata.publishedAt)}
              </time>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="font-[family-name:var(--font-geist-sans)]">
                  {readingTime}
                </span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-geist-sans text-2xl sm:text-3xl lg:text-4xl font-normal text-[#085983] mb-4 leading-tight group-hover:text-[#085983]/80 transition-colors duration-200">
              {post.metadata.title}
            </h2>

            {/* Summary */}
            <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg text-[#085983]/80 leading-relaxed mb-6 line-clamp-3">
              {post.metadata.summary}
            </p>

            {/* Tags */}
            {post.metadata.tags && post.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.metadata.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#085983]/10 text-[#085983]"
                  >
                    {tag}
                  </span>
                ))}
                {post.metadata.tags.length > 4 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-[#085983]/60">
                    +{post.metadata.tags.length - 4} more
                  </span>
                )}
              </div>
            )}

            {/* Read More */}
            <div className="flex items-center gap-2 text-[#085983] font-medium">
              <span className="font-[family-name:var(--font-geist-sans)] text-sm sm:text-base">
                Read full article
              </span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Subtle hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#085983]/0 via-[#085983]/0 to-[#085983]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="h-full relative bg-white rounded-xl border border-[#085983]/10 hover:border-[#085983]/20 transition-all duration-300 hover:shadow-lg overflow-hidden flex flex-col">
        {/* Image Preview */}
        {post.metadata.image && (
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#085983]/10 to-[#085983]/5">
            <Image
              src={post.metadata.image}
              alt={post.metadata.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {category && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-white/90 backdrop-blur-sm text-[#085983] border-none text-xs font-medium">
                  {category.icon} {category.name}
                </Badge>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Category badge if no image */}
          {!post.metadata.image && category && (
            <div className="mb-3">
              <Badge className="bg-[#085983]/10 text-[#085983] border-none text-xs font-medium">
                {category.icon} {category.name}
              </Badge>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-3 mb-3 text-xs text-[#085983]/60">
            <time
              dateTime={post.metadata.publishedAt}
              className="font-[family-name:var(--font-geist-sans)]"
            >
              {formatDate(post.metadata.publishedAt)}
            </time>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className="font-[family-name:var(--font-geist-sans)]">
                {readingTime}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl font-semibold text-[#085983] mb-3 leading-tight group-hover:text-[#085983]/80 transition-colors duration-200">
            {post.metadata.title}
          </h3>

          {/* Summary */}
          <p className="font-[family-name:var(--font-geist-sans)] text-sm text-[#085983]/70 leading-relaxed mb-4 line-clamp-3 flex-1">
            {post.metadata.summary}
          </p>

          {/* Tags */}
          {post.metadata.tags && post.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.metadata.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#085983]/10 text-[#085983]/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs font-medium text-[#085983]">
              Read more
            </span>
            <ArrowRight className="w-4 h-4 text-[#085983]" />
          </div>
        </div>

        {/* Subtle hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#085983]/0 via-[#085983]/0 to-[#085983]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </article>
    </Link>
  );
}

// Cursor rules applied correctly.
