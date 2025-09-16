"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Settings,
  Activity,
  Heart,
  Moon,
  Dumbbell,
  Webhook,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
} from "lucide-react";

interface WhoopConnection {
  connected: boolean;
  user?: {
    whoopUserId: number;
    email: string;
    firstName: string;
    lastName: string;
    lastSyncAt: string | null;
    connectedAt: string;
  };
  dataCounts?: {
    recovery: number;
    cycles: number;
    sleep: number;
    workouts: number;
  };
}

interface SyncResult {
  success: boolean;
  synced?: {
    recovery: number;
    cycles: number;
    sleep: number;
    workouts: number;
    errors: string[];
  };
  period?: {
    start: string;
    end: string;
    days: number;
  };
  error?: string;
}

interface WhoopData {
  recovery: any[];
  cycles: any[];
  sleep: any[];
  workouts: any[];
}

export default function WhoopDebugPage() {
  const [connection, setConnection] = useState<WhoopConnection | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [whoopData, setWhoopData] = useState<WhoopData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showTokens, setShowTokens] = useState(false);

  // Sync parameters
  const [syncDays, setSyncDays] = useState("7");
  const [syncType, setSyncType] = useState("all");

  // Test webhook parameters
  const [webhookEventType, setWebhookEventType] = useState("recovery.updated");
  const [webhookUserId, setWebhookUserId] = useState("");
  const [webhookDataId, setWebhookDataId] = useState("");

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]); // Keep last 50 logs
  };

  const checkConnection = async () => {
    try {
      addLog("Checking WHOOP connection status...");
      const response = await fetch("/api/wearables/whoop/sync");

      if (response.status === 404) {
        setConnection({ connected: false });
        addLog("WHOOP not connected");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setConnection(data);
      addLog(`WHOOP connected: ${data.user?.email || "Unknown user"}`);
    } catch (error) {
      addLog(`Connection check failed: ${error}`);
      setConnection({ connected: false });
    }
  };

  const connectWhoop = () => {
    addLog("Initiating WHOOP OAuth flow...");
    window.location.href = "/api/wearables/whoop/auth";
  };

  const syncData = async () => {
    setLoading(true);
    setSyncResult(null);

    try {
      addLog(`Starting data sync: ${syncDays} days, type: ${syncType}`);
      const response = await fetch(
        `/api/wearables/whoop/sync?days=${syncDays}&type=${syncType}`,
        { method: "POST" }
      );

      const result = await response.json();
      setSyncResult(result);

      if (result.success) {
        addLog(`Sync completed: ${JSON.stringify(result.synced)}`);
        await checkConnection(); // Refresh connection status
      } else {
        addLog(`Sync failed: ${result.error}`);
      }
    } catch (error) {
      addLog(`Sync error: ${error}`);
      setSyncResult({ success: false, error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const fetchWhoopData = async () => {
    setLoading(true);

    try {
      addLog("Fetching WHOOP data from database...");
      // Note: You'll need to create this endpoint
      const response = await fetch("/api/wearables/whoop/data");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setWhoopData(data);
      addLog(
        `Fetched data: ${data.recovery?.length || 0} recovery, ${
          data.sleep?.length || 0
        } sleep records`
      );
    } catch (error) {
      addLog(`Data fetch error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testWebhook = async () => {
    if (!webhookUserId || !webhookDataId) {
      addLog("Please provide webhook user ID and data ID");
      return;
    }

    setLoading(true);

    try {
      addLog(`Testing webhook: ${webhookEventType} for user ${webhookUserId}`);

      const webhookPayload = {
        id: `evt_test_${Date.now()}`,
        type: webhookEventType,
        data: {
          user_id: parseInt(webhookUserId),
          id: parseInt(webhookDataId),
        },
        created_at: new Date().toISOString(),
      };

      // Create HMAC signature for testing
      const response = await fetch("/api/wearables/whoop/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Whoop-Signature": "sha256=test_signature", // In real testing, you'd generate this
        },
        body: JSON.stringify(webhookPayload),
      });

      if (response.ok) {
        addLog("Webhook test successful");
      } else {
        addLog(`Webhook test failed: HTTP ${response.status}`);
      }
    } catch (error) {
      addLog(`Webhook test error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWhoop = async (preserveData: boolean) => {
    setLoading(true);

    try {
      addLog(`Disconnecting WHOOP (preserve data: ${preserveData})...`);
      const response = await fetch(
        `/api/wearables/whoop/disconnect?preserve_data=${preserveData}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (result.success) {
        addLog(`Disconnected: ${result.message}`);
        await checkConnection();
      } else {
        addLog(`Disconnect failed: ${result.error}`);
      }
    } catch (error) {
      addLog(`Disconnect error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      addLog("Exporting WHOOP data...");
      const response = await fetch("/api/wearables/whoop/export");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `whoop-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      addLog("Data exported successfully");
    } catch (error) {
      addLog(`Export error: ${error}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog("Copied to clipboard");
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("Logs cleared");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WHOOP Integration Debug</h1>
          <p className="text-muted-foreground">
            Developer tools for testing and debugging WHOOP API integration
          </p>
        </div>
        <Badge variant={connection?.connected ? "default" : "destructive"}>
          {connection?.connected ? "Connected" : "Disconnected"}
        </Badge>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {connection?.connected ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Connected to WHOOP</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">User</Label>
                  <p className="font-medium">
                    {connection.user?.firstName} {connection.user?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {connection.user?.email}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    WHOOP User ID
                  </Label>
                  <p className="font-mono">{connection.user?.whoopUserId}</p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    Connected
                  </Label>
                  <p>
                    {connection.user?.connectedAt
                      ? new Date(connection.user.connectedAt).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">
                    Last Sync
                  </Label>
                  <p>
                    {connection.user?.lastSyncAt
                      ? new Date(connection.user.lastSyncAt).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>

              {connection.dataCounts && (
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Data Counts
                  </Label>
                  <div className="flex gap-4 mt-1">
                    <Badge variant="outline">
                      <Heart className="h-3 w-3 mr-1" />
                      Recovery: {connection.dataCounts.recovery}
                    </Badge>
                    <Badge variant="outline">
                      <Activity className="h-3 w-3 mr-1" />
                      Cycles: {connection.dataCounts.cycles}
                    </Badge>
                    <Badge variant="outline">
                      <Moon className="h-3 w-3 mr-1" />
                      Sleep: {connection.dataCounts.sleep}
                    </Badge>
                    <Badge variant="outline">
                      <Dumbbell className="h-3 w-3 mr-1" />
                      Workouts: {connection.dataCounts.workouts}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="font-medium">Not connected to WHOOP</span>
              </div>
              <Button
                onClick={connectWhoop}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect WHOOP Account
              </Button>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={checkConnection}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh Status
            </Button>

            {connection?.connected && (
              <>
                <Button variant="outline" onClick={exportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => disconnectWhoop(false)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sync" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sync">Data Sync</TabsTrigger>
          <TabsTrigger value="webhook">Webhook Test</TabsTrigger>
          <TabsTrigger value="data">Data Viewer</TabsTrigger>
          <TabsTrigger value="logs">Debug Logs</TabsTrigger>
        </TabsList>

        {/* Data Sync Tab */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Manual Data Synchronization
              </CardTitle>
              <CardDescription>
                Trigger manual sync of WHOOP data for testing purposes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sync-days">Days to Sync</Label>
                  <Select value={syncDays} onValueChange={setSyncDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sync-type">Data Type</Label>
                  <Select value={syncType} onValueChange={setSyncType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Data</SelectItem>
                      <SelectItem value="recovery">Recovery Only</SelectItem>
                      <SelectItem value="cycles">Cycles Only</SelectItem>
                      <SelectItem value="sleep">Sleep Only</SelectItem>
                      <SelectItem value="workouts">Workouts Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={syncData}
                disabled={loading || !connection?.connected}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Start Sync
                  </>
                )}
              </Button>

              {syncResult && (
                <Alert
                  className={
                    syncResult.success ? "border-green-500" : "border-red-500"
                  }
                >
                  {syncResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>
                    {syncResult.success ? "Sync Completed" : "Sync Failed"}
                  </AlertTitle>
                  <AlertDescription>
                    {syncResult.success ? (
                      <div className="space-y-2">
                        <p>
                          Synced {syncResult.period?.days} days of data (
                          {new Date(
                            syncResult.period?.start || ""
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            syncResult.period?.end || ""
                          ).toLocaleDateString()}
                          )
                        </p>
                        <div className="text-sm">
                          Recovery: {syncResult.synced?.recovery || 0}, Cycles:{" "}
                          {syncResult.synced?.cycles || 0}, Sleep:{" "}
                          {syncResult.synced?.sleep || 0}, Workouts:{" "}
                          {syncResult.synced?.workouts || 0}
                        </div>
                        {syncResult.synced?.errors &&
                          syncResult.synced.errors.length > 0 && (
                            <div className="text-sm text-red-600">
                              Errors: {syncResult.synced.errors.join(", ")}
                            </div>
                          )}
                      </div>
                    ) : (
                      syncResult.error
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhook Test Tab */}
        <TabsContent value="webhook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Testing
              </CardTitle>
              <CardDescription>
                Test webhook endpoint with simulated WHOOP events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="webhook-event">Event Type</Label>
                  <Select
                    value={webhookEventType}
                    onValueChange={setWebhookEventType}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recovery.updated">
                        Recovery Updated
                      </SelectItem>
                      <SelectItem value="cycle.updated">
                        Cycle Updated
                      </SelectItem>
                      <SelectItem value="sleep.updated">
                        Sleep Updated
                      </SelectItem>
                      <SelectItem value="workout.updated">
                        Workout Updated
                      </SelectItem>
                      <SelectItem value="user.updated">User Updated</SelectItem>
                      <SelectItem value="body_measurement.updated">
                        Body Measurement Updated
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="webhook-user-id">WHOOP User ID</Label>
                  <Input
                    id="webhook-user-id"
                    value={webhookUserId}
                    onChange={(e) => setWebhookUserId(e.target.value)}
                    placeholder={
                      connection?.user?.whoopUserId?.toString() || "12345"
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="webhook-data-id">Data ID</Label>
                  <Input
                    id="webhook-data-id"
                    value={webhookDataId}
                    onChange={(e) => setWebhookDataId(e.target.value)}
                    placeholder="67890"
                  />
                </div>
              </div>

              <Button
                onClick={testWebhook}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Webhook className="h-4 w-4 mr-2" />
                    Send Test Webhook
                  </>
                )}
              </Button>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Note</AlertTitle>
                <AlertDescription>
                  Webhook testing requires valid user ID and data ID. In
                  production, webhooks include proper HMAC signatures for
                  security.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Viewer Tab */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                WHOOP Data Viewer
              </CardTitle>
              <CardDescription>
                View and inspect stored WHOOP data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={fetchWhoopData}
                disabled={loading || !connection?.connected}
                className="w-full"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Load Data
                  </>
                )}
              </Button>

              {whoopData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Object.entries(whoopData).map(([type, data]) => (
                      <Card key={type}>
                        <CardContent className="p-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{data.length}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {type}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Raw Data</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(JSON.stringify(whoopData, null, 2))
                        }
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy JSON
                      </Button>
                    </div>

                    <ScrollArea className="h-64 w-full border rounded-md p-4">
                      <pre className="text-xs">
                        {JSON.stringify(whoopData, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Debug Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Debug Logs
              </CardTitle>
              <CardDescription>
                Real-time logs of WHOOP integration activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge variant="outline">{logs.length} entries</Badge>
                <Button variant="outline" size="sm" onClick={clearLogs}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Logs
                </Button>
              </div>

              <ScrollArea className="h-64 w-full border rounded-md">
                <div className="p-4 space-y-1">
                  {logs.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No logs yet...
                    </p>
                  ) : (
                    logs.map((log, index) => (
                      <div
                        key={index}
                        className="text-xs font-mono p-2 hover:bg-muted rounded cursor-pointer"
                        onClick={() => copyToClipboard(log)}
                      >
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Environment Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Environment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">Client ID</Label>
              <p className="font-mono">
                {showTokens
                  ? process.env.NEXT_PUBLIC_WHOOP_CLIENT_ID || "Not set"
                  : "••••••••"}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTokens(!showTokens)}
                  className="ml-2 h-4 w-4 p-0"
                >
                  {showTokens ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </p>
            </div>

            <div>
              <Label className="text-muted-foreground">Redirect URI</Label>
              <p className="font-mono break-all">
                {process.env.NEXT_PUBLIC_APP_URL}/api/wearables/whoop/callback
              </p>
            </div>

            <div>
              <Label className="text-muted-foreground">Webhook URL</Label>
              <p className="font-mono break-all">
                {process.env.NEXT_PUBLIC_APP_URL}/api/wearables/whoop/webhook
              </p>
            </div>

            <div>
              <Label className="text-muted-foreground">Environment</Label>
              <p>{process.env.NODE_ENV}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Cursor rules applied correctly.
