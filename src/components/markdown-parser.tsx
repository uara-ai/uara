"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MarkdownParserProps {
  content: string;
  className?: string;
}

// Custom components for different markdown elements
const components = {
  // Headings - clean and simple like WHOOP cards
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "text-2xl font-geist-sans font-medium text-[#085983] mt-6 mb-4 first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "text-xl font-geist-sans font-medium text-[#085983] mt-5 mb-3 first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "text-lg font-[family-name:var(--font-geist-sans)] font-semibold text-[#085983] mt-4 mb-2 first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "text-base font-[family-name:var(--font-geist-sans)] font-semibold text-[#085983] mt-3 mb-2 first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        "text-sm font-[family-name:var(--font-geist-sans)] font-semibold text-[#085983] mt-3 mb-1 first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        "text-sm font-[family-name:var(--font-geist-sans)] font-medium text-[#085983]/80 mt-2 mb-1 first:mt-0",
        className
      )}
      {...props}
    />
  ),

  // Paragraphs - clean and readable
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "text-sm font-[family-name:var(--font-geist-sans)] leading-relaxed mb-3 text-[#085983] first:mt-0",
        className
      )}
      {...props}
    />
  ),

  // Links - subtle and clean
  a: ({
    className,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // Handle internal links
    if (href?.startsWith("/") || href?.startsWith("#")) {
      return (
        <Link
          href={href}
          className={cn(
            "text-[#085983] font-medium underline underline-offset-2 decoration-[#085983]/30 hover:decoration-[#085983] transition-all duration-200",
            className
          )}
          {...props}
        />
      );
    }
    // External links
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "text-[#085983] font-medium underline underline-offset-2 decoration-[#085983]/30 hover:decoration-[#085983] transition-all duration-200",
          className
        )}
        {...props}
      />
    );
  },

  // Strong and emphasis - consistent with brand colors
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong
      className={cn("text-[#085983] font-semibold", className)}
      {...props}
    />
  ),
  em: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className={cn("text-[#085983]/80 italic", className)} {...props} />
  ),

  // Lists - clean and minimal design
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-3 space-y-1.5 list-none", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn("my-3 space-y-1.5 list-decimal list-inside", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className={cn(
        "text-sm font-[family-name:var(--font-geist-sans)] leading-relaxed text-[#085983] relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-[#085983]/60 before:font-bold",
        className
      )}
      {...props}
    />
  ),

  // Code blocks and inline code - clean and readable
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        "bg-[#085983]/5 border border-[#085983]/20 rounded-lg p-3 my-4 overflow-x-auto text-sm font-mono",
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    // Check if this is inline code (not in a pre block)
    const isInline = !className?.includes("language-");

    if (isInline) {
      return (
        <code
          className={cn(
            "bg-[#085983]/10 text-[#085983] px-1.5 py-0.5 rounded text-xs font-mono border border-[#085983]/20",
            className
          )}
          {...props}
        />
      );
    }

    // Block code (inside pre)
    return (
      <code
        className={cn("text-sm font-mono text-[#085983]", className)}
        {...props}
      />
    );
  },

  // Images
  img: ({
    src,
    alt,
    className,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src || typeof src !== "string") return null;

    // Use regular img tag for markdown images
    return (
      <img
        src={src}
        alt={alt || ""}
        className={cn(
          "rounded-lg border border-zinc-800 shadow-lg mx-auto my-8 max-w-full h-auto",
          className
        )}
        {...props}
      />
    );
  },

  // Blockquotes - card-like design
  blockquote: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "border-l-3 border-[#085983] pl-4 my-4 text-[#085983]/80 italic bg-[#085983]/5 py-3 rounded-r-lg text-sm font-[family-name:var(--font-geist-sans)]",
        className
      )}
      {...props}
    />
  ),

  // Tables - clean card-style design
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 overflow-x-auto bg-white rounded-lg border border-[#085983]/20">
      <table className={cn("w-full border-collapse", className)} {...props} />
    </div>
  ),
  thead: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn("bg-[#085983]/5", className)} {...props} />
  ),
  tbody: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={cn("", className)} {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("border-b border-[#085983]/10 last:border-b-0", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "text-left font-semibold text-[#085983] px-3 py-2 text-sm font-[family-name:var(--font-geist-sans)]",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "px-3 py-2 text-sm text-[#085983] font-[family-name:var(--font-geist-sans)]",
        className
      )}
      {...props}
    />
  ),

  // Horizontal rule - subtle divider
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className={cn("my-6 border-[#085983]/20", className)} {...props} />
  ),

  // Custom handling for task lists (GitHub-style checkboxes)
  input: ({
    type,
    checked,
    disabled,
    className,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement>) => {
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className={cn("mr-2 accent-[#085983] cursor-default", className)}
          {...props}
        />
      );
    }
    return <input type={type} className={className} {...props} />;
  },
};

export function MarkdownParser({ content, className }: MarkdownParserProps) {
  return (
    <div
      className={cn(
        "max-w-none font-[family-name:var(--font-geist-sans)]",
        className
      )}
    >
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Cursor rules applied correctly.
