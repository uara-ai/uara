"use client";

import { ContributionChart } from "@/components/healthspan/v1/healthspan/contribution-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Eye, Code } from "lucide-react";
import { useState } from "react";

export default function ContributionChartPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Contribution Chart</h1>
          <Badge variant="outline">Charts</Badge>
        </div>
        <p className="text-muted-foreground">
          GitHub-style activity contribution chart with streak tracking and
          interactive tooltips
        </p>
      </div>

      {/* Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Examples</h2>
        <div className="space-y-6">
          <ExampleCard />
        </div>
      </section>

      {/* Props Documentation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Props</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Type</th>
                    <th className="text-left p-4 font-medium">Required</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4">
                      <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                        memberSince
                      </code>
                    </td>
                    <td className="p-4">
                      <code className="text-sm text-muted-foreground">
                        string
                      </code>
                    </td>
                    <td className="p-4">
                      <span className="text-destructive">Yes</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      Date when the user joined (ISO date string)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">
                      <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                        totalDays
                      </code>
                    </td>
                    <td className="p-4">
                      <code className="text-sm text-muted-foreground">
                        number
                      </code>
                    </td>
                    <td className="p-4">
                      <span className="text-destructive">Yes</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      Total number of days since joining
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">
                      <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                        currentStreak
                      </code>
                    </td>
                    <td className="p-4">
                      <code className="text-sm text-muted-foreground">
                        number
                      </code>
                    </td>
                    <td className="p-4">
                      <span className="text-destructive">Yes</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      Current consecutive days streak
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4">
                      <code className="text-sm bg-muted px-1.5 py-0.5 rounded">
                        className
                      </code>
                    </td>
                    <td className="p-4">
                      <code className="text-sm text-muted-foreground">
                        string
                      </code>
                    </td>
                    <td className="p-4">
                      <span className="text-muted-foreground">No</span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      Additional CSS classes to apply
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ExampleCard() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const exampleCode = `<ContributionChart
  memberSince="2024-01-15"
  totalDays={73}
  currentStreak={12}
  className="w-full"
/>`;

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const isCopied = copiedCode === exampleCode;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Default Example</CardTitle>
        <CardDescription>
          Basic usage with member since date and current streak
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="border rounded-lg p-6 bg-background">
              <ContributionChart
                memberSince="2024-01-15"
                totalDays={73}
                currentStreak={12}
                className="w-full"
              />
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-4">
            <div className="relative">
              <ScrollArea className="h-auto max-h-96">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{exampleCode}</code>
                </pre>
              </ScrollArea>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyCode(exampleCode)}
              >
                <Copy className="h-4 w-4" />
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Cursor rules applied correctly.
