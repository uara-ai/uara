import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { markdownToHTML, type Metadata } from "./blog";

export { markdownToHTML };

export async function getLegalDocument(slug: string) {
  const filePath = path.join("content", "legal", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Legal document not found: ${slug}`);
  }

  const source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: metadata } = matter(source);

  return {
    source: rawContent,
    metadata: metadata as Metadata,
    slug,
  };
}

export async function getAllLegalDocuments() {
  const legalDir = path.join(process.cwd(), "content", "legal");

  if (!fs.existsSync(legalDir)) {
    return [];
  }

  const files = fs
    .readdirSync(legalDir)
    .filter((file) => path.extname(file) === ".mdx");

  return Promise.all(
    files.map(async (file) => {
      const slug = path.basename(file, path.extname(file));
      const { metadata, source } = await getLegalDocument(slug);
      return {
        metadata,
        slug,
        source,
      };
    })
  );
}

// Cursor rules applied correctly.
