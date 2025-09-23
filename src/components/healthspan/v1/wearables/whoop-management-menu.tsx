"use client";

import { useState } from "react";
import {
  IconRefresh,
  IconUnlink,
  IconDownload,
  IconAlertTriangle,
  IconDatabase,
  IconPlus,
  IconExternalLink,
  IconSettings,
  IconChartBar,
  IconActivity,
  IconMoon,
  IconHeart,
  IconTrashX,
  IconShieldCheckFilled,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface WhoopUser {
  firstName?: string;
  lastName?: string;
  lastSyncAt?: Date | null;
  email?: string;
  whoopUserId?: number;
  connectedAt?: Date | null;
}

interface WhoopManagementMenuProps {
  whoopUser?: WhoopUser | null;
  isConnected?: boolean;
  className?: string;
  onDataUpdate?: () => void; // Callback for when data is updated
}

export function WhoopManagementMenu({
  whoopUser,
  isConnected = !!whoopUser,
  className,
  onDataUpdate,
}: WhoopManagementMenuProps) {
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isDataExplorerDialogOpen, setIsDataExplorerDialogOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preserveData, setPreserveData] = useState(true);
  const [syncStatus, setSyncStatus] = useState<{
    inProgress: boolean;
    lastResult?: {
      recovery: number;
      cycles: number;
      sleep: number;
      workouts: number;
      errors: string[];
    };
  }>({ inProgress: false });

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Redirect to WHOOP OAuth flow
      window.location.href = "/api/wearables/whoop/auth";
    } catch (error) {
      console.error("Connection error:", error);
      setIsLoading(false);
    }
  };

  const handleSync = async (options?: {
    timeline?: string;
    dataType?: string;
  }) => {
    setIsLoading(true);
    setSyncStatus({ inProgress: true });

    try {
      // Build sync URL with parameters
      const params = new URLSearchParams();
      if (options?.timeline)
        params.append("days", getTimelineDays(options.timeline).toString());
      if (options?.dataType && options.dataType !== "all")
        params.append("type", options.dataType);

      const url = `/api/wearables/whoop/sync${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sync data");
      }

      const result = await response.json();
      setSyncStatus({
        inProgress: false,
        lastResult: result.synced,
      });

      // Call the callback to refresh parent component data
      onDataUpdate?.();

      // Show success feedback
      console.log("Sync completed successfully:", result);
    } catch (error) {
      console.error("Sync error:", error);
      setSyncStatus({ inProgress: false });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert timeline to days
  const getTimelineDays = (timeline: string): number => {
    const timelineMap: Record<string, number> = {
      "1d": 1,
      "3d": 3,
      "1w": 7,
      "2w": 14,
      "1m": 30,
      "2m": 60,
    };
    return timelineMap[timeline] || 7;
  };

  const handleRefreshCache = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/wearables/whoop/refresh", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh cache");
      }

      // Call the callback to refresh parent component data
      onDataUpdate?.();
      console.log("Cache refreshed successfully");
    } catch (error) {
      console.error("Cache refresh error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/wearables/whoop/disconnect?preserve_data=${preserveData}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to disconnect");
      }

      // Redirect to main healthspan page
      window.location.href = "/healthspan";
    } catch (error) {
      console.error("Disconnect error:", error);
    } finally {
      setIsLoading(false);
      setIsDisconnectDialogOpen(false);
    }
  };

  const handleExport = async (options: {
    format: "json" | "csv";
    timeline?: string;
    dataType?: string;
  }) => {
    setIsLoading(true);
    try {
      // Build export URL with enhanced parameters
      const params = new URLSearchParams();
      params.append("format", options.format);
      if (options.timeline) params.append("timeline", options.timeline);
      if (options.dataType && options.dataType !== "all") {
        // Use individual data type endpoints for better performance
        const endpoint = `/api/wearables/whoop/${
          options.dataType
        }?${params.toString()}`;
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to export data");
        }

        const blob = await response.blob();
        downloadFile(blob, options.format, options.dataType, options.timeline);
      } else {
        // Use timeline endpoint for all data types
        const timelineParam = options.timeline || "1m";
        const endpoint = `/api/wearables/whoop/timeline/${timelineParam}?format=${options.format}`;
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to export data");
        }

        const blob = await response.blob();
        downloadFile(blob, options.format, "timeline", timelineParam);
      }

      console.log("Export completed successfully");
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsLoading(false);
      setIsExportDialogOpen(false);
    }
  };

  const downloadFile = (
    blob: Blob,
    format: string,
    type: string,
    timeline?: string
  ) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `whoop-${type}${timeline ? `-${timeline}` : ""}-${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // New function to handle data exploration
  const handleDataExploration = async (dataType: string, timeline: string) => {
    try {
      const response = await fetch(
        `/api/wearables/whoop/${dataType}?timeline=${timeline}&limit=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      console.log(`${dataType} data preview:`, data);
      // You could show this in a modal or navigate to a dedicated page
      alert(
        `Found ${data.metadata.counts.total} ${dataType} records for ${timeline}`
      );
    } catch (error) {
      console.error("Data exploration error:", error);
    }
  };

  const getLastSyncText = () => {
    if (!whoopUser?.lastSyncAt) return "Never synced";

    const now = new Date();
    const syncDate = new Date(whoopUser.lastSyncAt);
    const diffMinutes = Math.floor(
      (now.getTime() - syncDate.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
  };

  // Different views based on connection status
  if (!isConnected) {
    return (
      <>
        <div className={cn("w-full p-4 sm:p-6 md:p-8", className)}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#085983]/10">
                <Image
                  src="/brands/whoop.svg"
                  alt="WHOOP"
                  width={24}
                  height={24}
                />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-gray-900">
                  Connect WHOOP
                </h3>
                <p className="text-xs text-gray-500">
                  Track recovery, sleep, and strain data
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 w-full sm:w-auto">
              <Badge
                variant="outline"
                className="text-xs text-gray-500 border-gray-300 justify-center sm:justify-start"
              >
                <IconExternalLink className="mr-1 h-3 w-3" />
                Not Connected
              </Badge>
              <Button
                onClick={handleConnect}
                size="sm"
                disabled={isLoading}
                className="bg-[#085983] hover:bg-[#085983]/90 text-white w-full sm:w-auto h-10 sm:h-8"
              >
                {isLoading ? (
                  <IconRefresh className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <IconPlus className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Connecting..." : "Connect"}
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={cn("w-full px-4 sm:px-6 md:px-8", className)}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-[#085983]/10 flex-shrink-0">
              <Image
                src="/brands/whoop.svg"
                alt="WHOOP"
                width={24}
                height={24}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983]">
                WHOOP Connected
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs text-gray-500">
                <span className="truncate">Last sync: {getLastSyncText()}</span>
                {whoopUser?.firstName && (
                  <span className="truncate">
                    <span className="hidden sm:inline">•</span>{" "}
                    {whoopUser.firstName} {whoopUser.lastName}
                  </span>
                )}
                {syncStatus.lastResult && (
                  <span className="text-green-600 truncate">
                    <span className="hidden sm:inline">•</span>{" "}
                    {syncStatus.lastResult.recovery +
                      syncStatus.lastResult.cycles +
                      syncStatus.lastResult.sleep +
                      syncStatus.lastResult.workouts}{" "}
                    records
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Badge
              variant="outline"
              className="text-xs text-[#085983] border-[#085983]/20"
            >
              <IconShieldCheckFilled className="mr-1 h-3 w-3 text-green-600" />
              Connected
            </Badge>
            <Button
              onClick={() => handleSync()}
              size="sm"
              variant="ghost"
              disabled={isLoading || syncStatus.inProgress}
              className="text-[#085983] h-10 sm:h-8"
            >
              {isLoading || syncStatus.inProgress ? (
                <IconRefresh className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <IconRefresh className="mr-2 h-4 w-4" />
              )}
              {syncStatus.inProgress ? "Syncing..." : "Sync"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isLoading}
                  className="text-[#085983] h-10 sm:h-8"
                >
                  <IconSettings className="h-4 w-4" />
                  <span className="ml-2 sm:hidden">Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 mr-2 sm:mr-2 mx-4 sm:mx-0"
              >
                {/* Sync Options */}
                <DropdownMenuItem
                  onClick={() => handleSync({ timeline: "1d" })}
                  disabled={isLoading || syncStatus.inProgress}
                >
                  <IconRefresh className="mr-2 h-4 w-4" />
                  Sync Last Day
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSync({ timeline: "1w" })}
                  disabled={isLoading || syncStatus.inProgress}
                >
                  <IconRefresh className="mr-2 h-4 w-4" />
                  Sync Last Week
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Cache & Export */}
                <DropdownMenuItem
                  onClick={handleRefreshCache}
                  disabled={isLoading}
                >
                  <IconDatabase className="mr-2 h-4 w-4" />
                  Refresh Cache
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsExportDialogOpen(true)}>
                  <IconDownload className="mr-2 h-4 w-4" />
                  Export Data
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* Disconnect */}
                <DropdownMenuItem
                  onClick={() => setIsDisconnectDialogOpen(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <IconTrashX className="mr-2 h-4 w-4 text-red-600" />
                  Delete data
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDisconnectDialogOpen(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <IconUnlink className="mr-2 h-4 w-4 text-red-600" />
                  Disconnect WHOOP
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Disconnect Confirmation Dialog */}
      <Dialog
        open={isDisconnectDialogOpen}
        onOpenChange={setIsDisconnectDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconAlertTriangle className="h-5 w-5 text-red-500" />
              Disconnect WHOOP Account
            </DialogTitle>
            <DialogDescription className="text-left">
              Are you sure you want to disconnect your WHOOP account? This
              action will remove access to your WHOOP data.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700 font-medium">⚠️ Important</p>
              <p className="text-sm text-red-600 mt-1">
                You can choose whether to preserve your historical data or
                remove it completely.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  id="preserve"
                  name="data-option"
                  checked={preserveData}
                  onChange={() => setPreserveData(true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor="preserve"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Preserve historical data
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Keep your WHOOP data for reference, but remove access tokens
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  id="remove"
                  name="data-option"
                  checked={!preserveData}
                  onChange={() => setPreserveData(false)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor="remove"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Remove all data
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Permanently delete all WHOOP data and access tokens
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDisconnectDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDisconnect}
              disabled={isLoading}
            >
              {isLoading ? "Disconnecting..." : "Disconnect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Export Data Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconDownload className="h-5 w-5 text-[#085983]" />
              Export WHOOP Data
            </DialogTitle>
            <DialogDescription className="text-left">
              Download your WHOOP data with customizable options for analysis.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Timeline Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Time Period
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {["1w", "2w", "1m"].map((timeline) => (
                  <Button
                    key={timeline}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleExport({
                        format: "json",
                        timeline,
                        dataType: "all",
                      })
                    }
                    disabled={isLoading}
                    className="text-xs h-10 sm:h-8"
                  >
                    {timeline === "1w"
                      ? "Last Week"
                      : timeline === "2w"
                      ? "2 Weeks"
                      : "1 Month"}
                  </Button>
                ))}
              </div>
            </div>

            {/* Data Type Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Data Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: "sleep", label: "Sleep", icon: IconMoon },
                  { key: "recovery", label: "Recovery", icon: IconHeart },
                  { key: "cycles", label: "Cycles", icon: IconRefresh },
                  { key: "workouts", label: "Workouts", icon: IconActivity },
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleExport({
                        format: "json",
                        timeline: "1w",
                        dataType: key,
                      })
                    }
                    disabled={isLoading}
                    className="flex items-center gap-2 text-xs h-12 sm:h-12"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Export Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleExport({
                      format: "json",
                      timeline: "1w",
                      dataType: "all",
                    })
                  }
                  disabled={isLoading}
                  className="h-16 flex-col gap-1"
                >
                  <span className="font-medium">JSON</span>
                  <span className="text-xs text-gray-500">Complete data</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleExport({
                      format: "csv",
                      timeline: "1w",
                      dataType: "all",
                    })
                  }
                  disabled={isLoading}
                  className="h-16 flex-col gap-1"
                >
                  <span className="font-medium">CSV</span>
                  <span className="text-xs text-gray-500">
                    Simplified format
                  </span>
                </Button>
              </div>
            </div>

            {/* Quick Export Options */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 font-medium mb-2">
                Quick Export
              </p>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleExport({
                      format: "csv",
                      timeline: "1m",
                      dataType: "all",
                    })
                  }
                  disabled={isLoading}
                  className="w-full text-xs h-10 sm:h-8"
                >
                  📊 Complete 1-Month CSV Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleExport({
                      format: "json",
                      timeline: "2m",
                      dataType: "all",
                    })
                  }
                  disabled={isLoading}
                  className="w-full text-xs h-10 sm:h-8"
                >
                  💾 Full 2-Month Data Backup (JSON)
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExportDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Explorer Dialog */}
      <Dialog
        open={isDataExplorerDialogOpen}
        onOpenChange={setIsDataExplorerDialogOpen}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconChartBar className="h-5 w-5 text-[#085983]" />
              WHOOP Data Explorer
            </DialogTitle>
            <DialogDescription className="text-left">
              Quick access to your WHOOP data with timeline filtering and
              insights.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quick Stats */}
            {syncStatus.lastResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium mb-2">
                  Last Sync Results
                </p>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-green-800">
                      {syncStatus.lastResult.recovery}
                    </div>
                    <div className="text-green-600">Recovery</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-800">
                      {syncStatus.lastResult.cycles}
                    </div>
                    <div className="text-green-600">Cycles</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-800">
                      {syncStatus.lastResult.sleep}
                    </div>
                    <div className="text-green-600">Sleep</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-800">
                      {syncStatus.lastResult.workouts}
                    </div>
                    <div className="text-green-600">Workouts</div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Exploration Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Timeline Options */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Explore by Timeline
                </label>
                <div className="space-y-2">
                  {[
                    { key: "1d", label: "Last Day", desc: "Recent activity" },
                    { key: "1w", label: "Last Week", desc: "Weekly trends" },
                    {
                      key: "1m",
                      label: "Last Month",
                      desc: "Monthly patterns",
                    },
                  ].map(({ key, label, desc }) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => handleDataExploration("sleep", key)}
                      className="w-full justify-start text-left h-auto p-3 min-h-[3rem]"
                    >
                      <div>
                        <div className="font-medium text-xs">{label}</div>
                        <div className="text-xs text-gray-500">{desc}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Data Type Options */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Explore by Data Type
                </label>
                <div className="space-y-2">
                  {[
                    {
                      key: "sleep",
                      label: "Sleep Analysis",
                      icon: IconMoon,
                      desc: "Sleep stages & quality",
                    },
                    {
                      key: "recovery",
                      label: "Recovery Trends",
                      icon: IconHeart,
                      desc: "HRV & recovery scores",
                    },
                    {
                      key: "workouts",
                      label: "Workout Performance",
                      icon: IconActivity,
                      desc: "Training load & zones",
                    },
                  ].map(({ key, label, icon: Icon, desc }) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => handleDataExploration(key, "1w")}
                      className="w-full justify-start text-left h-auto p-3 min-h-[3rem]"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#085983]" />
                        <div>
                          <div className="font-medium text-xs">{label}</div>
                          <div className="text-xs text-gray-500">{desc}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Features */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm font-medium mb-3">Advanced Data Features</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleSync({ timeline: "1m", dataType: "all" })
                  }
                  disabled={isLoading || syncStatus.inProgress}
                  className="text-xs h-10 sm:h-8"
                >
                  🔄 Sync Last Month
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleExport({
                      format: "csv",
                      timeline: "2w",
                      dataType: "all",
                    })
                  }
                  disabled={isLoading}
                  className="text-xs h-10 sm:h-8"
                >
                  📊 Export 2-Week CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDataExploration("recovery", "1m")}
                  className="text-xs h-10 sm:h-8"
                >
                  📈 Monthly Recovery
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDataExploration("workouts", "2w")}
                  className="text-xs h-10 sm:h-8"
                >
                  🏃‍♂️ Training Analysis
                </Button>
              </div>
            </div>

            {/* Connection Info */}
            {whoopUser && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700 font-medium">
                  Connection Details
                </p>
                <div className="mt-1 text-xs text-blue-600 space-y-1">
                  <div>
                    User: {whoopUser.firstName} {whoopUser.lastName}
                  </div>
                  {whoopUser.email && <div>Email: {whoopUser.email}</div>}
                  <div>Last Sync: {getLastSyncText()}</div>
                  {whoopUser.connectedAt && (
                    <div>
                      Connected:{" "}
                      {new Date(whoopUser.connectedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDataExplorerDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Cursor rules applied correctly.
