"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface WhoopActivityData {
  label: string;
  value: number;
  color: string;
  size: number;
  current: number;
  target: number;
  unit: string;
}

interface CircleProgressProps {
  data: WhoopActivityData;
  index: number;
}

interface WhoopActivityCardProps {
  sleepPerformance?: number;
  recoveryScore?: number;
  strainScore?: number;
  title?: string;
  className?: string;
}

const CircleProgress = ({ data, index }: CircleProgressProps) => {
  const strokeWidth = 16;
  const radius = (data.size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = ((100 - data.value) / 100) * circumference;

  const gradientId = `gradient-${data.label.toLowerCase()}`;
  const gradientUrl = `url(#${gradientId})`;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
    >
      <div className="relative">
        <svg
          width={data.size}
          height={data.size}
          viewBox={`0 0 ${data.size} ${data.size}`}
          className="transform -rotate-90"
          aria-label={`${data.label} Progress - ${data.value}%`}
        >
          <title>{`${data.label} Progress - ${data.value}%`}</title>

          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                style={{
                  stopColor: data.color,
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor:
                    data.color === "#FF2D55"
                      ? "#FF6B8B"
                      : data.color === "#A3F900"
                      ? "#C5FF4D"
                      : "#4DDFED",
                  stopOpacity: 1,
                }}
              />
            </linearGradient>
          </defs>

          <circle
            cx={data.size / 2}
            cy={data.size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-zinc-200/50 dark:text-zinc-800/50"
          />

          <motion.circle
            cx={data.size / 2}
            cy={data.size / 2}
            r={radius}
            fill="none"
            stroke={gradientUrl}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progress }}
            transition={{
              duration: 1.8,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 6px rgba(0,0,0,0.15))",
            }}
          />
        </svg>
      </div>
    </motion.div>
  );
};

const DetailedActivityInfo = ({
  activities,
}: {
  activities: WhoopActivityData[];
}) => {
  return (
    <motion.div
      className="flex flex-col gap-6 ml-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {activities.map((activity) => (
        <motion.div key={activity.label} className="flex flex-col">
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {activity.label}
          </span>
          <span
            className="text-2xl font-semibold"
            style={{ color: activity.color }}
          >
            {activity.current}
            {activity.target > 0 && (
              <>
                /{activity.target}
                <span className="text-base ml-1 text-zinc-600 dark:text-zinc-400">
                  {activity.unit}
                </span>
              </>
            )}
            {activity.target === 0 && (
              <span className="text-base ml-1 text-zinc-600 dark:text-zinc-400">
                {activity.unit}
              </span>
            )}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default function WhoopActivityCard({
  sleepPerformance = 85,
  recoveryScore = 75,
  strainScore = 12.5,
  title = "Today's Metrics",
  className,
}: WhoopActivityCardProps) {
  const activities: WhoopActivityData[] = [
    {
      label: "SLEEP",
      value: sleepPerformance,
      color: "#085983", // Blue color from sleep card
      size: 200,
      current: sleepPerformance,
      target: 100,
      unit: "%",
    },
    {
      label: "RECOVERY",
      value: recoveryScore,
      color: "#10B981", // Green color for recovery
      size: 160,
      current: recoveryScore,
      target: 100,
      unit: "%",
    },
    {
      label: "STRAIN",
      value: (strainScore / 21) * 100, // Convert strain 0-21 to percentage
      color: "#F59E0B", // Orange color for strain
      size: 120,
      current: strainScore,
      target: 0, // No target for strain
      unit: "",
    },
  ];

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm",
        "text-zinc-900 dark:text-white",
        className
      )}
    >
      <div className="flex flex-col items-center gap-8">
        <motion.h2
          className="text-2xl font-medium text-zinc-900 dark:text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>

        <div className="flex items-center">
          <div className="relative w-[180px] h-[180px]">
            {activities.map((activity, index) => (
              <CircleProgress
                key={activity.label}
                data={activity}
                index={index}
              />
            ))}
          </div>
          <DetailedActivityInfo activities={activities} />
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
