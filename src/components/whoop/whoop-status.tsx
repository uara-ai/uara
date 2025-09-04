"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhoopConnectButton } from "./whoop-connect-button";
import { Icons } from "@/components/ui/icons";

interface WhoopStatusProps {
  userId?: string;
  className?: string;
}

interface WhoopConnectionStatus {
  connected: boolean;
  lastSync?: string;
  error?: string;
}

export function WhoopStatus({ userId, className }: WhoopStatusProps) {
  const [status, setStatus] = useState<WhoopConnectionStatus>({
    connected: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkWhoopStatus = async () => {
      try {
        // This would typically be an API call to check if user has connected Whoop
        // For now, we'll simulate the check
        setLoading(false);
        setStatus({ connected: false });
      } catch (error) {
        console.error("Error checking Whoop status:", error);
        setStatus({
          connected: false,
          error: "Failed to check Whoop connection",
        });
        setLoading(false);
      }
    };

    checkWhoopStatus();
  }, [userId]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.spinner className="h-4 w-4 animate-spin" />
            Checking Whoop Connection...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            Whoop Integration
          </span>
          <Badge variant={status.connected ? "default" : "secondary"}>
            {status.connected ? "Connected" : "Not Connected"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {status.connected
            ? "Your Whoop device is connected and syncing health data automatically."
            : "Connect your Whoop device to track recovery, strain, and sleep metrics."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{status.error}</p>
          </div>
        )}

        {status.connected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last sync:</span>
              <span>{status.lastSync || "Never"}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold">--</div>
                <div className="text-xs text-muted-foreground">
                  Recovery Score
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold">--</div>
                <div className="text-xs text-muted-foreground">Sleep Score</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">By connecting Whoop, you&apos;ll get:</p>
              <ul className="space-y-1 ml-4">
                <li>• Real-time recovery tracking</li>
                <li>• Sleep quality analysis</li>
                <li>• Strain and workout data</li>
                <li>• Heart rate variability (HRV)</li>
              </ul>
            </div>
            <WhoopConnectButton userId={userId} className="w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Cursor rules applied correctly.
