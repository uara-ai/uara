import {
  IconTrendingDown,
  IconTrendingUp,
  IconActivity,
  IconMoon,
  IconHeart,
  IconZzz,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WhoopDataResponse, WhoopStats } from "@/actions/whoop-data-action";

interface WhoopCardsProps {
  whoopData: WhoopDataResponse | null;
  whoopStats: WhoopStats | null;
}

export function WhoopCards({ whoopData, whoopStats }: WhoopCardsProps) {
  const formatTime = (milliseconds: number | null): string => {
    if (!milliseconds) return "N/A";
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <IconTrendingUp className="text-green-500" />;
      case "down":
        return <IconTrendingDown className="text-red-500" />;
      default:
        return <IconActivity className="text-gray-500" />;
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
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

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Recovery Score Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Recovery Score</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {whoopStats.latestRecovery?.recoveryScore
              ? `${Math.round(whoopStats.latestRecovery.recoveryScore)}%`
              : "N/A"}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={getTrendColor(whoopStats.trends.recoveryTrend)}
            >
              {getTrendIcon(whoopStats.trends.recoveryTrend)}
              {whoopStats.trends.recoveryTrend === "up"
                ? "Improving"
                : whoopStats.trends.recoveryTrend === "down"
                ? "Declining"
                : "Stable"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconHeart className="size-4" />
            {whoopStats.latestRecovery?.restingHeartRate
              ? `${whoopStats.latestRecovery.restingHeartRate} bpm RHR`
              : "No RHR data"}
          </div>
          <div className="text-muted-foreground">
            {whoopStats.latestRecovery?.hrvRmssd
              ? `HRV: ${Math.round(whoopStats.latestRecovery.hrvRmssd)}ms`
              : "Latest recovery metrics"}
          </div>
        </CardFooter>
      </Card>

      {/* Sleep Performance Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Sleep Performance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {whoopStats.latestSleep?.sleepPerformancePercentage
              ? `${Math.round(
                  whoopStats.latestSleep.sleepPerformancePercentage
                )}%`
              : "N/A"}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={getTrendColor(whoopStats.trends.sleepTrend)}
            >
              {getTrendIcon(whoopStats.trends.sleepTrend)}
              {whoopStats.trends.sleepTrend === "up"
                ? "Better Sleep"
                : whoopStats.trends.sleepTrend === "down"
                ? "Poor Sleep"
                : "Consistent"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconMoon className="size-4" />
            Sleep Efficiency:{" "}
            {whoopStats.latestSleep?.sleepEfficiencyPercentage
              ? `${Math.round(
                  whoopStats.latestSleep.sleepEfficiencyPercentage
                )}%`
              : "N/A"}
          </div>
          <div className="text-muted-foreground">
            {whoopStats.latestSleep?.totalInBedTime
              ? `Time in bed: ${formatTime(
                  whoopStats.latestSleep.totalInBedTime
                )}`
              : "Latest sleep metrics"}
          </div>
        </CardFooter>
      </Card>

      {/* Weekly Strain Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Weekly Strain</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {whoopStats.weeklyStrain?.averageStrain
              ? whoopStats.weeklyStrain.averageStrain.toFixed(1)
              : "N/A"}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={getTrendColor(whoopStats.trends.strainTrend)}
            >
              {getTrendIcon(whoopStats.trends.strainTrend)}
              {whoopStats.trends.strainTrend === "up"
                ? "High Activity"
                : whoopStats.trends.strainTrend === "down"
                ? "Low Activity"
                : "Steady"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <IconActivity className="size-4" />
            Peak:{" "}
            {whoopStats.weeklyStrain?.maxStrain
              ? whoopStats.weeklyStrain.maxStrain.toFixed(1)
              : "N/A"}
          </div>
          <div className="text-muted-foreground">
            {whoopStats.weeklyStrain?.totalWorkouts
              ? `${whoopStats.weeklyStrain.totalWorkouts} workouts this period`
              : "Weekly strain average"}
          </div>
        </CardFooter>
      </Card>

      {/* Data Summary Card */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Data Summary</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {whoopData._metadata?.counts
              ? Object.values(whoopData._metadata.counts).reduce(
                  (a, b) => a + b,
                  0
                )
              : 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconZzz className="size-3" />
              Records
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Data Breakdown
          </div>
          <div className="text-muted-foreground text-xs">
            {whoopData._metadata?.counts && (
              <div className="space-y-1">
                <div>Recovery: {whoopData._metadata.counts.recovery}</div>
                <div>Sleep: {whoopData._metadata.counts.sleep}</div>
                <div>Cycles: {whoopData._metadata.counts.cycles}</div>
                <div>Workouts: {whoopData._metadata.counts.workouts}</div>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Cursor rules applied correctly.
