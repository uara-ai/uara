"use client";

import { Badge } from "@/components/ui/badge";
import {
  IconActivity,
  IconBrain,
  IconHeartbeat,
  IconMoon,
  IconApple,
  IconDroplet,
  IconFlask,
  IconChartLine,
  IconTarget,
  IconWand,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ActiveToolCallProps {
  toolName: string;
  className?: string;
}

const toolConfig = {
  recovery_analysis: {
    icon: IconHeartbeat,
    label: "Analyzing Recovery",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  sleep_analysis: {
    icon: IconMoon,
    label: "Analyzing Sleep",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  exercise_planning: {
    icon: IconActivity,
    label: "Creating Workout Plan",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  nutrition_tracking: {
    icon: IconApple,
    label: "Analyzing Nutrition",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  biomarker_analysis: {
    icon: IconFlask,
    label: "Interpreting Labs",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  supplement_research: {
    icon: IconDroplet,
    label: "Researching Supplements",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  general_health_query: {
    icon: IconBrain,
    label: "Processing Query",
    color: "bg-[#085983]/5 text-[#085983] border-[#085983]/20",
  },
  default: {
    icon: IconWand,
    label: "Processing",
    color: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

export function ActiveToolCall({ toolName, className }: ActiveToolCallProps) {
  const config =
    toolConfig[toolName as keyof typeof toolConfig] || toolConfig.default;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg animate-pulse",
        config.color,
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{config.label}</span>
      <div className="flex gap-1">
        <div
          className="w-1 h-1 bg-current rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-1 h-1 bg-current rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-1 h-1 bg-current rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </Badge>
  );
}

// Cursor rules applied correctly.
