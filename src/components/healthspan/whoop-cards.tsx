import {
  IconTrendingDown,
  IconTrendingUp,
  IconActivity,
  IconMoon,
  IconHeart,
  IconZzz,
  IconTarget,
  IconBolt,
  IconUser,
  IconScale,
  IconRuler2,
  IconDots,
  IconSettings,
  IconShare,
  IconPin,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { WhoopDataResponse, WhoopStats } from "@/actions/whoop-data-action";
import { cn } from "@/lib/utils";

interface WhoopCardsProps {
  whoopData: WhoopDataResponse | null;
  whoopStats: WhoopStats | null;
  user?: {
    dateOfBirth?: Date | null;
    gender?: string | null;
    heightCm?: number | null;
    weightKg?: number | null;
    tier?: string | null;
    profileCompleted?: boolean;
  } | null;
  whoopUser?: {
    firstName?: string;
    lastName?: string;
    heightMeter?: number | null;
    weightKilogram?: number | null;
    maxHeartRate?: number | null;
    lastSyncAt?: Date | null;
  } | null;
}

export function WhoopCards({
  whoopData,
  whoopStats,
  user,
  whoopUser,
}: WhoopCardsProps) {
  const formatTime = (milliseconds: number | null): string => {
    if (!milliseconds) return "N/A";
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <IconTrendingUp className="h-3 w-3" />;
      case "down":
        return <IconTrendingDown className="h-3 w-3" />;
      default:
        return <IconActivity className="h-3 w-3" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-[#085983] bg-[#085983]/10 border-[#085983]/20";
      case "down":
        return "text-[#085983]/60 bg-[#085983]/5 border-[#085983]/10";
      default:
        return "text-[#085983]/70 bg-[#085983]/5 border-[#085983]/15";
    }
  };

  const getScoreColor = (
    score: number | null,
    type: "recovery" | "sleep" | "strain"
  ) => {
    if (!score) return "text-[#085983]/50";

    // Use consistent brand color with opacity variations for all scores
    switch (type) {
      case "recovery":
        if (score >= 80) return "text-[#085983]";
        if (score >= 60) return "text-[#085983]/80";
        return "text-[#085983]/60";
      case "sleep":
        if (score >= 85) return "text-[#085983]";
        if (score >= 70) return "text-[#085983]/80";
        return "text-[#085983]/60";
      case "strain":
        if (score >= 15) return "text-[#085983]";
        if (score >= 10) return "text-[#085983]/80";
        return "text-[#085983]/60";
      default:
        return "text-[#085983]/50";
    }
  };

  const getProgressValue = (current: number | null, target: number) => {
    if (!current) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const calculateWeeklyAverage = (data: any[], field: string) => {
    if (!data || data.length === 0) return null;
    const values = data
      .slice(0, 7)
      .map((item) => item[field])
      .filter(Boolean);
    if (values.length === 0) return null;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  if (!whoopData || !whoopStats) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle>No WHOOP Data</CardTitle>
            <CardDescription>
              No WHOOP data available. Connect your WHOOP account to see
              insights.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const weeklyRecoveryAvg = calculateWeeklyAverage(
    whoopData.recovery,
    "recoveryScore"
  );
  const weeklyHrvAvg = calculateWeeklyAverage(whoopData.recovery, "hrvRmssd");
  const weeklySleepEfficiency = calculateWeeklyAverage(
    whoopData.sleep,
    "sleepEfficiencyPercentage"
  );

  return (
    <section className="relative w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Enhanced Recovery Score Card */}
          <Card className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#085983]/10">
                    <IconHeart className="h-4 w-4 text-[#085983]" />
                  </div>
                  <CardDescription className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983] text-[#085983]/80">
                    Recovery Score
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <IconDots className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <IconSettings className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconAlertTriangle className="mr-2 h-4 w-4" />
                      Set Alert
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle
                    className={cn(
                      "font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tabular-nums",
                      getScoreColor(
                        whoopStats.latestRecovery?.recoveryScore || null,
                        "recovery"
                      )
                    )}
                  >
                    {whoopStats.latestRecovery?.recoveryScore
                      ? `${Math.round(
                          whoopStats.latestRecovery.recoveryScore
                        )}%`
                      : "N/A"}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium text-[#085983]",
                      getTrendColor(whoopStats.trends.recoveryTrend)
                    )}
                  >
                    {getTrendIcon(whoopStats.trends.recoveryTrend)}
                    {whoopStats.trends.recoveryTrend === "up"
                      ? "Improving"
                      : whoopStats.trends.recoveryTrend === "down"
                      ? "Declining"
                      : "Stable"}
                  </Badge>
                </div>

                {/* Progress bar for recovery target */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#085983]/60">Target: 80%</span>
                    <span className="font-medium text-[#085983] text-[#085983]">
                      {whoopStats.latestRecovery?.recoveryScore
                        ? `${Math.round(
                            getProgressValue(
                              whoopStats.latestRecovery.recoveryScore,
                              80
                            )
                          )}%`
                        : "0%"}
                    </span>
                  </div>
                  <Progress
                    value={getProgressValue(
                      whoopStats.latestRecovery?.recoveryScore || null,
                      80
                    )}
                    className="h-2"
                  />
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <IconHeart className="h-3 w-3 text-[#085983]/60" />
                    <span className="text-[#085983]/60 text-xs">RHR</span>
                  </div>
                  <div className="font-medium text-[#085983] text-[#085983]">
                    {whoopStats.latestRecovery?.restingHeartRate
                      ? `${whoopStats.latestRecovery.restingHeartRate} bpm`
                      : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <IconBolt className="h-3 w-3 text-[#085983]/60" />
                    <span className="text-[#085983]/60 text-xs">HRV</span>
                  </div>
                  <div className="font-medium text-[#085983] text-[#085983]">
                    {whoopStats.latestRecovery?.hrvRmssd
                      ? `${Math.round(whoopStats.latestRecovery.hrvRmssd)}ms`
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Weekly average */}
              <div className="pt-2 border-t">
                <div className="flex justify-between text-xs">
                  <span className="text-[#085983]/60">7-day avg:</span>
                  <span className="font-medium text-[#085983]">
                    {weeklyRecoveryAvg
                      ? `${weeklyRecoveryAvg.toFixed(1)}%`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Sleep Performance Card */}
          <Card className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#085983]/10">
                    <IconMoon className="h-4 w-4 text-[#085983]" />
                  </div>
                  <CardDescription className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983] text-[#085983]/80">
                    Sleep Performance
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <IconDots className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <IconSettings className="mr-2 h-4 w-4" />
                      Sleep Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconTarget className="mr-2 h-4 w-4" />
                      Set Sleep Goal
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle
                    className={cn(
                      "font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tabular-nums",
                      getScoreColor(
                        whoopStats.latestSleep?.sleepPerformancePercentage ||
                          null,
                        "sleep"
                      )
                    )}
                  >
                    {whoopStats.latestSleep?.sleepPerformancePercentage
                      ? `${Math.round(
                          whoopStats.latestSleep.sleepPerformancePercentage
                        )}%`
                      : "N/A"}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium text-[#085983]",
                      getTrendColor(whoopStats.trends.sleepTrend)
                    )}
                  >
                    {getTrendIcon(whoopStats.trends.sleepTrend)}
                    {whoopStats.trends.sleepTrend === "up"
                      ? "Better"
                      : whoopStats.trends.sleepTrend === "down"
                      ? "Worse"
                      : "Stable"}
                  </Badge>
                </div>

                {/* Sleep quality progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#085983]/60">
                      Sleep Quality Target: 85%
                    </span>
                    <span className="font-medium text-[#085983]">
                      {whoopStats.latestSleep?.sleepPerformancePercentage
                        ? `${Math.round(
                            getProgressValue(
                              whoopStats.latestSleep.sleepPerformancePercentage,
                              85
                            )
                          )}%`
                        : "0%"}
                    </span>
                  </div>
                  <Progress
                    value={getProgressValue(
                      whoopStats.latestSleep?.sleepPerformancePercentage ||
                        null,
                      85
                    )}
                    className="h-2"
                  />
                </div>
              </div>

              {/* Sleep metrics grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <IconTarget className="h-3 w-3 text-[#085983]/60" />
                    <span className="text-[#085983]/60 text-xs">
                      Efficiency
                    </span>
                  </div>
                  <div className="font-medium text-[#085983] text-[#085983]">
                    {whoopStats.latestSleep?.sleepEfficiencyPercentage
                      ? `${Math.round(
                          whoopStats.latestSleep.sleepEfficiencyPercentage
                        )}%`
                      : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <IconZzz className="h-3 w-3 text-[#085983]/60" />
                    <span className="text-[#085983]/60 text-xs">Time</span>
                  </div>
                  <div className="font-medium text-[#085983] text-[#085983]">
                    {whoopStats.latestSleep?.totalInBedTime
                      ? formatTime(whoopStats.latestSleep.totalInBedTime)
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* Weekly average */}
              <div className="pt-2 border-t">
                <div className="flex justify-between text-xs">
                  <span className="text-[#085983]/60">7-day efficiency:</span>
                  <span className="font-medium text-[#085983]">
                    {weeklySleepEfficiency
                      ? `${weeklySleepEfficiency.toFixed(1)}%`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Strain Card */}
          <Card className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#085983]/10">
                    <IconActivity className="h-4 w-4 text-[#085983]" />
                  </div>
                  <CardDescription className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983] text-[#085983]/80">
                    Weekly Strain
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <IconDots className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <IconSettings className="mr-2 h-4 w-4" />
                      Strain Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconTarget className="mr-2 h-4 w-4" />
                      Set Strain Goal
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CardTitle
                    className={cn(
                      "font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tabular-nums",
                      getScoreColor(
                        whoopStats.weeklyStrain?.averageStrain || null,
                        "strain"
                      )
                    )}
                  >
                    {whoopStats.weeklyStrain?.averageStrain
                      ? whoopStats.weeklyStrain.averageStrain.toFixed(1)
                      : "N/A"}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium text-[#085983]",
                      getTrendColor(whoopStats.trends.strainTrend)
                    )}
                  >
                    {getTrendIcon(whoopStats.trends.strainTrend)}
                    {whoopStats.trends.strainTrend === "up"
                      ? "High"
                      : whoopStats.trends.strainTrend === "down"
                      ? "Low"
                      : "Steady"}
                  </Badge>
                </div>

                {/* Strain target progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#085983]/60">
                      Weekly Target: 12.0
                    </span>
                    <span className="font-medium text-[#085983]">
                      {whoopStats.weeklyStrain?.averageStrain
                        ? `${Math.round(
                            getProgressValue(
                              whoopStats.weeklyStrain.averageStrain,
                              12
                            )
                          )}%`
                        : "0%"}
                    </span>
                  </div>
                  <Progress
                    value={getProgressValue(
                      whoopStats.weeklyStrain?.averageStrain || null,
                      12
                    )}
                    className="h-2"
                  />
                </div>
              </div>

              {/* Strain metrics */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <IconBolt className="h-3 w-3 text-[#085983]/60" />
                    <span className="text-[#085983]/60 text-xs">Peak</span>
                  </div>
                  <div className="font-medium text-[#085983] text-[#085983]">
                    {whoopStats.weeklyStrain?.maxStrain
                      ? whoopStats.weeklyStrain.maxStrain.toFixed(1)
                      : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <IconTarget className="h-3 w-3 text-[#085983]/60" />
                    <span className="text-[#085983]/60 text-xs">Workouts</span>
                  </div>
                  <div className="font-medium text-[#085983]">
                    {whoopStats.weeklyStrain?.totalWorkouts || 0}
                  </div>
                </div>
              </div>

              {/* Activity insight */}
              <div className="pt-2 border-t">
                <div className="flex justify-between text-xs">
                  <span className="text-[#085983]/60">Activity level:</span>
                  <span className="font-medium text-[#085983]">
                    {whoopStats.weeklyStrain?.averageStrain
                      ? whoopStats.weeklyStrain.averageStrain >= 15
                        ? "Very High"
                        : whoopStats.weeklyStrain.averageStrain >= 10
                        ? "Moderate"
                        : "Light"
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Profile Card */}
          <Card className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#085983]/10">
                    <IconUser className="h-4 w-4 text-[#085983]" />
                  </div>
                  <CardDescription className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983] text-[#085983]/80">
                    Health Profile
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <IconDots className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <IconSettings className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <IconShare className="mr-2 h-4 w-4" />
                      Export Profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <CardTitle className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#085983]">
                  {whoopUser?.firstName && whoopUser?.lastName
                    ? `${whoopUser.firstName} ${whoopUser.lastName}`
                    : user?.tier || "Member"}
                </CardTitle>
                <div className="font-[family-name:var(--font-geist-sans)] text-sm text-[#085983]/70">
                  {user?.profileCompleted
                    ? "Profile Complete"
                    : "Setup in Progress"}{" "}
                  •{" "}
                  {user?.tier
                    ? user.tier.replace("tier_", "Tier ")
                    : "Free Plan"}
                </div>
              </div>

              {/* Health Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <IconRuler2 className="h-3 w-3 text-[#085983]/60" />
                    <span className="text-[#085983]/60 text-xs">Height</span>
                  </div>
                  <div className="font-medium text-[#085983] text-[#085983]">
                    {user?.heightCm
                      ? `${user.heightCm} cm`
                      : whoopUser?.heightMeter
                      ? `${(whoopUser.heightMeter * 100).toFixed(0)} cm`
                      : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <IconScale className="h-3 w-3 text-[#085983]/60" />
                    <span className="text-[#085983]/60 text-xs">Weight</span>
                  </div>
                  <div className="font-medium text-[#085983] text-[#085983]">
                    {user?.weightKg
                      ? `${user.weightKg.toFixed(1)} kg`
                      : whoopUser?.weightKilogram
                      ? `${whoopUser.weightKilogram.toFixed(1)} kg`
                      : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <IconHeart className="h-3 w-3 text-[#085983]/60" />
                    <span className="text-[#085983]/60 text-xs">Max HR</span>
                  </div>
                  <div className="font-medium text-[#085983] text-[#085983]">
                    {whoopUser?.maxHeartRate
                      ? `${whoopUser.maxHeartRate} bpm`
                      : "N/A"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <IconTarget className="h-3 w-3 text-[#085983]/60" />
                    <span className="text-[#085983]/60 text-xs">Age</span>
                  </div>
                  <div className="font-medium text-[#085983] text-[#085983]">
                    {user?.dateOfBirth
                      ? `${Math.floor(
                          (Date.now() - new Date(user.dateOfBirth).getTime()) /
                            (365.25 * 24 * 60 * 60 * 1000)
                        )} yrs`
                      : "N/A"}
                  </div>
                </div>
              </div>

              {/* BMI Calculation */}
              {((user?.heightCm && user?.weightKg) ||
                (whoopUser?.heightMeter && whoopUser?.weightKilogram)) && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#085983]/60">BMI</span>
                    <span className="font-medium text-[#085983] text-[#085983]">
                      {(() => {
                        const height = user?.heightCm
                          ? user.heightCm / 100
                          : whoopUser?.heightMeter || 0;
                        const weight =
                          user?.weightKg || whoopUser?.weightKilogram || 0;
                        const bmi = weight / (height * height);
                        return isNaN(bmi) ? "N/A" : bmi.toFixed(1);
                      })()}
                    </span>
                  </div>
                  <Progress
                    value={(() => {
                      const height = user?.heightCm
                        ? user.heightCm / 100
                        : whoopUser?.heightMeter || 0;
                      const weight =
                        user?.weightKg || whoopUser?.weightKilogram || 0;
                      const bmi = weight / (height * height);
                      // Normalize BMI to 0-100 scale (18.5-25 = optimal range)
                      return Math.min(
                        Math.max(((bmi - 18.5) / (25 - 18.5)) * 100, 0),
                        100
                      );
                    })()}
                    className="h-2"
                  />
                </div>
              )}

              {/* Last sync info */}
              <div className="pt-2 border-t">
                <div className="flex justify-between text-xs">
                  <span className="text-[#085983]/60">Last WHOOP sync:</span>
                  <span className="font-medium text-[#085983] text-[#085983]">
                    {whoopUser?.lastSyncAt
                      ? new Date(whoopUser.lastSyncAt).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// Cursor rules applied correctly.
