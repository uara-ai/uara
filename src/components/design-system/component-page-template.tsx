"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconEye,
  IconCode,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import { CodeCard } from "./code-card";

interface ComponentExample {
  name: string;
  description?: string;
  code: string;
  component: React.ReactNode;
}

interface PropDoc {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description?: string;
}

interface ComponentPageTemplateProps {
  title: string;
  description: string;
  category: string;
  examples: ComponentExample[];
  props?: PropDoc[];
  sourceCode?: string;
  className?: string;
}

export function ComponentPageTemplate({
  title,
  description,
  category,
  examples,
  props = [],
  sourceCode,
  className,
}: ComponentPageTemplateProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 font-[family-name:var(--font-geist-sans)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pb-4 sm:pb-6">
        <Link
          href="/ui"
          className="flex items-center justify-center gap-2 px-3 py-3 text-sm font-medium text-[#085983] bg-[#085983]/10 hover:bg-[#085983]/20 rounded-lg transition-colors w-fit"
        >
          <IconArrowLeft className="size-4" />
          <span className="sm:hidden">Back</span>
        </Link>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
              {title}
            </h1>
            <div className="text-xs font-medium text-[#085983]/80 border px-2 py-1 rounded-full border-[#085983]/20 w-fit">
              {category}
            </div>
          </div>
          <p className="text-[#085983]/60 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        {examples.map((example, index) => (
          <ExampleSection key={index} example={example} />
        ))}
      </div>

      {/* Source Code */}
      {sourceCode && (
        <CodeCard
          title="Component Source"
          description="Full implementation of the component"
          code={sourceCode}
          language="tsx"
          collapsible={true}
          defaultExpanded={false}
        />
      )}

      {/* Props Documentation */}
      {props.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#085983] font-[family-name:var(--font-geist-sans)] tracking-wider">
            Props
          </h2>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            {/* Mobile: Card layout */}
            <div className="block md:hidden space-y-3 p-4">
              {props.map((prop, index) => (
                <div
                  key={prop.name}
                  className="bg-white rounded-lg p-4 border border-[#085983]/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm bg-[#085983]/10 text-[#085983] px-2 py-1 rounded font-mono">
                      {prop.name}
                    </code>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        prop.required
                          ? "bg-red-100 text-red-600 font-medium"
                          : "bg-gray-100 text-[#085983]/60"
                      )}
                    >
                      {prop.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-[#085983]/60 uppercase tracking-wide">
                        Type
                      </span>
                      <div>
                        <code className="text-sm text-[#085983]/80 font-mono">
                          {prop.type}
                        </code>
                      </div>
                    </div>
                    {prop.description && (
                      <div>
                        <span className="text-xs text-[#085983]/60 uppercase tracking-wide">
                          Description
                        </span>
                        <p className="text-sm text-[#085983]/80 leading-relaxed">
                          {prop.description}
                        </p>
                      </div>
                    )}
                    {prop.defaultValue && (
                      <div>
                        <span className="text-xs text-[#085983]/60 uppercase tracking-wide">
                          Default
                        </span>
                        <div>
                          <code className="text-xs bg-[#085983]/5 text-[#085983]/80 px-2 py-1 rounded font-mono">
                            {prop.defaultValue}
                          </code>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#085983]/20">
                    <th className="text-left p-4 font-medium text-[#085983] text-sm">
                      Name
                    </th>
                    <th className="text-left p-4 font-medium text-[#085983] text-sm">
                      Type
                    </th>
                    <th className="text-left p-4 font-medium text-[#085983] text-sm">
                      Required
                    </th>
                    <th className="text-left p-4 font-medium text-[#085983] text-sm">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {props.map((prop, index) => (
                    <tr
                      key={prop.name}
                      className={
                        index !== props.length - 1
                          ? "border-b border-[#085983]/10"
                          : ""
                      }
                    >
                      <td className="p-4">
                        <code className="text-sm bg-[#085983]/10 text-[#085983] px-2 py-1 rounded font-mono">
                          {prop.name}
                        </code>
                      </td>
                      <td className="p-4">
                        <code className="text-sm text-[#085983]/60 font-mono">
                          {prop.type}
                        </code>
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "text-sm",
                            prop.required
                              ? "text-red-600 font-medium"
                              : "text-[#085983]/60"
                          )}
                        >
                          {prop.required ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#085983]/60">
                        {prop.description || "—"}
                        {prop.defaultValue && (
                          <div className="mt-1">
                            <span className="text-xs text-[#085983]/40">
                              Default:{" "}
                            </span>
                            <code className="text-xs bg-[#085983]/5 text-[#085983]/60 px-1 rounded">
                              {prop.defaultValue}
                            </code>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ExampleSectionProps {
  example: ComponentExample;
}

function ExampleSection({ example }: ExampleSectionProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-[#085983] mb-1">{example.name}</h3>
        {example.description && (
          <p className="text-sm text-[#085983]/60 leading-relaxed">
            {example.description}
          </p>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit overflow-hidden">
        <button
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors flex-1 sm:flex-initial",
            activeTab === "preview"
              ? "bg-white text-[#085983] shadow-sm"
              : "text-[#085983]/60 hover:text-[#085983]"
          )}
        >
          <IconEye className="size-4" />
          <span className="hidden xs:inline">Preview</span>
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={cn(
            "flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors flex-1 sm:flex-initial",
            activeTab === "code"
              ? "bg-white text-[#085983] shadow-sm"
              : "text-[#085983]/60 hover:text-[#085983]"
          )}
        >
          <IconCode className="size-4" />
          <span className="hidden xs:inline">Code</span>
        </button>
      </div>

      {/* Content */}
      <div className="border border-[#085983]/20 rounded-lg overflow-hidden">
        {activeTab === "preview" ? (
          <div className="p-4 sm:p-6 bg-white overflow-x-auto">
            {example.component}
          </div>
        ) : (
          <div className="relative">
            <pre className="bg-gray-50 p-3 sm:p-4 text-xs sm:text-sm overflow-x-auto text-[#085983] font-mono leading-relaxed">
              <code>{example.code}</code>
            </pre>
            <button
              onClick={copyCode}
              className="absolute top-2 sm:top-3 right-2 sm:right-3 flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#085983] bg-white border border-[#085983]/20 hover:bg-[#085983]/5 rounded transition-colors"
            >
              {copied ? (
                <>
                  <IconCheck className="size-3" />
                  <span className="hidden xs:inline">Copied!</span>
                </>
              ) : (
                <>
                  <IconCopy className="size-3" />
                  <span className="hidden xs:inline">Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
