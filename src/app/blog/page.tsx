import { getBlogPosts, getAllCategories, getFeaturedPosts } from "@/lib/blog";
import { DATA } from "@/lib/metadata";
import BlogPageClient from "@/app/blog/blog-client";

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
  const categories = await getAllCategories();
  const featuredPosts = await getFeaturedPosts();

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

      <BlogPageClient
        posts={posts}
        categories={categories}
        featuredPosts={featuredPosts}
      />
    </>
  );
}

// Cursor rules applied correctly.
