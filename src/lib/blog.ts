import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import {
  type Metadata,
  type Category,
  CATEGORIES,
  getCategoryInfo,
} from "./blog-types";

// Re-export types and constants for backward compatibility
export type { Metadata, Category };
export { CATEGORIES, getCategoryInfo };

function getMDXFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function getAllMDXFilesRecursive(
  dir: string,
  fileList: string[] = []
): string[] {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== "legal") {
      // Recursively search subdirectories (skip legal folder)
      getAllMDXFilesRecursive(filePath, fileList);
    } else if (path.extname(file) === ".mdx" && file !== "TEMPLATE.mdx") {
      fileList.push(filePath);
    }
  });

  return fileList;
}

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrettyCode, {
      // https://rehype-pretty.pages.dev/#usage
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
      keepBackground: false,
      grid: false,
      defaultLang: "plaintext",
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return p.toString();
}

export async function getPost(slug: string) {
  const contentDir = path.join(process.cwd(), "content");
  const allFiles = getAllMDXFilesRecursive(contentDir);

  const filePath = allFiles.find((file) => {
    const fileName = path.basename(file, path.extname(file));
    return fileName === slug;
  });

  if (!filePath) {
    throw new Error(`Post not found: ${slug}`);
  }

  const source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: metadata } = matter(source);

  // Extract category from file path
  const relativePath = path.relative(contentDir, filePath);
  const pathParts = relativePath.split(path.sep);
  const category = pathParts.length > 1 ? pathParts[0] : undefined;

  return {
    source: rawContent,
    metadata: { ...metadata, category: metadata.category || category },
    slug,
  };
}

async function getAllPosts(dir: string) {
  const allFiles = getAllMDXFilesRecursive(dir);

  return Promise.all(
    allFiles.map(async (filePath) => {
      const slug = path.basename(filePath, path.extname(filePath));
      const source = fs.readFileSync(filePath, "utf-8");
      const { content: rawContent, data: metadata } = matter(source);

      // Extract category from file path
      const relativePath = path.relative(dir, filePath);
      const pathParts = relativePath.split(path.sep);
      const category = pathParts.length > 1 ? pathParts[0] : undefined;

      return {
        metadata: {
          ...metadata,
          category: (metadata as Metadata).category || category,
        } as Metadata,
        slug,
        source: rawContent,
      };
    })
  );
}

export async function getBlogPosts() {
  const posts = await getAllPosts(path.join(process.cwd(), "content"));
  // Filter out draft posts in production
  return posts
    .filter((post) => {
      const metadata = post.metadata as Metadata;
      if (process.env.NODE_ENV === "production") {
        return !metadata.draft;
      }
      return true;
    })
    .sort((a, b) => {
      const metadataA = a.metadata as Metadata;
      const metadataB = b.metadata as Metadata;
      // Sort by publication date, newest first
      return (
        new Date(metadataB.publishedAt).getTime() -
        new Date(metadataA.publishedAt).getTime()
      );
    });
}

export function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export async function getBlogPostsByTag(tag: string) {
  const posts = await getBlogPosts();
  return posts.filter((post) => {
    const metadata = post.metadata as Metadata;
    return metadata.tags?.some(
      (t: string) => t.toLowerCase() === tag.toLowerCase()
    );
  });
}

export async function getBlogPostsByCategory(category: string) {
  const posts = await getBlogPosts();
  return posts.filter((post) => {
    const metadata = post.metadata as Metadata;
    return metadata.category?.toLowerCase() === category.toLowerCase();
  });
}

export async function getFeaturedPosts() {
  const posts = await getBlogPosts();
  return posts.filter((post) => {
    const metadata = post.metadata as Metadata;
    return metadata.featured === true;
  });
}

export async function getAllTags() {
  const posts = await getBlogPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    const metadata = post.metadata as Metadata;
    metadata.tags?.forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export async function getAllCategories() {
  const posts = await getBlogPosts();
  const categoriesWithCounts = new Map<string, number>();

  posts.forEach((post) => {
    const metadata = post.metadata as Metadata;
    const category = metadata.category;
    if (category) {
      categoriesWithCounts.set(
        category,
        (categoriesWithCounts.get(category) || 0) + 1
      );
    }
  });

  return CATEGORIES.map((cat) => ({
    ...cat,
    count: categoriesWithCounts.get(cat.slug) || 0,
  }));
}

// Alias for sitemap compatibility
export const getAllBlogPosts = getBlogPosts;
