import {
  getBlogPosts,
  getPost,
  estimateReadingTime,
  getCategoryInfo,
  getBlogPostsByCategory,
} from "@/lib/blog";
import { DATA } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MarkdownParser } from "@/components/markdown-parser";
import { ArrowLeft, Clock, Tag, Share2 } from "lucide-react";
import { HeroHeader } from "@/components/landing/new/header";
import { Footer } from "@/components/landing/new/footer";
import { BlogPostCard } from "@/components/blog";
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
    const metadata = post.metadata as any;
    const {
      title,
      publishedAt: publishedTime,
      summary: description,
      image,
      tags,
      author,
    } = metadata;

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
        modifiedTime: metadata.lastModified || publishedTime,
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
    const metadata = post.metadata as any;
    const category = metadata.category
      ? getCategoryInfo(metadata.category)
      : null;

    // Get related posts from the same category
    let relatedPosts: Awaited<ReturnType<typeof getBlogPosts>> = [];
    if (metadata.category) {
      const categoryPosts = await getBlogPostsByCategory(metadata.category);
      relatedPosts = categoryPosts
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3);
    }

    // If not enough related posts, fill with other posts
    if (relatedPosts.length < 3) {
      const allPosts = await getBlogPosts();
      const otherPosts = allPosts
        .filter(
          (p) =>
            p.slug !== post.slug &&
            !relatedPosts.some((rp) => rp.slug === p.slug)
        )
        .slice(0, 3 - relatedPosts.length);
      relatedPosts = [...relatedPosts, ...otherPosts];
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: metadata.title,
      description: metadata.summary,
      image: metadata.image
        ? `${DATA.url}${metadata.image}`
        : `${DATA.url}/og/opengraph-image.png`,
      url: `${DATA.url}/blog/${post.slug}`,
      datePublished: metadata.publishedAt,
      dateModified: metadata.lastModified || metadata.publishedAt,
      author: {
        "@type": "Person",
        name: metadata.author || "Federico Fan",
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
      keywords: metadata.tags?.join(", ") || "",
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
        <HeroHeader />

        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="relative mx-auto pt-20 sm:pt-24 lg:pt-28 max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
            {/* Breadcrumb Navigation */}
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center gap-2 text-sm flex-wrap">
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
                {category && (
                  <>
                    <span className="text-[#085983]/40">/</span>
                    <Link
                      href="/blog"
                      className="font-[family-name:var(--font-geist-sans)] text-[#085983]/60 hover:text-[#085983] transition-colors duration-200 flex items-center gap-1"
                    >
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </Link>
                  </>
                )}
                <span className="text-[#085983]/40">/</span>
                <span className="font-[family-name:var(--font-geist-sans)] text-[#085983] line-clamp-1">
                  {metadata.title}
                </span>
              </div>
            </div>

            {/* Back Button */}
            <div className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#085983] hover:text-[#085983]/80 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-[family-name:var(--font-geist-sans)]">
                  Back to all articles
                </span>
              </Link>
            </div>

            {/* Article Header */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              {/* Category Badge */}
              {category && (
                <div className="flex justify-center mb-6">
                  <Link href="/blog">
                    <Badge className="bg-[#085983]/10 text-[#085983] border-[#085983]/20 hover:bg-[#085983]/20 transition-colors duration-200 text-sm font-medium px-4 py-1.5">
                      {category.icon} {category.name}
                    </Badge>
                  </Link>
                </div>
              )}

              {/* Mobile: Simple title without decorative lines */}
              <div className="block sm:hidden mb-6">
                <h1 className="font-geist-sans text-2xl sm:text-3xl font-normal text-[#085983] leading-tight mb-4">
                  {metadata.title}
                </h1>
                <p className="font-[family-name:var(--font-geist-sans)] text-base text-[#085983]/80 leading-relaxed px-4">
                  {metadata.summary}
                </p>
              </div>

              {/* Desktop: Decorative title with lines */}
              <div className="hidden sm:flex items-center justify-center mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
                <h1 className="px-6 font-geist-sans text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-normal text-[#085983] leading-tight text-center max-w-4xl">
                  {metadata.title}
                </h1>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
              </div>

              <p className="hidden sm:block font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0 mb-8">
                {metadata.summary}
              </p>

              {/* Meta Information */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-[#085983]/60 mb-6">
                <div className="flex items-center gap-2">
                  <time
                    dateTime={metadata.publishedAt}
                    className="font-[family-name:var(--font-geist-sans)]"
                  >
                    {formatDate(metadata.publishedAt)}
                  </time>
                </div>
                <span className="hidden sm:inline text-[#085983]/40">•</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-[family-name:var(--font-geist-sans)]">
                    {readingTime}
                  </span>
                </div>
                {metadata.author && (
                  <>
                    <span className="hidden sm:inline text-[#085983]/40">
                      •
                    </span>
                    <span className="font-[family-name:var(--font-geist-sans)]">
                      {metadata.author}
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}
              {metadata.tags && metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center">
                  <Tag className="w-4 h-4 text-[#085983]/60" />
                  {metadata.tags.map((tag: string) => (
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
            {relatedPosts.length > 0 && (
              <section className="space-y-8 sm:space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="font-geist-sans text-2xl sm:text-3xl lg:text-4xl font-normal text-[#085983]">
                    {category ? `More in ${category.name}` : "Continue reading"}
                  </h2>
                  <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg text-[#085983]/80 max-w-2xl mx-auto leading-relaxed">
                    {category
                      ? `Explore more articles about ${category.description.toLowerCase()}`
                      : "More insights from our journey building the future of longevity technology."}
                  </p>
                </div>

                <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((relatedPost, index) => (
                    <BlogPostCard key={index} post={relatedPost} />
                  ))}
                </div>

                {/* View All in Category */}
                {category && (
                  <div className="text-center">
                    <Link
                      href="/blog"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#085983]/10 text-[#085983] font-[family-name:var(--font-geist-sans)] font-medium hover:bg-[#085983]/20 transition-colors duration-200"
                    >
                      View all {category.name} articles
                    </Link>
                  </div>
                )}
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

// Cursor rules applied correctly.
