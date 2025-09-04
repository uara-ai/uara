"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconHeart,
  IconClock,
  IconFileText,
  IconActivity,
  IconTrendingUp,
  IconBrain,
  IconBolt,
  IconTarget,
  IconChartLine,
  IconCalendar,
  IconFileAnalytics,
  IconCash,
  IconReceipt,
  IconCreditCard,
  IconProgress,
  IconDots,
  IconLayoutGrid,
  IconMenu2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
}

export function LongevityProgressCard({ className }: CardProps) {
  return (
    <Card
      className={cn(
        "bg-card text-card-foreground border-border transition-shadow duration-200",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <IconProgress className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">
            Longevity Progress
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-base font-semibold">Longevity Score</div>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          Good
        </div>
        <div className="flex items-center space-x-1 pt-1">
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${
                i < 12
                  ? "bg-blue-500 dark:bg-blue-400"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground pt-0">
        Good longevity progress
      </CardFooter>
    </Card>
  );
}

// Cursor rules applied correctly.
