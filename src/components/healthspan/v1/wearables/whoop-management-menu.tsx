"use client";

import { useState } from "react";
import {
  IconRefresh,
  IconUnlink,
  IconDownload,
  IconAlertTriangle,
  IconShield,
  IconDatabase,
  IconPlus,
  IconExternalLink,
  IconSettings,
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

interface WhoopManagementMenuProps {
  whoopUser?: {
    firstName?: string;
    lastName?: string;
    lastSyncAt?: Date | null;
  } | null;
  isConnected?: boolean;
  className?: string;
}

export function WhoopManagementMenu({
  whoopUser,
  isConnected = !!whoopUser,
  className,
}: WhoopManagementMenuProps) {
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preserveData, setPreserveData] = useState(true);

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

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/wearables/whoop/sync", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sync data");
      }

      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Sync error:", error);
      // You could add toast notification here
    } finally {
      setIsLoading(false);
    }
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

      // Refresh the page to show updated data
      window.location.reload();
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

  const handleExport = async (format: "json" | "csv") => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/wearables/whoop/export?format=${format}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `whoop-data-${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsLoading(false);
      setIsExportDialogOpen(false);
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
        <div className={cn("w-full p-8", className)}>
          <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs text-gray-500 border-gray-300"
              >
                <IconExternalLink className="mr-1 h-3 w-3" />
                Not Connected
              </Badge>
              <Button
                onClick={handleConnect}
                size="sm"
                disabled={isLoading}
                className="bg-[#085983] hover:bg-[#085983]/90 text-white"
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
      <div
        className={cn(
          "w-full bg-white border border-gray-200 rounded-lg p-4",
          className
        )}
      >
        <div className="flex items-center justify-between">
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
              <h3 className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#085983]">
                WHOOP Connected
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Last sync: {getLastSyncText()}</span>
                {whoopUser?.firstName && (
                  <span>
                    • {whoopUser.firstName} {whoopUser.lastName}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-xs text-[#085983] border-[#085983]/20"
            >
              <IconShield className="mr-1 h-3 w-3" />
              Connected
            </Badge>
            <Button
              onClick={handleSync}
              size="sm"
              variant="outline"
              disabled={isLoading}
              className="text-[#085983] border-[#085983]/20 hover:bg-[#085983]/5"
            >
              {isLoading ? (
                <IconRefresh className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <IconRefresh className="mr-2 h-4 w-4" />
              )}
              Sync
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  <IconSettings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleRefreshCache}
                  disabled={isLoading}
                >
                  <IconDatabase className="mr-2 h-4 w-4" />
                  Refresh Cache
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsExportDialogOpen(true)}>
                  <IconDownload className="mr-2 h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsDisconnectDialogOpen(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <IconUnlink className="mr-2 h-4 w-4" />
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

      {/* Export Data Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconDownload className="h-5 w-5 text-[#085983]" />
              Export WHOOP Data
            </DialogTitle>
            <DialogDescription className="text-left">
              Download your WHOOP data for backup or analysis purposes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700 font-medium">
                📋 Export Options
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Choose your preferred format for the data export.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleExport("json")}
                disabled={isLoading}
                className="h-16 flex-col gap-1"
              >
                <span className="font-medium">JSON</span>
                <span className="text-xs text-gray-500">Complete data</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("csv")}
                disabled={isLoading}
                className="h-16 flex-col gap-1"
              >
                <span className="font-medium">CSV</span>
                <span className="text-xs text-gray-500">Simplified format</span>
              </Button>
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
    </>
  );
}

// Cursor rules applied correctly.
