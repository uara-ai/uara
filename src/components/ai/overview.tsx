"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconActivity,
  IconBrain,
  IconChartLine,
  IconDna,
  IconHeartbeat,
  IconMoon,
  IconApple,
  IconDroplet,
  IconTarget,
  IconFlask,
  IconDots,
  IconSettings,
  IconShare,
  IconPin,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface OverviewProps {
  onToolCall: (params: {
    toolName: string;
    toolParams: Record<string, any>;
    text: string;
  }) => void;
}

const healthTopics = [
  {
    icon: IconHeartbeat,
    title: "Recovery Analysis",
    description: "Analyze your recovery metrics and HRV data",
    toolName: "recovery_analysis",
    prompt: "Analyze my recovery data and provide insights",
    color: "bg-[#085983]/10",
    iconColor: "text-[#085983]",
  },
  {
    icon: IconMoon,
    title: "Sleep Optimization",
    description: "Get personalized sleep improvement recommendations",
    toolName: "sleep_analysis",
    prompt: "Help me optimize my sleep quality",
    color: "bg-[#085983]/10",
    iconColor: "text-[#085983]",
  },
  {
    icon: IconActivity,
    title: "Workout Planning",
    description: "Create personalized exercise routines",
    toolName: "exercise_planning",
    prompt: "Create a workout plan based on my recovery data",
    color: "bg-[#085983]/10",
    iconColor: "text-[#085983]",
  },
  {
    icon: IconApple,
    title: "Nutrition Guidance",
    description: "Get longevity-focused nutrition advice",
    toolName: "nutrition_tracking",
    prompt: "Provide nutrition recommendations for longevity",
    color: "bg-[#085983]/10",
    iconColor: "text-[#085983]",
  },
  {
    icon: IconFlask,
    title: "Lab Results",
    description: "Interpret biomarkers and lab values",
    toolName: "biomarker_analysis",
    prompt: "Help me understand my latest lab results",
    color: "bg-[#085983]/10",
    iconColor: "text-[#085983]",
  },
  {
    icon: IconDroplet,
    title: "Supplements",
    description: "Research optimal supplement protocols",
    toolName: "supplement_research",
    prompt: "Recommend supplements based on my health profile",
    color: "bg-[#085983]/10",
    iconColor: "text-[#085983]",
  },
];

const quickActions = [
  "What's my biological age based on my recent data?",
  "How can I improve my recovery score?",
  "Create a longevity protocol for me",
  "Analyze my sleep patterns this week",
];

export function Overview({ onToolCall }: OverviewProps) {
  const handleTopicClick = (topic: (typeof healthTopics)[0]) => {
    onToolCall({
      toolName: topic.toolName,
      toolParams: {},
      text: topic.prompt,
    });
  };

  const handleQuickAction = (action: string) => {
    onToolCall({
      toolName: "general_health_query",
      toolParams: { query: action },
      text: action,
    });
  };

  return (
    <div className="relative w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-2xl bg-[#085983]/10">
              <IconBrain className="h-8 w-8 text-[#085983]" />
            </div>
          </div>
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl font-normal text-[#085983] mb-4">
            Your Longevity Coach
          </h1>
          <p className="text-lg text-[#085983]/70 max-w-2xl mx-auto mb-8">
            Ask questions about your health data, get personalized
            recommendations, and optimize your healthspan with AI-powered
            insights.
          </p>
        </div>

        {/* Health Topics Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-[family-name:var(--font-instrument-serif)] text-[#085983] mb-6 text-center">
            What would you like to explore?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-[#085983]/10 hover:border-[#085983]/20"
                  onClick={() => handleTopicClick(topic)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", topic.color)}>
                          <Icon className={cn("h-4 w-4", topic.iconColor)} />
                        </div>
                        <CardTitle className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983]">
                          {topic.title}
                        </CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <IconSettings className="mr-2 h-4 w-4" />
                            Customize
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconPin className="mr-2 h-4 w-4" />
                            Pin to Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconShare className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="text-[#085983]/60 text-sm leading-relaxed">
                      {topic.description}
                    </CardDescription>
                    <div className="pt-2">
                      <Button
                        size="sm"
                        className="w-full bg-[#085983]/5 text-[#085983] hover:bg-[#085983]/10 border border-[#085983]/20"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTopicClick(topic);
                        }}
                      >
                        Start Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-xl font-[family-name:var(--font-instrument-serif)] text-[#085983] mb-6 text-center">
            Or try these quick actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="relative overflow-hidden bg-white rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] border border-[#085983]/10 hover:border-[#085983]/20"
                onClick={() => handleQuickAction(action)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#085983]/10">
                      <IconTarget className="h-4 w-4 text-[#085983]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983] leading-relaxed">
                        {action}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
          <Card className="relative overflow-hidden bg-white rounded-xl border border-[#085983]/10">
            <CardContent className="p-4 text-center">
              <div className="p-2 rounded-lg bg-[#085983]/10 w-fit mx-auto mb-2">
                <IconChartLine className="h-4 w-4 text-[#085983]" />
              </div>
              <div className="font-[family-name:var(--font-instrument-serif)] text-lg font-normal text-[#085983]">
                24/7
              </div>
              <div className="text-[#085983]/60 text-xs font-[family-name:var(--font-geist-sans)]">
                Health Monitoring
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-white rounded-xl border border-[#085983]/10">
            <CardContent className="p-4 text-center">
              <div className="p-2 rounded-lg bg-[#085983]/10 w-fit mx-auto mb-2">
                <IconTarget className="h-4 w-4 text-[#085983]" />
              </div>
              <div className="font-[family-name:var(--font-instrument-serif)] text-lg font-normal text-[#085983]">
                AI
              </div>
              <div className="text-[#085983]/60 text-xs font-[family-name:var(--font-geist-sans)]">
                Powered Insights
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-white rounded-xl border border-[#085983]/10">
            <CardContent className="p-4 text-center">
              <div className="p-2 rounded-lg bg-[#085983]/10 w-fit mx-auto mb-2">
                <IconDna className="h-4 w-4 text-[#085983]" />
              </div>
              <div className="font-[family-name:var(--font-instrument-serif)] text-lg font-normal text-[#085983]">
                Personal
              </div>
              <div className="text-[#085983]/60 text-xs font-[family-name:var(--font-geist-sans)]">
                Recommendations
              </div>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden bg-white rounded-xl border border-[#085983]/10">
            <CardContent className="p-4 text-center">
              <div className="p-2 rounded-lg bg-[#085983]/10 w-fit mx-auto mb-2">
                <IconHeartbeat className="h-4 w-4 text-[#085983]" />
              </div>
              <div className="font-[family-name:var(--font-instrument-serif)] text-lg font-normal text-[#085983]">
                Longevity
              </div>
              <div className="text-[#085983]/60 text-xs font-[family-name:var(--font-geist-sans)]">
                Focused
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
