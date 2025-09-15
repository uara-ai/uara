"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { X, Terminal, Clock, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface ConsoleOutputContent {
  type: "text" | "image";
  value: string;
}

export interface ConsoleOutput {
  id: string;
  contents: ConsoleOutputContent[];
  status: "in_progress" | "loading_packages" | "completed" | "failed";
}

interface ConsoleProps {
  consoleOutputs: ConsoleOutput[];
  setConsoleOutputs: (outputs: ConsoleOutput[]) => void;
}

export function Console({ consoleOutputs, setConsoleOutputs }: ConsoleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!consoleOutputs || consoleOutputs.length === 0) {
    return null;
  }

  const getStatusIcon = (status: ConsoleOutput["status"]) => {
    switch (status) {
      case "in_progress":
        return <Clock className="h-4 w-4 animate-pulse text-yellow-500" />;
      case "loading_packages":
        return <Clock className="h-4 w-4 animate-spin text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Terminal className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: ConsoleOutput["status"]) => {
    switch (status) {
      case "in_progress":
        return "Running...";
      case "loading_packages":
        return "Loading packages...";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="border-t bg-muted/30">
      <div className="flex items-center justify-between p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Terminal className="h-4 w-4" />
          Console ({consoleOutputs.length})
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConsoleOutputs([])}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {isExpanded && (
        <ScrollArea className="max-h-64 p-2">
          <div className="space-y-2">
            {consoleOutputs.map((output) => (
              <div
                key={output.id}
                className="rounded border bg-background p-2 text-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  {getStatusIcon(output.status)}
                  <span className="font-medium">
                    {getStatusText(output.status)}
                  </span>
                </div>

                <div className="space-y-1">
                  {output.contents.map((content, index) => (
                    <div key={index}>
                      {content.type === "text" ? (
                        <pre
                          className={cn(
                            "whitespace-pre-wrap font-mono text-xs",
                            output.status === "failed" && "text-red-600"
                          )}
                        >
                          {content.value}
                        </pre>
                      ) : content.type === "image" ? (
                        <Image
                          width={100}
                          height={100}
                          src={content.value}
                          alt="Output"
                          className="max-w-full rounded border"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

// Cursor rules applied correctly.
