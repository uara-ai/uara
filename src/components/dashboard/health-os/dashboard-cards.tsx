"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Clock,
  FileText,
  Activity,
  TrendingUp,
  Brain,
  Zap,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
}

export function BiologicalAgeCard({ className }: CardProps) {
  return (
    <Card
      className={cn(
        "h-full w-full flex flex-col border-slate-200 shadow-sm rounded-lg",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-slate-500" />
          <CardTitle className="text-sm font-medium text-slate-900">
            Biological Age
          </CardTitle>
        </div>
        <Badge
          variant="secondary"
          className="text-xs bg-green-100 text-green-700 border-0 rounded"
        >
          New
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="text-2xl font-semibold text-slate-900">28 years</div>
          <p className="text-sm text-slate-600">
            <span className="text-green-600 font-medium">3 years younger</span>{" "}
            than chronological age
          </p>
        </div>
        <Button
          variant="link"
          className="p-0 h-auto text-xs text-slate-500 justify-start mt-4"
        >
          View aging trends →
        </Button>
      </CardContent>
    </Card>
  );
}

export function HRVRecoveryCard({ className }: CardProps) {
  return (
    <Card
      className={cn(
        "h-full w-full flex flex-col border-slate-200 shadow-sm rounded-lg",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-slate-500" />
          <CardTitle className="text-sm font-medium text-slate-900">
            HRV Recovery
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="text-2xl font-semibold text-slate-900">52ms</div>
          <p className="text-sm text-slate-600">
            <span className="text-green-600 font-medium">Excellent</span>{" "}
            recovery status
          </p>
        </div>
        <Button
          variant="link"
          className="p-0 h-auto text-xs text-slate-500 justify-start mt-4"
        >
          View recovery trends →
        </Button>
      </CardContent>
    </Card>
  );
}

export function SleepQualityCard({ className }: CardProps) {
  return (
    <Card
      className={cn(
        "h-full w-full flex flex-col border-slate-200 shadow-sm rounded-lg",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          <CardTitle className="text-sm font-medium text-slate-900">
            Sleep Quality
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="text-2xl font-semibold text-slate-900">87/100</div>
          <p className="text-sm text-slate-600">
            <span className="text-green-600 font-medium">Good</span> sleep score
            this week
          </p>
          <div className="flex items-center space-x-1">
            {[3, 5, 4, 6, 5, 7, 6].map((height, index) => (
              <div
                key={index}
                className="bg-slate-200 rounded-sm"
                style={{ height: `${height * 3}px`, width: "6px" }}
              />
            ))}
          </div>
        </div>
        <Button
          variant="link"
          className="p-0 h-auto text-xs text-slate-500 justify-start mt-4"
        >
          View sleep trends →
        </Button>
      </CardContent>
    </Card>
  );
}

export function LabResultsCard({ className }: CardProps) {
  return (
    <Card
      className={cn(
        "h-full w-full flex flex-col border-slate-200 shadow-sm rounded-lg",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-500" />
          <CardTitle className="text-sm font-medium text-slate-900">
            Lab Results
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="text-2xl font-semibold text-slate-900">2 new</div>
          <p className="text-sm text-slate-600">
            Analyzed for{" "}
            <span className="font-medium">longevity biomarkers</span>
          </p>
        </div>
        <Button
          variant="link"
          className="p-0 h-auto text-xs text-slate-500 justify-start mt-4"
        >
          View lab insights →
        </Button>
      </CardContent>
    </Card>
  );
}

export function StressLevelCard({ className }: CardProps) {
  return (
    <Card
      className={cn(
        "h-full w-full flex flex-col border-slate-200 shadow-sm rounded-lg",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-slate-500" />
          <CardTitle className="text-sm font-medium text-slate-900">
            Stress Level
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="text-2xl font-semibold text-slate-900">6.2/10</div>
          <p className="text-sm text-slate-600">
            <span className="text-yellow-600 font-medium">Moderate</span> stress
            this week
          </p>
        </div>
        <Button
          variant="link"
          className="p-0 h-auto text-xs text-slate-500 justify-start mt-4"
        >
          View stress patterns →
        </Button>
      </CardContent>
    </Card>
  );
}

export function HealthScoreCard({ className }: CardProps) {
  return (
    <Card
      className={cn(
        "h-full w-full flex flex-col border-slate-200 shadow-sm rounded-lg",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-slate-500" />
          <CardTitle className="text-sm font-medium text-slate-900">
            Health Score
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="text-2xl font-semibold text-slate-900">92/100</div>
          <p className="text-sm text-slate-600">
            <span className="text-green-600 font-medium">Excellent</span>{" "}
            overall health
          </p>
        </div>
        <Button
          variant="link"
          className="p-0 h-auto text-xs text-slate-500 justify-start mt-4"
        >
          View health trends →
        </Button>
      </CardContent>
    </Card>
  );
}

export function AICoachCard({ className }: CardProps) {
  return (
    <Card
      className={cn(
        "h-full w-full flex flex-col border-slate-200 shadow-sm rounded-lg",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-slate-500" />
          <CardTitle className="text-sm font-medium text-slate-900">
            AI Coach
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="text-sm text-slate-900 font-medium">
            Aging pace slowed!
          </div>
          <p className="text-sm text-slate-600">
            Keep up with <span className="font-medium">sleep consistency</span>
          </p>
        </div>
        <Button
          variant="link"
          className="p-0 h-auto text-xs text-slate-500 justify-start mt-4"
        >
          View recommendations →
        </Button>
      </CardContent>
    </Card>
  );
}

export function LongevityProgressCard({ className }: CardProps) {
  return (
    <Card
      className={cn(
        "h-full w-full flex flex-col border-slate-200 shadow-sm rounded-lg",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-slate-500" />
          <CardTitle className="text-sm font-medium text-slate-900">
            Longevity Progress
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="text-2xl font-semibold text-slate-900">Progress</div>
          <p className="text-sm text-slate-600">
            <span className="text-green-600 font-medium">Excellent</span>{" "}
            progress this month
          </p>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="bg-green-500 rounded-sm"
                style={{ height: "8px", width: "8px" }}
              />
            ))}
          </div>
        </div>
        <Button
          variant="link"
          className="p-0 h-auto text-xs text-slate-500 justify-start mt-4"
        >
          View longevity goals →
        </Button>
      </CardContent>
    </Card>
  );
}

// Cursor rules applied correctly.
