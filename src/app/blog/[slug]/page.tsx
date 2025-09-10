import { getBlogPosts, getPost, estimateReadingTime } from "@/lib/blog";
import { DATA } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MarkdownParser } from "@/components/markdown-parser";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";

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

        {/* Home Button - Top Left */}
        <div className="fixed top-4 left-4 z-50">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-background/80 backdrop-blur-sm border-border/60 hover:bg-background/90 shadow-sm ring-1 ring-ring/35 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/5">
          <div className="relative mx-auto mt-20 sm:mt-24 lg:mt-28 max-w-4xl lg:max-w-5xl px-4 sm:px-6 pb-16">
            {/* Background Effects */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

            {/* Article Header */}
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10 mb-12">
              <div className="relative z-10">
                {/* Article Badge */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-secondary/25 via-primary/20 to-accent/25 px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground ring-1 ring-ring/35 ring-offset-1 ring-offset-background">
                    <BookOpen className="size-3.5" />
                    article
                  </span>
                </div>

                {/* Title and Summary */}
                <div className="text-center space-y-4">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight">
                    {post.metadata.title}
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {post.metadata.summary}
                  </p>
                </div>

                {/* Meta Information Card */}
                <div className="relative overflow-hidden rounded-2xl p-4 sm:p-6 mt-2">
                  {/* Subtle background effects */}
                  <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl" />

                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <time dateTime={post.metadata.publishedAt}>
                          {formatDate(post.metadata.publishedAt)}
                        </time>
                        <span className="text-primary">•</span>
                        <span>{readingTime}</span>
                        {post.metadata.author && (
                          <>
                            <span className="text-primary">•</span>
                            <span>{post.metadata.author}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    {post.metadata.tags && post.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center mt-4 pt-4 border-t border-border/50">
                        {post.metadata.tags.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs px-2 py-1 bg-gradient-to-br from-primary/10 to-secondary/10 text-primary border-primary/20 hover:from-primary/15 hover:to-secondary/15 transition-colors duration-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
              <section className="space-y-8">
                <div className="text-center space-y-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-secondary/25 via-primary/20 to-accent/25 px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground ring-1 ring-ring/35 ring-offset-1 ring-offset-background">
                    <Sparkles className="size-3.5" />
                    more articles
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                    Continue reading
                  </h2>
                </div>

                <div className="grid gap-4 sm:gap-6">
                  {otherPosts.map((relatedPost, index) => (
                    <article key={index} className="group">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/15 via-primary/8 to-accent/10 p-4 sm:p-6 shadow-sm ring-1 ring-ring/35 hover:ring-ring/50 transition-all duration-300 hover:shadow-md">
                          {/* Subtle background effects */}
                          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          <div className="relative z-10">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                  <span className="text-primary text-sm font-mono">
                                    ◇
                                  </span>
                                </div>
                              </div>

                              <div className="flex-1 space-y-3 sm:space-y-4">
                                <div>
                                  <h3 className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
                                    {relatedPost.metadata.title}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                                    {relatedPost.metadata.summary}
                                  </p>
                                </div>

                                {/* Tags */}
                                {relatedPost.metadata.tags &&
                                  relatedPost.metadata.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {relatedPost.metadata.tags
                                        .slice(0, 3)
                                        .map((tag: string) => (
                                          <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="text-xs px-2 py-1 bg-gradient-to-br from-primary/10 to-secondary/10 text-primary border-primary/20 hover:from-primary/15 hover:to-secondary/15 transition-colors duration-200"
                                          >
                                            {tag}
                                          </Badge>
                                        ))}
                                    </div>
                                  )}

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center gap-3">
                                    <time
                                      dateTime={
                                        relatedPost.metadata.publishedAt
                                      }
                                      className="font-mono"
                                    >
                                      {formatDate(
                                        relatedPost.metadata.publishedAt
                                      )}
                                    </time>
                                    {relatedPost.metadata.readingTime && (
                                      <span className="font-mono">
                                        → {relatedPost.metadata.readingTime}
                                      </span>
                                    )}
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <ArrowLeft className="w-4 h-4 rotate-180 text-primary" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </>
    );
  } catch {
    notFound();
  }
}
