import { getBlogPosts } from "@/lib/blog";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DATA } from "@/lib/metadata";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import Image from "next/image";

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

          {/* Blog Header */}
          <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10 mb-12">
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-secondary/25 via-primary/20 to-accent/25 px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground ring-1 ring-ring/35 ring-offset-1 ring-offset-background">
                  <BookOpen className="size-3.5" />
                  blog
                </span>
              </div>

              <div className="text-center space-y-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
                  Building the future of longevity
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  In-depth articles on longevity science, health data analysis,
                  wearables integration, and building consumer health products.
                  Learn from our journey building Uara.ai.
                </p>
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          <div className="space-y-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-secondary/25 via-primary/20 to-accent/25 px-3 py-2 text-xs font-medium uppercase tracking-wide text-foreground ring-1 ring-ring/35 ring-offset-1 ring-offset-background mb-4">
                <Sparkles className="size-3.5" />
                latest posts
              </span>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                Recent articles and tutorials
              </h2>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {posts.map((post, index) => (
                <article key={index} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/15 via-primary/8 to-accent/10 p-4 sm:p-6 shadow-sm ring-1 ring-ring/35 hover:ring-ring/50 transition-all duration-300 hover:shadow-md">
                      {/* Subtle background effects */}
                      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10">
                        {/* Post Image */}
                        {post.metadata.image && (
                          <div className="relative w-full mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10">
                            <Image
                              src={post.metadata.image}
                              alt={post.metadata.title}
                              width={100}
                              height={100}
                              className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          </div>
                        )}

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
                              <h2 className="text-sm sm:text-base font-medium text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
                                {post.metadata.title}
                              </h2>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                                {post.metadata.summary}
                              </p>
                            </div>

                            {/* Tags */}
                            {post.metadata.tags &&
                              post.metadata.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {post.metadata.tags
                                    .slice(0, 3)
                                    .map((tag: string) => (
                                      <BlogTag key={tag} label={tag} />
                                    ))}
                                </div>
                              )}

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-3">
                                <time
                                  dateTime={post.metadata.publishedAt}
                                  className="font-mono"
                                >
                                  {formatDate(post.metadata.publishedAt)}
                                </time>
                                {post.metadata.readingTime && (
                                  <span className="font-mono">
                                    → {post.metadata.readingTime}
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
          </div>
        </div>
      </div>
    </>
  );
}

function BlogTag({ label }: { label: string }) {
  return (
    <Badge
      variant="secondary"
      className="text-xs px-2 py-1 bg-gradient-to-br from-primary/10 to-secondary/10 text-primary border-primary/20 hover:from-primary/15 hover:to-secondary/15 transition-colors duration-200"
    >
      {label}
    </Badge>
  );
}
