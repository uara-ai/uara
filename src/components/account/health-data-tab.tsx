"use client";

import { useState } from "react";
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
  Activity,
  Database,
  Download,
  Upload,
  Trash2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

export function HealthDataTab() {
  const [settings, setSettings] = useState({
    dataSyncEnabled: true,
    autoBackup: true,
    shareWithResearchers: false,
    exportNotifications: true,
    retentionPeriod: "5_years",
  });

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
    <div className="space-y-6">
      {/* Data Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Wearable Device Integration
          </CardTitle>
          <CardDescription>
            Manage how your health data is collected and synchronized from
            wearable devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-sync">Automatic Data Sync</Label>
              <p className="text-sm text-muted-foreground">
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

          <Separator />

          <div className="space-y-3">
            <Label>Connected Devices</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium">WHOOP 4.0</p>
                    <p className="text-sm text-muted-foreground">
                      Last sync: 2 hours ago
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Connected</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">Oura Ring</p>
                    <p className="text-sm text-muted-foreground">
                      Not connected
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Sharing
          </CardTitle>
          <CardDescription>
            Control how your health data is used and shared.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="research-sharing">Share with Research</Label>
              <p className="text-sm text-muted-foreground">
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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="export-notifications">Export Notifications</Label>
              <p className="text-sm text-muted-foreground">
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

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Backup, export, and manage your health data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-backup">Automatic Backup</Label>
              <p className="text-sm text-muted-foreground">
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

          <Separator />

          <div className="space-y-3">
            <Label>Data Retention</Label>
            <div className="flex items-center gap-2">
              <Label htmlFor="retention-period" className="text-sm">
                Keep data for:
              </Label>
              <select
                id="retention-period"
                value={settings.retentionPeriod}
                onChange={(e) =>
                  handleSettingChange("retentionPeriod", e.target.value)
                }
                className="flex h-9 w-32 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="1_year">1 year</option>
                <option value="2_years">2 years</option>
                <option value="5_years">5 years</option>
                <option value="forever">Forever</option>
              </select>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export All Data
            </Button>

            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Data
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteData}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lab Data Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Lab Results
          </CardTitle>
          <CardDescription>
            Upload and manage your laboratory test results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Upload Lab Results</p>
            <p className="text-xs text-muted-foreground mb-3">
              Drag and drop PDF or CSV files here, or click to browse
            </p>
            <Button variant="outline" size="sm">
              Choose Files
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Recent Uploads</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center">
                    <Database className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm">Complete_Blood_Panel_2024.pdf</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Processed
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Cursor rules applied correctly.
