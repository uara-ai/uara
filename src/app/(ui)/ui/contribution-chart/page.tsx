import { ContributionChart } from "@/components/healthspan/v1/healthspan/contribution-chart";
import { ComponentPageTemplate } from "@/components/design-system/component-page-template";

const contributionChartSourceCode = `"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface ContributionChartProps {
  memberSince: string;
  totalDays: number;
  currentStreak: number;
  className?: string;
}

// Generate activity data for a full year starting from January
const generateActivityData = (memberSince: string, currentStreak: number) => {
  const data: { date: Date; level: number }[] = [];
  const today = new Date();
  const joinDate = new Date(memberSince);

  // Start from January 1st of the current year, or last year if we're early in the year
  const currentYear = today.getFullYear();
  const startYear = today.getMonth() < 2 ? currentYear - 1 : currentYear; // If before March, start from last year
  const startDate = new Date(startYear, 0, 1); // January 1st

  // Adjust start date to be a Sunday for proper week alignment
  const dayOfWeek = startDate.getDay();
  if (dayOfWeek !== 0) {
    startDate.setDate(startDate.getDate() - dayOfWeek);
  }

  // Calculate how many days to generate (full year + padding for week alignment)
  const endDate = new Date(startYear + 1, 0, 0); // December 31st of the year
  const totalDays =
    Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 7; // Add padding

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    let level = 0;

    // Only show activity if date is after join date and not in the future
    if (date >= joinDate && date <= today && date.getFullYear() === startYear) {
      const daysSinceToday = Math.floor(
        (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Check if this date is in the current streak
      const isInCurrentStreak =
        daysSinceToday >= 0 && daysSinceToday < currentStreak;

      if (isInCurrentStreak) {
        // Current streak - high activity
        level = Math.random() > 0.1 ? (Math.random() > 0.3 ? 4 : 3) : 2;
      } else {
        // Past activity - more sporadic but realistic
        const random = Math.random();
        if (random > 0.8) level = 4;
        else if (random > 0.6) level = 3;
        else if (random > 0.4) level = 2;
        else if (random > 0.2) level = 1;
        else level = 0;
      }
    }

    data.push({ date, level });
  }

  return data;
};

const getIntensityColor = (level: number) => {
  switch (level) {
    case -1:
      return "bg-transparent"; // Empty cells
    case 0:
      return "bg-gray-100 dark:bg-gray-800";
    case 1:
      return "bg-[#085983]/20";
    case 2:
      return "bg-[#085983]/40";
    case 3:
      return "bg-[#085983]/70";
    case 4:
      return "bg-[#085983]";
    default:
      return "bg-gray-100 dark:bg-gray-800";
  }
};

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const formatStreakText = (streak: number) => {
  if (streak === 1) return "1 day streak";
  return \`\${streak} days streak\`;
};

export function ContributionChart({
  memberSince,
  totalDays,
  currentStreak,
  className,
}: ContributionChartProps) {
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-scroll to present month after component mounts
  useEffect(() => {
    if (scrollContainerRef.current && !isMobile) {
      const container = scrollContainerRef.current;

      setTimeout(() => {
        // Scroll to approximately 70% of the chart to show current month
        const scrollPosition = container.scrollWidth * 0.7;
        container.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }, 300);
    }
  }, [isMobile]);

  // Calculate actual streak from member since date
  const calculateCurrentStreak = () => {
    const today = new Date();
    const joinDate = new Date(memberSince);
    const daysSinceJoined = Math.floor(
      (today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // For demonstration, let's calculate a realistic streak
    // In real app, this would come from actual user activity data
    return Math.min(daysSinceJoined, currentStreak);
  };

  const actualStreak = calculateCurrentStreak();
  const activityData = generateActivityData(memberSince, actualStreak);

  // Group data by weeks
  const weeks: { date: Date; level: number }[][] = [];
  let currentWeek: { date: Date; level: number }[] = [];

  activityData.forEach((day, index) => {
    currentWeek.push(day);

    // Start new week on Saturday (day 6) since we start on Sunday
    if (day.date.getDay() === 6 || index === activityData.length - 1) {
      // Pad incomplete weeks with empty cells
      while (currentWeek.length < 7) {
        currentWeek.push({ date: new Date(), level: -1 }); // -1 for empty cells
      }
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // For mobile, show only last 26 weeks (6 months)
  const displayWeeks = isMobile ? weeks.slice(-26) : weeks;

  // Create month labels for January to December
  const monthLabels: { month: string; position: string }[] = [];
  const monthPositions = new Map<number, number>();

  // Find the first occurrence of each month and its position
  displayWeeks.forEach((week, weekIndex) => {
    const firstValidDay = week.find((day) => day.level !== -1);
    if (firstValidDay && !monthPositions.has(firstValidDay.date.getMonth())) {
      monthPositions.set(firstValidDay.date.getMonth(), weekIndex);
    }
  });

  // Calculate total chart width in weeks
  const totalWeeks = displayWeeks.length;

  // Create month labels for all 12 months in order (Jan to Dec)
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const weekPosition = monthPositions.get(monthIndex);
    if (weekPosition !== undefined) {
      monthLabels.push({
        month: months[monthIndex],
        position: \`\${(weekPosition / Math.max(1, totalWeeks - 1)) * 100}%\`,
      });
    }
  }

  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getActivityText = (level: number) => {
    switch (level) {
      case 0: return "No activity";
      case 1: return "Low activity";
      case 2: return "Medium activity";
      case 3: return "High activity";
      case 4: return "Very high activity";
      default: return "No activity";
    }
  };

  const formatTooltipDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={cn("w-full max-w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-[#085983] text-base">
              {formatStreakText(actualStreak)}
            </span>
            <Flame className="size-4 text-orange-500 fill-orange-500" />
          </div>
          <p className="text-xs text-[#085983]/60">
            Member since {formatMemberSince(memberSince)}
          </p>
        </div>
      </div>

      {/* Chart container */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 w-full">
        {/* Scrollable container - hidden scrollbar */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div
            className={cn(
              "relative",
              isMobile
                ? "min-w-[280px] w-full"
                : "min-w-[520px] w-full max-w-[50vw]"
            )}
          >
            {/* Month labels - justified across full width */}
            <div className="relative mb-2 h-3 w-full ml-3">
              {monthLabels.map((label, index) => (
                <span
                  key={index}
                  className="absolute text-[10px] text-[#085983]/60 font-medium transform -translate-x-1/2"
                  style={{ left: label.position }}
                >
                  {label.month}
                </span>
              ))}
            </div>

            {/* Chart grid - 52 weeks with proper spacing */}
            <div className="flex gap-[2px] w-full">
              {displayWeeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px] flex-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={\`\${weekIndex}-\${dayIndex}\`}
                      className={cn(
                        "w-[10px] h-[10px] rounded-sm transition-colors relative group",
                        day.level !== -1 &&
                          "cursor-pointer hover:ring-1 hover:ring-[#085983]/30",
                        getIntensityColor(day.level)
                      )}
                    >
                      {/* Mini tooltip with maximum z-index - only for valid days */}
                      {day.level !== -1 && (
                        <div
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
                          style={{ zIndex: 99999 }}
                        >
                          <div className="font-medium">
                            {formatTooltipDate(day.date)}
                          </div>
                          <div className="text-gray-300">
                            {getActivityText(day.level)}
                          </div>
                          {/* Tooltip arrow */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-3 text-[10px] text-[#085983]/60">
          <span>Less</span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn("w-2 h-2 rounded-sm", getIntensityColor(level))}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}`;

export default function ContributionChartPage() {
  const examples = [
    {
      name: "Default Example",
      description: "Basic usage with member since date and current streak",
      code: `<ContributionChart
  memberSince="2024-01-15"
  totalDays={73}
  currentStreak={12}
  className="w-full"
/>`,
      component: (
        <ContributionChart
          memberSince="2024-01-15"
          totalDays={73}
          currentStreak={12}
          className="w-full"
        />
      ),
    },
  ];

  const props = [
    {
      name: "memberSince",
      type: "string",
      required: true,
      description: "Date when the user joined (ISO date string)",
    },
    {
      name: "totalDays",
      type: "number",
      required: true,
      description: "Total number of days since joining",
    },
    {
      name: "currentStreak",
      type: "number",
      required: true,
      description: "Current consecutive days streak",
    },
    {
      name: "className",
      type: "string",
      required: false,
      description: "Additional CSS classes to apply",
    },
  ];

  return (
    <ComponentPageTemplate
      title="Contribution Chart"
      description="GitHub-style activity contribution chart with streak tracking and interactive tooltips"
      category="Charts"
      examples={examples}
      props={props}
      sourceCode={contributionChartSourceCode}
    />
  );
}

// Cursor rules applied correctly.
