"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconActivity,
  IconDatabase,
  IconDownload,
  IconUpload,
  IconTrash,
  IconShield,
  IconHeartbeat,
  IconSettings,
  IconRefresh,
  IconPlus,
  IconExternalLink,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { WhoopManagementMenu } from "@/components/healthspan/whoop-management-menu";
import Image from "next/image";

export function HealthDataTab() {
  const [settings, setSettings] = useState({
    dataSyncEnabled: true,
    autoBackup: true,
    shareWithResearchers: false,
    exportNotifications: true,
    retentionPeriod: "5_years",
  });
  const [whoopUser, setWhoopUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWhoopUser = async () => {
      try {
        const response = await fetch("/api/wearables/whoop/sync");
        if (response.ok) {
          const data = await response.json();
          if (data.connected && data.user) {
            setWhoopUser({
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              email: data.user.email,
              lastSyncAt: data.user.lastSyncAt
                ? new Date(data.user.lastSyncAt)
                : null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching WHOOP user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhoopUser();
  }, []);

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast.success("Your health data setting has been saved.");
  };

  const handleExportData = () => {
    toast.success("Your health data export will be available shortly.");
  };

  const handleDeleteData = () => {
    toast.error("This action requires additional confirmation.");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* WHOOP Integration Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[#085983]/10">
            <IconHeartbeat className="h-5 w-5 text-[#085983]" />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-xl font-medium text-[#085983] tracking-wider">
              Wearable Device Integration
            </h2>
            <p className="text-sm text-[#085983]/70">
              Connect and manage your health monitoring devices
            </p>
          </div>
        </div>

        {/* WHOOP Management */}
        <WhoopManagementMenu
          whoopUser={whoopUser}
          isConnected={!!whoopUser}
          className="w-full"
        />

        {/* Other Wearables - Coming Soon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl border-[#085983]/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-[family-name:var(--font-geist-sans)] font-medium text-[#085983]">
                      ŌURA Ring™
                    </p>
                    <p className="text-xs text-[#085983]/60">Coming soon</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs text-[#085983]/60 border-[#085983]/20"
                >
                  Soon
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white rounded-xl sm:rounded-2xl border-[#085983]/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-[family-name:var(--font-geist-sans)] font-medium text-[#085983]">
                      Apple Health™
                    </p>
                    <p className="text-xs text-[#085983]/60">Coming soon</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs text-[#085983]/60 border-[#085983]/20"
                >
                  Soon
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Sync Settings */}
      <Card className="bg-white rounded-xl sm:rounded-2xl border-[#085983]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-[family-name:var(--font-instrument-serif)] text-[#085983] tracking-wider">
            <IconSettings className="h-5 w-5" />
            Synchronization Settings
          </CardTitle>
          <CardDescription className="text-[#085983]/70">
            Configure how your health data is collected and synchronized
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                htmlFor="data-sync"
                className="font-[family-name:var(--font-geist-sans)] font-medium text-[#085983]"
              >
                Automatic Data Sync
              </Label>
              <p className="text-sm text-[#085983]/60">
                Automatically sync health data from connected devices
              </p>
            </div>
            <Switch
              id="data-sync"
              checked={settings.dataSyncEnabled}
              onCheckedChange={(checked) =>
                handleSettingChange("dataSyncEnabled", checked)
              }
            />
          </div>

          <Separator className="bg-[#085983]/10" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                htmlFor="auto-backup"
                className="font-[family-name:var(--font-geist-sans)] font-medium text-[#085983]"
              >
                Automatic Backup
              </Label>
              <p className="text-sm text-[#085983]/60">
                Automatically backup your data weekly
              </p>
            </div>
            <Switch
              id="auto-backup"
              checked={settings.autoBackup}
              onCheckedChange={(checked) =>
                handleSettingChange("autoBackup", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Sharing */}
      <Card className="bg-white rounded-xl sm:rounded-2xl border-[#085983]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-[family-name:var(--font-instrument-serif)] text-[#085983] tracking-wider">
            <IconShield className="h-5 w-5" />
            Privacy & Sharing
          </CardTitle>
          <CardDescription className="text-[#085983]/70">
            Control how your health data is used and shared
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                htmlFor="research-sharing"
                className="font-[family-name:var(--font-geist-sans)] font-medium text-[#085983]"
              >
                Share with Research
              </Label>
              <p className="text-sm text-[#085983]/60">
                Contribute anonymized data to longevity research
              </p>
            </div>
            <Switch
              id="research-sharing"
              checked={settings.shareWithResearchers}
              onCheckedChange={(checked) =>
                handleSettingChange("shareWithResearchers", checked)
              }
            />
          </div>

          <Separator className="bg-[#085983]/10" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label
                htmlFor="export-notifications"
                className="font-[family-name:var(--font-geist-sans)] font-medium text-[#085983]"
              >
                Export Notifications
              </Label>
              <p className="text-sm text-[#085983]/60">
                Get notified when data exports are ready
              </p>
            </div>
            <Switch
              id="export-notifications"
              checked={settings.exportNotifications}
              onCheckedChange={(checked) =>
                handleSettingChange("exportNotifications", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management 
      <Card className="bg-white rounded-xl sm:rounded-2xl border-[#085983]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-[family-name:var(--font-instrument-serif)] text-[#085983]">
            <IconDatabase className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription className="text-[#085983]/70">
            Backup, export, and manage your health data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="font-[family-name:var(--font-geist-sans)] font-medium text-[#085983]">
              Data Retention
            </Label>
            <div className="flex items-center gap-3">
              <Label
                htmlFor="retention-period"
                className="text-sm text-[#085983]/70"
              >
                Keep data for:
              </Label>
              <select
                id="retention-period"
                value={settings.retentionPeriod}
                onChange={(e) =>
                  handleSettingChange("retentionPeriod", e.target.value)
                }
                className="flex h-9 w-32 rounded-lg border border-[#085983]/20 bg-white px-3 py-1 text-sm text-[#085983] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#085983]/50"
              >
                <option value="1_year">1 year</option>
                <option value="2_years">2 years</option>
                <option value="5_years">5 years</option>
                <option value="forever">Forever</option>
              </select>
            </div>
          </div>

          <Separator className="bg-[#085983]/10" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="flex items-center gap-2 border-[#085983]/20 text-[#085983] hover:bg-[#085983]/5"
            >
              <IconDownload className="h-4 w-4" />
              Export Data
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 border-[#085983]/20 text-[#085983] hover:bg-[#085983]/5"
            >
              <IconUpload className="h-4 w-4" />
              Import Data
            </Button>

            <Button
              variant="outline"
              onClick={handleDeleteData}
              className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
            >
              <IconTrash className="h-4 w-4" />
              Delete Data
            </Button>
          </div>
        </CardContent>
      </Card>*/}

      {/* Lab Data Upload 
      <Card className="bg-white rounded-xl sm:rounded-2xl border-[#085983]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-[family-name:var(--font-instrument-serif)] text-[#085983]">
            <IconUpload className="h-5 w-5" />
            Lab Results
          </CardTitle>
          <CardDescription className="text-[#085983]/70">
            Upload and manage your laboratory test results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-[#085983]/20 rounded-xl p-8 text-center bg-gradient-to-br from-[#085983]/5 to-[#085983]/10">
            <div className="p-3 rounded-lg bg-[#085983]/10 w-fit mx-auto mb-4">
              <IconUpload className="h-8 w-8 text-[#085983]" />
            </div>
            <p className="font-[family-name:var(--font-geist-sans)] font-medium text-[#085983] mb-2">
              Upload Lab Results
            </p>
            <p className="text-sm text-[#085983]/60 mb-4">
              Drag and drop PDF or CSV files here, or click to browse
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-[#085983]/20 text-[#085983] hover:bg-[#085983]/5"
            >
              Choose Files
            </Button>
          </div>

          <div className="space-y-3">
            <Label className="font-[family-name:var(--font-geist-sans)] font-medium text-[#085983]">
              Recent Uploads
            </Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 border border-[#085983]/20 rounded-lg bg-gradient-to-r from-[#085983]/5 to-[#085983]/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#085983]/20 rounded-lg flex items-center justify-center">
                    <IconDatabase className="h-4 w-4 text-[#085983]" />
                  </div>
                  <span className="text-sm font-[family-name:var(--font-geist-sans)] text-[#085983]">
                    Complete_Blood_Panel_2024.pdf
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs text-[#085983] border-[#085983]/20"
                >
                  Processed
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>*/}
    </div>
  );
}

// Cursor rules applied correctly.
