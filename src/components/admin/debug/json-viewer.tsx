"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JsonViewerProps {
  data: any;
  maxHeight?: string;
}

export function JsonViewer({ data, maxHeight = "400px" }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="border rounded-lg bg-gray-50">
      <div className="flex items-center justify-between p-2 border-b bg-gray-100">
        <span className="text-sm font-medium text-gray-700">JSON Response</span>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className="h-8"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="overflow-auto p-3" style={{ maxHeight }}>
        <JsonNode data={data} />
      </div>
    </div>
  );
}

interface JsonNodeProps {
  data: any;
  keyName?: string;
  level?: number;
}

function JsonNode({ data, keyName, level = 0 }: JsonNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels

  const indent = level * 16;

  if (data === null) {
    return (
      <div style={{ marginLeft: indent }} className="text-gray-500 italic">
        {keyName && (
          <span className="text-blue-600">&quot;{keyName}&quot;: </span>
        )}
        null
      </div>
    );
  }

  if (typeof data === "string") {
    return (
      <div style={{ marginLeft: indent }} className="text-green-600">
        {keyName && (
          <span className="text-blue-600">&quot;{keyName}&quot;: </span>
        )}
        &quot;{data}&quot;
      </div>
    );
  }

  if (typeof data === "number" || typeof data === "boolean") {
    return (
      <div style={{ marginLeft: indent }} className="text-orange-600">
        {keyName && (
          <span className="text-blue-600">&quot;{keyName}&quot;: </span>
        )}
        {String(data)}
      </div>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <div style={{ marginLeft: indent }}>
          {keyName && (
            <span className="text-blue-600">&quot;{keyName}&quot;: </span>
          )}
          <span className="text-gray-500">[]</span>
        </div>
      );
    }

    return (
      <div style={{ marginLeft: indent }}>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 mr-1 text-gray-400" />
          ) : (
            <ChevronRight className="h-3 w-3 mr-1 text-gray-400" />
          )}
          {keyName && (
            <span className="text-blue-600">&quot;{keyName}&quot;: </span>
          )}
          <span className="text-gray-500">[{data.length}]</span>
        </div>
        {isExpanded && (
          <div>
            {data.map((item, index) => (
              <JsonNode
                key={index}
                data={item}
                keyName={String(index)}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof data === "object") {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return (
        <div style={{ marginLeft: indent }}>
          {keyName && (
            <span className="text-blue-600">&quot;{keyName}&quot;: </span>
          )}
          <span className="text-gray-500">&quot;{}&quot;</span>
        </div>
      );
    }

    return (
      <div style={{ marginLeft: indent }}>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 mr-1 text-gray-400" />
          ) : (
            <ChevronRight className="h-3 w-3 mr-1 text-gray-400" />
          )}
          {keyName && (
            <span className="text-blue-600">&quot;{keyName}&quot;: </span>
          )}
          <span className="text-gray-500">&quot;{keys.length}&quot;</span>
        </div>
        {isExpanded && (
          <div>
            {keys.map((key) => (
              <JsonNode
                key={key}
                data={data[key]}
                keyName={key}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginLeft: indent }} className="text-gray-600">
      {keyName && (
        <span className="text-blue-600">&quot;{keyName}&quot;: </span>
      )}
      {String(data)}
    </div>
  );
}

// Cursor rules applied correctly.
