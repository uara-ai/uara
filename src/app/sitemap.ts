import { MetadataRoute } from "next";
import { DATA } from "@/lib/metadata";
import { getAllBlogPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get current date for lastModified
  const now = new Date().toISOString();

  // Base URL from metadata
  const baseUrl = DATA.url;

  // Static routes with their priorities and update frequencies
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/founders`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/waitlist`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Authentication-protected routes (lower priority for SEO as they require login)
  const protectedRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/healthspan`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/healthspan/chat`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/healthspan/whoop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // Dynamic blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const blogPosts = await getAllBlogPosts();
    blogRoutes = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.metadata.publishedAt || now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.warn("Could not load blog posts for sitemap:", error);
    // Fallback to known blog posts from content directory
    const knownBlogPosts = [
      "best-longevity-supplements-2025",
      "how-to-measure-your-biological-age",
    ];

    blogRoutes = knownBlogPosts.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  }

  // Combine all routes
  return [...staticRoutes, ...protectedRoutes, ...blogRoutes];
}

// Cursor rules applied correctly.
