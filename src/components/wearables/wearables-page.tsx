"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconMoon,
  IconActivity,
  IconRun,
  IconBarbell,
  IconCalendar,
  IconTrendingUp,
  IconSettings,
  IconRefresh,
} from "@tabler/icons-react";
import { SleepCard, RecoveryCard, WorkoutCard, StrengthCard } from "./index";
import { WearablesPageProps, WearablesData } from "./types";
import { cn } from "@/lib/utils";

export function WearablesPage({
  data,
  dateRange,
  className,
}: WearablesPageProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const formatDateRange = () => {
    if (!dateRange) return "Last 7 days";

    const start = dateRange.start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const end = dateRange.end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return `${start} - ${end}`;
  };

  const getLatestData = (dataArray: any[] | undefined) => {
    if (!dataArray || dataArray.length === 0) return null;
    return dataArray.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  };

  const latestSleep = getLatestData(data.sleep);
  const latestRecovery = getLatestData(data.recovery);
  const latestWorkout = getLatestData(data.workouts);
  const latestStrength = getLatestData(data.strength);

  const getOverallHealthScore = () => {
    const scores = [];
    if (latestSleep) scores.push(latestSleep.sleepScore);
    if (latestRecovery) scores.push(latestRecovery.recoveryScore);

    if (scores.length === 0) return null;
    return Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
  };

  const overallScore = getOverallHealthScore();

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl font-normal text-[#085983]">
            Wearables Dashboard
          </h1>
          <p className="text-sm text-[#085983]/70 mt-1">
            Track your health metrics from connected devices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <IconCalendar className="h-3 w-3" />
            {formatDateRange()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <IconRefresh className="h-4 w-4" />
            Sync Data
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <IconSettings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Overall health score */}
      {overallScore && (
        <Card className="bg-gradient-to-r from-[#085983]/5 to-[#085983]/10 border-[#085983]/20">
          <CardHeader className="text-center">
            <CardTitle className="font-[family-name:var(--font-instrument-serif)] text-[#085983]">
              Overall Health Score
            </CardTitle>
            <div className="flex items-center justify-center mt-2">
              <div className="text-4xl font-bold text-[#085983]">
                {overallScore}/100
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {latestSleep && (
                <div>
                  <div className="text-2xl font-bold text-[#085983]">
                    {latestSleep.sleepScore}
                  </div>
                  <div className="text-sm text-[#085983]/70">Sleep Score</div>
                </div>
              )}
              {latestRecovery && (
                <div>
                  <div className="text-2xl font-bold text-[#085983]">
                    {latestRecovery.recoveryScore}
                  </div>
                  <div className="text-sm text-[#085983]/70">
                    Recovery Score
                  </div>
                </div>
              )}
              {(latestWorkout || latestStrength) && (
                <div>
                  <div className="text-2xl font-bold text-[#085983]">
                    {latestWorkout
                      ? latestWorkout.strain.toFixed(1)
                      : latestStrength?.totalVolume.toLocaleString()}
                  </div>
                  <div className="text-sm text-[#085983]/70">
                    {latestWorkout ? "Latest Strain" : "Volume (kg)"}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2"
        >
          <IconTrendingUp className="h-4 w-4" />
          {showDetails ? "Hide Details" : "Show Details"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <IconTrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center gap-2">
            <IconMoon className="h-4 w-4" />
            <span className="hidden sm:inline">Sleep</span>
          </TabsTrigger>
          <TabsTrigger value="recovery" className="flex items-center gap-2">
            <IconActivity className="h-4 w-4" />
            <span className="hidden sm:inline">Recovery</span>
          </TabsTrigger>
          <TabsTrigger value="workouts" className="flex items-center gap-2">
            <IconRun className="h-4 w-4" />
            <span className="hidden sm:inline">Workouts</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {latestSleep && (
              <SleepCard data={latestSleep} showDetails={showDetails} />
            )}
            {latestRecovery && (
              <RecoveryCard data={latestRecovery} showDetails={showDetails} />
            )}
            {latestWorkout && (
              <WorkoutCard data={latestWorkout} showDetails={showDetails} />
            )}
            {latestStrength && (
              <StrengthCard data={latestStrength} showDetails={showDetails} />
            )}
          </div>

          {!latestSleep &&
            !latestRecovery &&
            !latestWorkout &&
            !latestStrength && (
              <Card className="bg-white rounded-xl border-[#085983]/20">
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <div className="text-[#085983]/40 text-6xl">📱</div>
                    <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] text-[#085983]">
                      No Data Available
                    </h3>
                    <p className="text-sm text-[#085983]/70 max-w-md mx-auto">
                      Connect your wearable devices to start tracking your
                      health metrics.
                    </p>
                    <Button className="bg-[#085983] hover:bg-[#085983]/90">
                      Connect Device
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
        </TabsContent>

        {/* Sleep Tab */}
        <TabsContent value="sleep" className="space-y-6">
          {data.sleep && data.sleep.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.sleep.map((sleepData) => (
                <SleepCard
                  key={sleepData.id}
                  data={sleepData}
                  showDetails={showDetails}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-white rounded-xl border-[#085983]/20">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <IconMoon className="h-12 w-12 text-[#085983]/40 mx-auto" />
                  <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] text-[#085983]">
                    No Sleep Data
                  </h3>
                  <p className="text-sm text-[#085983]/70">
                    Sleep data will appear here once your device records sleep
                    sessions.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Recovery Tab */}
        <TabsContent value="recovery" className="space-y-6">
          {data.recovery && data.recovery.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.recovery.map((recoveryData) => (
                <RecoveryCard
                  key={recoveryData.id}
                  data={recoveryData}
                  showDetails={showDetails}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-white rounded-xl border-[#085983]/20">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <IconActivity className="h-12 w-12 text-[#085983]/40 mx-auto" />
                  <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] text-[#085983]">
                    No Recovery Data
                  </h3>
                  <p className="text-sm text-[#085983]/70">
                    Recovery metrics will appear here once your device
                    calculates them.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Workouts Tab */}
        <TabsContent value="workouts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workouts */}
            {data.workouts && data.workouts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] text-[#085983] flex items-center gap-2">
                  <IconRun className="h-5 w-5" />
                  Cardio & Activities
                </h3>
                <div className="space-y-4">
                  {data.workouts.map((workoutData) => (
                    <WorkoutCard
                      key={workoutData.id}
                      data={workoutData}
                      showDetails={showDetails}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Strength */}
            {data.strength && data.strength.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] text-[#085983] flex items-center gap-2">
                  <IconBarbell className="h-5 w-5" />
                  Strength Training
                </h3>
                <div className="space-y-4">
                  {data.strength.map((strengthData) => (
                    <StrengthCard
                      key={strengthData.id}
                      data={strengthData}
                      showDetails={showDetails}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {(!data.workouts || data.workouts.length === 0) &&
            (!data.strength || data.strength.length === 0) && (
              <Card className="bg-white rounded-xl border-[#085983]/20">
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <IconRun className="h-12 w-12 text-[#085983]/40 mx-auto" />
                    <h3 className="text-lg font-[family-name:var(--font-instrument-serif)] text-[#085983]">
                      No Workout Data
                    </h3>
                    <p className="text-sm text-[#085983]/70">
                      Your workouts and training sessions will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Cursor rules applied correctly.
