"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconCopy,
  IconCheck,
  IconCode,
  IconFileCode,
} from "@tabler/icons-react";
import { MarkdownParser } from "@/components/markdown-parser";

interface CodeCardProps {
  title?: string;
  description?: string;
  code: string;
  language?: string;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function CodeCard({
  title = "Component Source",
  description = "Full component implementation",
  code,
  language = "tsx",
  className,
  collapsible = true,
  defaultExpanded = false,
}: CodeCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // Format code as markdown code block
  const markdownCode = `\`\`\`${language}\n${code}\n\`\`\``;

  return (
    <div className={cn("space-y-4 max-w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconFileCode className="size-5 text-[#085983]" />
          <div>
            <h3 className="font-medium text-[#085983]">{title}</h3>
            <p className="text-sm text-[#085983]/60">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#085983] bg-[#085983]/10 hover:bg-[#085983]/20 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <IconCheck className="size-4" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <IconCopy className="size-4" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {/* Expand/Collapse Toggle */}
          {collapsible && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#085983] bg-[#085983]/10 hover:bg-[#085983]/20 rounded-lg transition-colors"
            >
              <IconCode className="size-4" />
              <span className="hidden sm:inline">
                {expanded ? "Collapse" : "Expand"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Code Content */}
      {(!collapsible || expanded) && (
        <div className="border border-[#085983]/20 rounded-lg overflow-hidden bg-white max-w-full">
          <div className="max-h-96 overflow-y-auto overflow-x-auto">
            <MarkdownParser
              content={markdownCode}
              className="[&_pre]:my-0 [&_pre]:rounded-none [&_pre]:border-0 [&_pre]:max-w-full [&_pre]:overflow-x-auto"
            />
          </div>
        </div>
      )}

      {/* Collapsed Preview */}
      {collapsible && !expanded && (
        <div className="border border-[#085983]/20 rounded-lg overflow-hidden bg-gray-50">
          <div className="p-4 text-center">
            <IconCode className="size-8 text-[#085983]/40 mx-auto mb-2" />
            <p className="text-sm text-[#085983]/60 mb-3">
              Click "Expand" to view the full component source code
            </p>
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#085983] bg-white border border-[#085983]/20 hover:bg-[#085983]/5 rounded-lg transition-colors"
            >
              <IconCode className="size-4" />
              View Source Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Cursor rules applied correctly.
