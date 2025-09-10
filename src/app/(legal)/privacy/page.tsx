import { getLegalDocument } from "@/lib/legal";
import { markdownToHTML } from "@/lib/blog";
import { DATA } from "@/lib/metadata";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Privacy Policy — Uara.ai",
  description:
    "Learn how Uara.ai collects, uses, and protects your personal information and health data. Read our comprehensive privacy policy.",
  keywords: [
    "privacy policy",
    "data protection",
    "health data privacy",
    "GDPR compliance",
    "HIPAA compliance",
    "data security",
  ],
  openGraph: {
    title: "Privacy Policy — Uara.ai",
    description:
      "Understand how Uara.ai protects your privacy and handles your health data securely.",
    url: `${DATA.url}/privacy`,
    siteName: DATA.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — Uara.ai",
    description:
      "Read our privacy policy to understand how we protect your personal and health information.",
  },
  alternates: {
    canonical: `${DATA.url}/privacy`,
  },
};

export default async function PrivacyPage() {
  try {
    const { source, metadata: docMetadata } = await getLegalDocument(
      "privacy-policy"
    );
    const content = await markdownToHTML(source);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy",
      description: "Uara.ai Privacy Policy",
      url: `${DATA.url}/privacy`,
      publisher: {
        "@type": "Organization",
        name: "Uara.ai",
        url: DATA.url,
      },
      datePublished: docMetadata.publishedAt,
      dateModified: docMetadata.lastModified || docMetadata.publishedAt,
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
          <div className="relative mx-auto pt-20 sm:pt-24 lg:pt-28 max-w-4xl px-4 sm:px-6 pb-16">
            {/* Background Effects */}
            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />

            {/* Header */}
            <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10 mb-12">
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-secondary/25 via-primary/20 to-accent/25 px-3 py-2 text-xs font-medium uppercase tracking-wide text-primary ring-1 ring-ring/35 ring-offset-1 ring-offset-background">
                    legal
                  </span>
                </div>

                <div className="text-center space-y-4">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
                    {docMetadata.title}
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {docMetadata.summary}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated:{" "}
                    {new Date(docMetadata.publishedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/5 via-primary/5 to-accent/5 p-6 sm:p-8 lg:p-10 shadow-sm ring-1 ring-ring/35">
              <article className="prose prose-gray dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-pre:text-foreground prose-blockquote:text-muted-foreground prose-th:text-foreground prose-td:text-muted-foreground">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </article>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    notFound();
  }
}

// Cursor rules applied correctly.
