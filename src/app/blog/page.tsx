import { getBlogPosts } from "@/lib/blog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DATA } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/landing/hero/navbar";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "Blog — Longevity, Healthspan & AI Insights | Uara.ai",
  description:
    "Discover simple, science-backed articles on longevity, biological age, wearables, and AI health insights. Follow our journey building Uara.ai, the consumer longevity coach.",
  keywords: [
    "longevity blog",
    "healthspan optimization",
    "biological age insights",
    "AI health coach",
    "wearables and longevity",
    "health data analysis",
    "consumer health tech",
    "slow aging tips",
    "HRV and recovery",
  ],
  openGraph: {
    title: "Blog — Longevity, Healthspan & AI Insights | Uara.ai",
    description:
      "Learn about longevity, healthspan optimization, and how Uara.ai uses AI and wearables to slow biological aging.",
    url: `${DATA.url}/blog`,
    siteName: DATA.name,
    images: [
      {
        url: `${DATA.url}/og/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: "Uara.ai Blog - Longevity & Healthspan Insights",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Longevity, Healthspan & AI Insights | Uara.ai",
    description:
      "Articles on slowing biological aging, healthspan science, and building Uara.ai, the consumer longevity coach.",
    images: [`${DATA.url}/og/opengraph-image.png`],
    creator: "@FedericoFan",
  },
  alternates: {
    canonical: `${DATA.url}/blog`,
    types: {
      "application/rss+xml": `${DATA.url}/blog/rss.xml`,
    },
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Uara.ai Longevity Blog",
    description:
      "In-depth articles on longevity science, health data analysis, wearables integration, and building consumer health products",
    url: `${DATA.url}/blog`,
    author: {
      "@type": "Person",
      name: "Federico Fan",
      url: DATA.url,
      sameAs: [
        DATA.contact.social.Twitter.url,
        DATA.contact.social.LinkedIn.url,
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "Uara.ai",
      url: DATA.url,
      logo: {
        "@type": "ImageObject",
        url: `${DATA.url}/logo.png`,
      },
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.metadata.title,
      description: post.metadata.summary,
      url: `${DATA.url}/blog/${post.slug}`,
      datePublished: post.metadata.publishedAt,
      author: {
        "@type": "Person",
        name: post.metadata.author || "Federico Fan",
      },
      image: post.metadata.image
        ? `${DATA.url}${post.metadata.image}`
        : `${DATA.url}/og/opengraph-image.png`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation */}
      <Navbar scrolled={true} />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="relative mx-auto pt-20 sm:pt-24 lg:pt-28 max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          {/* Blog Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            {/* Mobile: Simple title without decorative lines */}
            <div className="block sm:hidden mb-6">
              <h1 className="font-[family-name:var(--font-instrument-serif)] text-3xl font-normal text-[#085983] leading-tight mb-4">
                Building the future of longevity
              </h1>
              <p className="font-[family-name:var(--font-geist-sans)] text-base text-[#085983]/80 leading-relaxed px-4">
                In-depth articles on longevity science, health data analysis,
                wearables integration, and building consumer health products.
                Learn from our journey building Uara.ai.
              </p>
            </div>

            {/* Desktop: Decorative title with lines */}
            <div className="hidden sm:flex items-center justify-center mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
              <h1 className="px-6 font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#085983]">
                Building the future of longevity
              </h1>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
            </div>

            <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              In-depth articles on longevity science, health data analysis,
              wearables integration, and building consumer health products.
              Learn from our journey building Uara.ai.
            </p>
          </div>

          {/* Blog Posts */}
          <div className="space-y-12 sm:space-y-16">
            {/* Category Filter */}
            <CategoryFilter posts={posts} />

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <BlogPostCard key={index} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

function BlogPostCard({ post }: { post: any }) {
  const category =
    post.metadata.category || post.metadata.tags?.[0] || "General";

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative bg-white rounded-lg border border-[#085983]/10 hover:border-[#085983]/20 transition-all duration-300 hover:shadow-lg p-6">
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#085983]/10 text-[#085983] uppercase tracking-wide">
              {category}
            </span>
            <time
              dateTime={post.metadata.publishedAt}
              className="text-xs text-[#085983]/50 font-[family-name:var(--font-geist-sans)]"
            >
              {formatDate(post.metadata.publishedAt)}
            </time>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h2 className="font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl font-normal text-[#085983] group-hover:text-[#085983]/80 transition-colors duration-200 leading-tight">
              {post.metadata.title}
            </h2>

            <p className="font-[family-name:var(--font-geist-sans)] text-sm text-[#085983]/70 leading-relaxed line-clamp-2">
              {post.metadata.summary}
            </p>

            {/* Meta Footer */}
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-2">
                {post.metadata.readingTime && (
                  <span className="text-xs text-[#085983]/50 font-[family-name:var(--font-geist-sans)]">
                    {post.metadata.readingTime}
                  </span>
                )}
                {post.metadata.tags && post.metadata.tags.length > 1 && (
                  <span className="text-xs text-[#085983]/40">
                    +{post.metadata.tags.length - 1} tags
                  </span>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowLeft className="w-4 h-4 rotate-180 text-[#085983]" />
              </div>
            </div>
          </div>

          {/* Subtle hover effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#085983]/0 via-[#085983]/0 to-[#085983]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        </div>
      </Link>
    </article>
  );
}

function CategoryFilter({ posts }: { posts: any[] }) {
  const categories = Array.from(
    new Set(
      posts.map(
        (post) => post.metadata.category || post.metadata.tags?.[0] || "General"
      )
    )
  ).sort();

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
      <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#085983] text-white transition-colors duration-200">
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className="px-4 py-2 rounded-full text-sm font-medium bg-[#085983]/10 text-[#085983] hover:bg-[#085983]/20 transition-colors duration-200"
        >
          {category}
        </button>
      ))}
    </div>
  );
}

function BlogTag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-br from-[#085983]/10 to-[#085983]/20 text-[#085983] border border-[#085983]/20 hover:from-[#085983]/15 hover:to-[#085983]/25 transition-colors duration-200">
      {label}
    </span>
  );
}

// Cursor rules applied correctly.
