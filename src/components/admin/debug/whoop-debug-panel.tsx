"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Moon,
  Dumbbell,
  Heart,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  User,
  Database,
  Loader2,
  Link,
  Unlink,
} from "lucide-react";
import { JsonViewer } from "./json-viewer";

interface ConnectionStatus {
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

interface ApiTestResult {
  endpoint: string;
  success: boolean;
  data?: any;
  error?: string;
  duration?: number;
  timestamp: string;
}

const API_GROUPS = {
  connection: {
    title: "Connection & Status",
    icon: User,
    endpoints: [
      {
        name: "Connect WHOOP",
        url: "/api/wearables/whoop/auth",
        method: "GET",
      },
      { name: "Sync Status", url: "/api/wearables/whoop/sync", method: "GET" },
      {
        name: "Connection Info",
        url: "/api/wearables/whoop/disconnect",
        method: "GET",
      },
      {
        name: "Disconnect",
        url: "/api/wearables/whoop/disconnect",
        method: "DELETE",
      },
    ],
  },
  data: {
    title: "Data Retrieval",
    icon: Database,
    endpoints: [
      {
        name: "Summary (7 days)",
        url: "/api/wearables/whoop/summary?days=7",
        method: "GET",
      },
      {
        name: "Summary (30 days)",
        url: "/api/wearables/whoop/summary?days=30",
        method: "GET",
      },
      {
        name: "Stats (7 days)",
        url: "/api/wearables/whoop/stats?days=7",
        method: "GET",
      },
      {
        name: "Raw Data (All)",
        url: "/api/wearables/whoop/data?type=all&days=7",
        method: "GET",
      },
      {
        name: "Raw Data (Recovery)",
        url: "/api/wearables/whoop/data?type=recovery&days=7",
        method: "GET",
      },
      {
        name: "Raw Data (Sleep)",
        url: "/api/wearables/whoop/data?type=sleep&days=7",
        method: "GET",
      },
      {
        name: "Raw Data (Cycles)",
        url: "/api/wearables/whoop/data?type=cycles&days=7",
        method: "GET",
      },
      {
        name: "Raw Data (Workouts)",
        url: "/api/wearables/whoop/data?type=workouts&days=7",
        method: "GET",
      },
    ],
  },
  sync: {
    title: "Data Sync",
    icon: RefreshCw,
    endpoints: [
      {
        name: "Sync All (7 days)",
        url: "/api/wearables/whoop/sync?days=7&type=all",
        method: "POST",
      },
      {
        name: "Sync Recovery",
        url: "/api/wearables/whoop/sync?days=7&type=recovery",
        method: "POST",
      },
      {
        name: "Sync Sleep",
        url: "/api/wearables/whoop/sync?days=7&type=sleep",
        method: "POST",
      },
      {
        name: "Sync Cycles",
        url: "/api/wearables/whoop/sync?days=7&type=cycles",
        method: "POST",
      },
      {
        name: "Sync Workouts",
        url: "/api/wearables/whoop/sync?days=7&type=workouts",
        method: "POST",
      },
      {
        name: "Refresh Cache",
        url: "/api/wearables/whoop/refresh",
        method: "POST",
      },
    ],
  },
  export: {
    title: "Data Export",
    icon: Eye,
    endpoints: [
      {
        name: "Export JSON",
        url: "/api/wearables/whoop/export?format=json",
        method: "GET",
      },
      {
        name: "Export CSV",
        url: "/api/wearables/whoop/export?format=csv",
        method: "GET",
      },
    ],
  },
};

export function WhoopDebugPanel() {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus | null>(null);
  const [loadingConnection, setLoadingConnection] = useState(true);
  const [testResults, setTestResults] = useState<ApiTestResult[]>([]);
  const [loadingTests, setLoadingTests] = useState<Set<string>>(new Set());
  const [selectedResult, setSelectedResult] = useState<ApiTestResult | null>(
    null
  );

  // Load connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    setLoadingConnection(true);
    try {
      const response = await fetch("/api/wearables/whoop/sync");
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus(data);
      } else {
        setConnectionStatus({ connected: false });
      }
    } catch (error) {
      console.error("Failed to check connection status:", error);
      setConnectionStatus({ connected: false });
    } finally {
      setLoadingConnection(false);
    }
  };

  const handleConnect = async () => {
    setLoadingConnection(true);
    try {
      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Redirect to WHOOP OAuth flow
      window.location.href = "/api/wearables/whoop/auth";
    } catch (error) {
      console.error("Connection error:", error);
      alert("Failed to initiate WHOOP connection. Please try again.");
      setLoadingConnection(false);
    }
  };

  const handleDisconnect = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect your WHOOP account? This will remove access to your data."
      )
    ) {
      return;
    }

    setLoadingConnection(true);
    try {
      const response = await fetch("/api/wearables/whoop/disconnect", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect WHOOP account");
      }

      // Refresh connection status
      await checkConnectionStatus();
    } catch (error) {
      console.error("Disconnect error:", error);
    } finally {
      setLoadingConnection(false);
    }
  };

  const testApiEndpoint = async (endpoint: {
    name: string;
    url: string;
    method: string;
  }) => {
    const testId = `${endpoint.method}-${endpoint.url}`;
    setLoadingTests((prev) => new Set([...prev, testId]));

    const startTime = Date.now();
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
      });

      const duration = Date.now() - startTime;

      let data;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      const result: ApiTestResult = {
        endpoint: `${endpoint.method} ${endpoint.url}`,
        success: response.ok,
        data: response.ok ? data : undefined,
        error: !response.ok ? data || `HTTP ${response.status}` : undefined,
        duration,
        timestamp: new Date().toISOString(),
      };

      setTestResults((prev) => [result, ...prev.slice(0, 49)]); // Keep last 50 results
    } catch (error) {
      const duration = Date.now() - startTime;
      const result: ApiTestResult = {
        endpoint: `${endpoint.method} ${endpoint.url}`,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        duration,
        timestamp: new Date().toISOString(),
      };

      setTestResults((prev) => [result, ...prev.slice(0, 49)]);
    } finally {
      setLoadingTests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(testId);
        return newSet;
      });
    }
  };

  const renderConnectionStatus = () => {
    if (loadingConnection) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!connectionStatus) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>Failed to check status</span>
            </div>
            <Button onClick={checkConnectionStatus} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Connection Status
            <Button
              variant="outline"
              size="sm"
              onClick={checkConnectionStatus}
              disabled={loadingConnection}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {connectionStatus.connected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-600">Connected</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-600">
                    Not Connected
                  </span>
                </>
              )}
            </div>

            {/* Connection Controls */}
            <div className="flex items-center gap-2">
              {connectionStatus.connected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={loadingConnection}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  {loadingConnection ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Unlink className="h-4 w-4 mr-2" />
                  )}
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleConnect}
                  disabled={loadingConnection}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  {loadingConnection ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Link className="h-4 w-4 mr-2" />
                  )}
                  Connect WHOOP
                </Button>
              )}
            </div>
          </div>

          {/* User Info */}
          {connectionStatus.user && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-gray-500">User</div>
                <div className="font-medium">
                  {connectionStatus.user.firstName}{" "}
                  {connectionStatus.user.lastName}
                </div>
                <div className="text-sm text-gray-600">
                  {connectionStatus.user.email}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">WHOOP ID</div>
                <div className="font-mono text-sm">
                  {connectionStatus.user.whoopUserId}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Connected</div>
                <div className="text-sm">
                  {new Date(
                    connectionStatus.user.connectedAt
                  ).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Sync</div>
                <div className="text-sm">
                  {connectionStatus.user.lastSyncAt
                    ? new Date(
                        connectionStatus.user.lastSyncAt
                      ).toLocaleString()
                    : "Never"}
                </div>
              </div>
            </div>
          )}

          {/* Data Counts */}
          {connectionStatus.dataCounts && (
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-500 mb-2">Data Records</div>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="font-medium">
                    {connectionStatus.dataCounts.recovery}
                  </div>
                  <div className="text-xs text-gray-500">Recovery</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">
                    {connectionStatus.dataCounts.sleep}
                  </div>
                  <div className="text-xs text-gray-500">Sleep</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">
                    {connectionStatus.dataCounts.cycles}
                  </div>
                  <div className="text-xs text-gray-500">Cycles</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">
                    {connectionStatus.dataCounts.workouts}
                  </div>
                  <div className="text-xs text-gray-500">Workouts</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderApiGroup = (
    groupKey: string,
    group: typeof API_GROUPS.connection
  ) => {
    const IconComponent = group.icon;

    return (
      <Card key={groupKey}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            {group.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {group.endpoints.map((endpoint, index) => {
              const testId = `${endpoint.method}-${endpoint.url}`;
              const isLoading = loadingTests.has(testId);

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{endpoint.name}</div>
                    <div className="text-sm text-gray-500 font-mono">
                      {endpoint.method} {endpoint.url}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testApiEndpoint(endpoint)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Test"
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTestResults = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No test results yet. Run some API tests to see results here.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium text-sm">
                        {result.endpoint}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.duration && (
                      <Badge variant="outline">{result.duration}ms</Badge>
                    )}
                    <Eye className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Connect Banner */}
      {connectionStatus && !connectionStatus.connected && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  WHOOP Account Not Connected
                </h3>
                <p className="text-blue-700 text-sm">
                  Connect your WHOOP account to test API endpoints and view your
                  health data
                </p>
              </div>
              <Button
                onClick={handleConnect}
                disabled={loadingConnection}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loadingConnection ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Link className="h-4 w-4 mr-2" />
                )}
                Connect WHOOP
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      {renderConnectionStatus()}

      {/* API Testing */}
      <Tabs defaultValue="groups" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="groups">API Groups</TabsTrigger>
          <TabsTrigger value="results">
            Results ({testResults.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-4">
          {Object.entries(API_GROUPS).map(([key, group]) =>
            renderApiGroup(key, group)
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">{renderTestResults()}</div>

            {/* Selected Result Details */}
            {selectedResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Result Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Endpoint</div>
                      <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                        {selectedResult.endpoint}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Status</div>
                        <div className="flex items-center gap-1">
                          {selectedResult.success ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Success</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-red-600">Error</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500">Duration</div>
                        <div>{selectedResult.duration}ms</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Time</div>
                        <div>
                          {new Date(
                            selectedResult.timestamp
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {selectedResult.error && (
                      <div>
                        <div className="text-sm text-gray-500 mb-2">Error</div>
                        <div className="text-red-600 bg-red-50 p-2 rounded text-sm">
                          {selectedResult.error}
                        </div>
                      </div>
                    )}

                    {selectedResult.data && (
                      <div>
                        <div className="text-sm text-gray-500 mb-2">
                          Response Data
                        </div>
                        <JsonViewer data={selectedResult.data} />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Cursor rules applied correctly.
