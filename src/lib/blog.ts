import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tags?: string[];
  author?: string;
  readingTime?: string;
  draft?: boolean;
  lastModified?: string;
};

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
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
  const filePath = path.join("content", `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: metadata } = matter(source);
  // Return raw markdown content instead of converting to HTML
  return {
    source: rawContent,
    metadata,
    slug,
  };
}

async function getAllPosts(dir: string) {
  const mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      const slug = path.basename(file, path.extname(file));
      const { metadata, source } = await getPost(slug);
      return {
        metadata,
        slug,
        source,
      };
    })
  );
}

export async function getBlogPosts() {
  const posts = await getAllPosts(path.join(process.cwd(), "content"));
  // Filter out draft posts in production
  return posts
    .filter((post) => {
      if (process.env.NODE_ENV === "production") {
        return !post.metadata.draft;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by publication date, newest first
      return (
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
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
  return posts.filter((post) =>
    post.metadata.tags?.some(
      (t: string) => t.toLowerCase() === tag.toLowerCase()
    )
  );
}

export async function getAllTags() {
  const posts = await getBlogPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.metadata.tags?.forEach((tag: string) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
