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
  // Headings
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "text-3xl md:text-4xl font-medium text-foreground tracking-tight mt-12 mb-6 border-b border-zinc-800 pb-4 first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "text-2xl font-medium text-primary tracking-tight mt-10 mb-4 first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "text-xl font-medium text-foreground tracking-tight mt-8 mb-3 first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "text-lg font-medium text-foreground tracking-tight mt-6 mb-2 first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        "text-base font-medium text-foreground tracking-tight mt-4 mb-2 first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        "text-sm font-medium text-foreground tracking-tight mt-4 mb-2 first:mt-0",
        className
      )}
      {...props}
    />
  ),

  // Paragraphs
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "text-base md:text-lg leading-8 mb-6 text-muted-foreground first:mt-0",
        className
      )}
      {...props}
    />
  ),

  // Links
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
            "text-primary font-medium no-underline hover:underline hover:underline-offset-4 transition-all duration-200",
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
          "text-primary font-medium no-underline hover:underline hover:underline-offset-4 transition-all duration-200",
          className
        )}
        {...props}
      />
    );
  },

  // Strong and emphasis
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  ),
  em: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className={cn("text-muted-foreground italic", className)} {...props} />
  ),

  // Lists
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 space-y-2 list-none", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn("my-6 space-y-2 list-decimal list-inside", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li
      className={cn(
        "leading-8 text-muted-foreground relative pl-6 before:content-['◇'] before:absolute before:left-0 before:text-primary before:font-mono before:text-sm",
        className
      )}
      {...props}
    />
  ),

  // Code blocks and inline code
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        "bg-zinc-950 border border-zinc-800 rounded-lg p-4 my-6 overflow-x-auto text-sm shadow-lg",
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
            "bg-zinc-900 text-primary px-2 py-1 rounded text-sm font-mono border border-zinc-800",
            className
          )}
          {...props}
        />
      );
    }

    // Block code (inside pre)
    return <code className={cn("text-sm font-mono", className)} {...props} />;
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

  // Blockquotes
  blockquote: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        "border-l-4 border-primary pl-6 my-6 text-muted-foreground italic bg-muted/30 py-4 rounded-r-lg",
        className
      )}
      {...props}
    />
  ),

  // Tables
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-8 overflow-x-auto">
      <table
        className={cn(
          "w-full border-collapse border border-zinc-800 rounded-lg overflow-hidden",
          className
        )}
        {...props}
      />
    </div>
  ),
  thead: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className={cn("border-b border-zinc-800 bg-muted/50", className)}
      {...props}
    />
  ),
  tbody: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className={cn("", className)} {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn("border-b border-zinc-800 last:border-b-0", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "text-left font-semibold text-foreground px-4 py-3 border-r border-zinc-800 last:border-r-0",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "px-4 py-3 border-r border-zinc-800 last:border-r-0 text-muted-foreground",
        className
      )}
      {...props}
    />
  ),

  // Horizontal rule
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className={cn("my-12 border-zinc-800", className)} {...props} />
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
          className={cn("mr-2 accent-primary cursor-default", className)}
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
        "prose prose-neutral dark:prose-invert max-w-none",
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
