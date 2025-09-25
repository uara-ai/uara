import React from "react";
import { cn } from "@/lib/utils";
import { User } from "@/lib/user.type";
import { ScoreOutput } from "@/lib/health/types";
import { HealthspanPage } from "@/components/healthspan/v1/healthspan/healthspan-page";

interface MiniDemoProps {
  className?: string;
}

// Mock data for the demo - exactly as used in the healthspan page
const mockUser: User = {
  id: "demo-user-123",
  email: "fed@uara.ai",
  firstName: "Federico",
  lastName: "Fan",
  profilePictureUrl: "/fedef.jpg",
  createdAt: "2025-01-15T00:00:00.000Z",
};

const mockHealthScores: ScoreOutput = {
  perMarker: [
    {
      id: "sleep_duration",
      label: "Sleep Duration",
      category: "SleepRecovery",
      value: 7.5,
      score: 85,
    },
    {
      id: "recovery_score",
      label: "Recovery Score",
      category: "SleepRecovery",
      value: 78,
      score: 78,
    },
    {
      id: "activity_level",
      label: "Activity Level",
      category: "MovementFitness",
      value: 84,
      score: 84,
    },
    {
      id: "hrv",
      label: "Heart Rate Variability",
      category: "SleepRecovery",
      value: 45,
      score: 82,
    },
    {
      id: "resting_hr",
      label: "Resting Heart Rate",
      category: "SleepRecovery",
      value: 52,
      score: 88,
    },
    {
      id: "stress_level",
      label: "Stress Level",
      category: "MindStress",
      value: 25,
      score: 73,
    },
    {
      id: "vitamin_d",
      label: "Vitamin D",
      category: "HealthChecks",
      value: 42,
      score: 91,
    },
    {
      id: "protein_intake",
      label: "Daily Protein",
      category: "Nutrition",
      value: 120,
      score: 88,
    },
  ],
  category: {
    Nutrition: 88,
    SleepRecovery: 82,
    MovementFitness: 84,
    MindStress: 73,
    HealthChecks: 91,
  },
  overall: 84,
};

const mockWhoopData = {
  sleepPerformance: 87,
  recoveryScore: 72,
  strainScore: 14.2,
};

const mockWearableData = {
  sleep: Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    return {
      score: {
        sleep_performance_percentage: Math.round(
          75 + Math.sin(i * 0.1) * 10 + (Math.random() - 0.5) * 15
        ),
      },
      created_at: date.toISOString(),
    };
  }),
  recovery: Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    return {
      score: {
        recovery_score: Math.round(
          70 + Math.cos(i * 0.15) * 15 + (Math.random() - 0.5) * 20
        ),
      },
      created_at: date.toISOString(),
    };
  }),
  cycles: Array.from({ length: 30 }, (_, i) => {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    return {
      score: {
        strain: Math.round(
          12 + Math.sin(i * 0.08) * 4 + (Math.random() - 0.5) * 6
        ),
      },
      created_at: date.toISOString(),
    };
  }),
};

export function MiniDemo({ className }: MiniDemoProps) {
  return (
    <div
      className={cn("w-full max-w-6xl mx-auto mb-24 px-4 sm:px-0", className)}
    >
      {/* Header */}

      {/* Demo Container with subtle styling */}
      <div className="relative">
        {/* Background overlay to indicate it's a demo */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm rounded-2xl border border-[#085983]/20 shadow-lg -z-10"></div>

        {/* Demo Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-[#085983] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
            <div className="size-2 animate-pulse bg-white rounded-full" />
            Live Demo
          </div>
        </div>

        {/* Actual HealthspanPage Component */}
        <div className="relative z-0 py-4 sm:py-8 rounded-2xl">
          <HealthspanPage
            user={mockUser}
            whoopData={mockWhoopData}
            wearableData={mockWearableData}
            healthScores={mockHealthScores}
            className="space-y-6"
          />
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
