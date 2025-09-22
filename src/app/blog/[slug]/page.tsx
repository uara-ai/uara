import { getBlogPosts, getPost, estimateReadingTime } from "@/lib/blog";
import { DATA } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MarkdownParser } from "@/components/markdown-parser";
import { ArrowLeft, BookOpen, Brain, Sparkles } from "lucide-react";
import { Navbar } from "@/components/landing/hero/navbar";
import { Footer } from "@/components/landing/footer";
import Image from "next/image";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  try {
    const { slug } = await params;
    const post = await getPost(slug);
    const {
      title,
      publishedAt: publishedTime,
      summary: description,
      image,
      tags,
      author,
    } = post.metadata;

    const ogImage = image
      ? `${DATA.url}${image}`
      : `${DATA.url}/og/opengraph-image.png`;
    const readingTime = estimateReadingTime(post.source);

    return {
      title: `${title} | Uara.ai Blog`,
      description,
      keywords: tags || [],
      authors: [{ name: author || "Federico Fan" }],
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime,
        modifiedTime: post.metadata.lastModified || publishedTime,
        url: `${DATA.url}/blog/${post.slug}`,
        siteName: DATA.name,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        authors: [author || "Federico Fan"],
        tags: tags || [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
        creator: "@FedericoFan",
      },
      alternates: {
        canonical: `${DATA.url}/blog/${slug}`,
      },
      other: {
        "article:reading_time": readingTime,
      },
    };
  } catch {
    return undefined;
  }
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
      notFound();
    }

    const readingTime = estimateReadingTime(post.source);
    const relatedPosts = await getBlogPosts();
    const otherPosts = relatedPosts
      .filter((p) => p.slug !== post.slug)
      .slice(0, 3);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.metadata.title,
      description: post.metadata.summary,
      image: post.metadata.image
        ? `${DATA.url}${post.metadata.image}`
        : `${DATA.url}/og/opengraph-image.png`,
      url: `${DATA.url}/blog/${post.slug}`,
      datePublished: post.metadata.publishedAt,
      dateModified: post.metadata.lastModified || post.metadata.publishedAt,
      author: {
        "@type": "Person",
        name: post.metadata.author || "Federico Fan",
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
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${DATA.url}/blog/${slug}`,
      },
      keywords: post.metadata.tags?.join(", ") || "",
      wordCount: post.source.split(/\s+/).length,
    };

    return (
      <>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Navigation */}
        <Navbar scrolled={true} />

        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="relative mx-auto pt-20 sm:pt-24 lg:pt-28 max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
            {/* Breadcrumb Navigation */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center gap-2 text-sm">
                <Link
                  href="/"
                  className="font-[family-name:var(--font-geist-sans)] text-[#085983]/60 hover:text-[#085983] transition-colors duration-200"
                >
                  Home
                </Link>
                <span className="text-[#085983]/40">/</span>
                <Link
                  href="/blog"
                  className="font-[family-name:var(--font-geist-sans)] text-[#085983]/60 hover:text-[#085983] transition-colors duration-200"
                >
                  Blog
                </Link>
                <span className="text-[#085983]/40">/</span>
                <span className="font-[family-name:var(--font-geist-sans)] text-[#085983]">
                  {post.metadata.title}
                </span>
              </div>
            </div>

            {/* Article Header */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              {/* Mobile: Simple title without decorative lines */}
              <div className="block sm:hidden mb-6">
                <h1 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-normal text-[#085983] leading-tight mb-4">
                  {post.metadata.title}
                </h1>
                <p className="font-[family-name:var(--font-geist-sans)] text-base text-[#085983]/80 leading-relaxed px-4">
                  {post.metadata.summary}
                </p>
              </div>

              {/* Desktop: Decorative title with lines */}
              <div className="hidden sm:flex items-center justify-center mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
                <h1 className="px-6 font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-normal text-[#085983] leading-tight text-center max-w-4xl">
                  {post.metadata.title}
                </h1>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
              </div>

              <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0 mb-8">
                {post.metadata.summary}
              </p>

              {/* Meta Information */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-[#085983]/60 mb-6">
                <time
                  dateTime={post.metadata.publishedAt}
                  className="font-[family-name:var(--font-geist-sans)]"
                >
                  {formatDate(post.metadata.publishedAt)}
                </time>
                <span className="hidden sm:inline text-[#085983]/40">•</span>
                <span className="font-[family-name:var(--font-geist-sans)]">
                  {readingTime}
                </span>
                {post.metadata.author && (
                  <>
                    <span className="hidden sm:inline text-[#085983]/40">
                      •
                    </span>
                    <span className="font-[family-name:var(--font-geist-sans)]">
                      {post.metadata.author}
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}
              {post.metadata.tags && post.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                  {post.metadata.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-br from-[#085983]/10 to-[#085983]/20 text-[#085983] border border-[#085983]/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Article Content */}
            <article className="relative overflow-hidden rounded-2xl p-6 sm:p-8 mb-12">
              {/* Subtle background effects */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl" />

              <div className="relative z-10">
                <MarkdownParser
                  content={post.source}
                  className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-primary prose-a:text-primary hover:prose-a:text-primary/80"
                />
              </div>
            </article>

            {/* Related Posts */}
            {otherPosts.length > 0 && (
              <section className="space-y-8 sm:space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl lg:text-4xl font-normal text-[#085983]">
                    Continue reading
                  </h2>
                  <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg text-[#085983]/80 max-w-2xl mx-auto leading-relaxed">
                    More insights from our journey building the future of
                    longevity technology.
                  </p>
                </div>

                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {otherPosts.map((relatedPost, index) => (
                    <RelatedPostCard key={index} post={relatedPost} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </>
    );
  } catch {
    notFound();
  }
}

function RelatedPostCard({ post }: { post: any }) {
  const category =
    post.metadata.category || post.metadata.tags?.[0] || "General";

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative bg-white rounded-xl border border-[#085983]/10 hover:border-[#085983]/20 transition-all duration-300 hover:shadow-lg overflow-hidden">
          {/* Header with category and image placeholder */}
          <div className="h-2 bg-gradient-to-r from-[#085983]/30 via-[#085983]/60 to-[#085983]/30"></div>

          <div className="p-6">
            {/* Category and Date */}
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
              <h3 className="font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl font-normal text-[#085983] group-hover:text-[#085983]/80 transition-colors duration-200 leading-tight">
                {post.metadata.title}
              </h3>

              <p className="font-[family-name:var(--font-geist-sans)] text-sm text-[#085983]/70 leading-relaxed line-clamp-3">
                {post.metadata.summary}
              </p>

              {/* Footer */}
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
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-[#085983]/60 font-medium">
                    Read more
                  </span>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-[#085983]" />
                </div>
              </div>
            </div>
          </div>

          {/* Subtle hover effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#085983]/0 via-[#085983]/0 to-[#085983]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
    </article>
  );
}

// Cursor rules applied correctly.
