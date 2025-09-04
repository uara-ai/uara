"use client";

import { CustomizableGrid } from "./customizable-grid";
import { ActionButtons } from "./action-buttons";
import {
  BiologicalAgeCard,
  HRVRecoveryCard,
  SleepQualityCard,
  LabResultsCard,
  StressLevelCard,
  HealthScoreCard,
  AICoachCard,
  LongevityProgressCard,
} from "./dashboard-cards";

const dashboardCards = [
  {
    id: "biological-age",
    component: BiologicalAgeCard,
  },
  {
    id: "hrv-recovery",
    component: HRVRecoveryCard,
  },
  {
    id: "sleep-quality",
    component: SleepQualityCard,
  },
  {
    id: "lab-results",
    component: LabResultsCard,
  },
  {
    id: "stress-level",
    component: StressLevelCard,
  },
  {
    id: "health-score",
    component: HealthScoreCard,
  },
  {
    id: "ai-coach",
    component: AICoachCard,
  },
  {
    id: "longevity-progress",
    component: LongevityProgressCard,
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <CustomizableGrid cards={dashboardCards} />
      <div className="mt-8">
        <ActionButtons />
      </div>
    </div>
  );
}
