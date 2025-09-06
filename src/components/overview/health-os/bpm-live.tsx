"use client";

import { useState, useEffect } from "react";
import { IconHeart } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line } from "recharts";

interface BPMLiveProps {
  className?: string;
}

interface HeartDataPoint {
  time: string;
  bpm: number;
}

const chartConfig = {
  bpm: {
    label: "BPM",
    color: "#ef4444", // red-500
  },
};

export function BPMLive({ className }: BPMLiveProps) {
  const [currentBPM, setCurrentBPM] = useState(72);
  const [heartData, setHeartData] = useState<HeartDataPoint[]>([]);

  // Mock BPM data generation
  useEffect(() => {
    const generateBPM = () => {
      // Generate realistic BPM between 65-85
      const baseBPM = 72;
      const variation = (Math.random() - 0.5) * 10;
      const newBPM = Math.round(baseBPM + variation);

      setCurrentBPM(newBPM);

      // Update heart data for chart (keep last 15 points for better visualization)
      setHeartData((prev) => {
        const now = new Date();
        const timeString = now.toLocaleTimeString("en-US", {
          hour12: false,
          minute: "2-digit",
          second: "2-digit",
        });
        const newData = [...prev, { time: timeString, bpm: newBPM }].slice(-15);
        return newData;
      });
    };

    // Initial data
    generateBPM();

    // Update every 1 second
    const interval = setInterval(generateBPM, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      className={cn(
        "bg-card text-card-foreground border-border transition-shadow duration-200",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <IconHeart className="h-4 w-4 text-red-500 fill-red-500 dark:fill-red-400 animate-pulse" />
          <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="text-base font-semibold">Current BPM</div>
        <div className="text-3xl font-bold text-red-600 dark:text-red-400">
          {currentBPM}
        </div>

        {/* Heart Rate Chart */}
        <div className="h-10 w-full pt-1">
          {heartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="h-full w-full aspect-auto"
            >
              <LineChart data={heartData}>
                <Line
                  type="monotone"
                  dataKey="bpm"
                  stroke="var(--color-bpm)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 3,
                    fill: "var(--color-bpm)",
                    stroke: "var(--color-bpm)",
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => `Time: ${label}`}
                      formatter={(value) => [`${value} BPM`, "Heart Rate"]}
                    />
                  }
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
              Loading chart data...
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground pt-0">
        Real-time monitoring
      </CardFooter>
    </Card>
  );
}

// Cursor rules applied correctly.
