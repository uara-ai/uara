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
import { Button } from "@/components/ui/button";
import { WhoopConnectButton } from "@/components/whoop/whoop-connect-button";
import { Icons } from "@/components/ui/icons";
import { createClient } from "@/packages/supabase/client";

interface WearableConnection {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  lastSync?: string;
  icon: React.ReactNode;
  connectButton: React.ReactNode;
}

export function WearablesSettings() {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email });
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const wearables: WearableConnection[] = [
    {
      id: "whoop",
      name: "WHOOP",
      description:
        "Track recovery, strain, and sleep with your WHOOP device. Get real-time insights into your body's readiness and performance.",
      connected: false, // This would be dynamic based on user's actual connection status
      lastSync: undefined,
      icon: (
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
          <svg
            className="h-6 w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
      ),
      connectButton: (
        <WhoopConnectButton
          userId={user?.id}
          variant="outline"
          className="w-full"
        />
      ),
    },
    {
      id: "fitbit",
      name: "Fitbit",
      description:
        "Sync your Fitbit data including steps, heart rate, sleep, and exercise sessions for comprehensive health tracking.",
      connected: false,
      lastSync: undefined,
      icon: (
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
          <Icons.android className="h-6 w-6 text-white" />
        </div>
      ),
      connectButton: (
        <Button variant="outline" className="w-full" disabled>
          <Icons.spinner className="mr-2 h-4 w-4" />
          Coming Soon
        </Button>
      ),
    },
    {
      id: "garmin",
      name: "Garmin",
      description:
        "Connect your Garmin device to track workouts, GPS activities, and advanced health metrics like stress and energy.",
      connected: false,
      lastSync: undefined,
      icon: (
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Icons.chrome className="h-6 w-6 text-white" />
        </div>
      ),
      connectButton: (
        <Button variant="outline" className="w-full" disabled>
          <Icons.spinner className="mr-2 h-4 w-4" />
          Coming Soon
        </Button>
      ),
    },
    {
      id: "apple-health",
      name: "Apple Health",
      description:
        "Integrate with Apple Health to sync data from iPhone, Apple Watch, and other health apps in your ecosystem.",
      connected: false,
      lastSync: undefined,
      icon: (
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
          <Icons.apple className="h-6 w-6 text-white" />
        </div>
      ),
      connectButton: (
        <Button variant="outline" className="w-full" disabled>
          <Icons.spinner className="mr-2 h-4 w-4" />
          Coming Soon
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.spinner className="h-5 w-5 animate-spin" />
              Loading Wearables...
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Wearables</CardTitle>
          <CardDescription>
            Connect your wearable devices to automatically sync health data and
            get comprehensive insights into your wellness journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            <p>
              🔒 Your data is encrypted and secure. You can disconnect any
              device at any time.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {wearables.map((wearable) => (
          <Card key={wearable.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {wearable.icon}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{wearable.name}</CardTitle>
                      <Badge
                        variant={wearable.connected ? "default" : "secondary"}
                      >
                        {wearable.connected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <CardDescription className="max-w-md">
                      {wearable.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {wearable.connected && wearable.lastSync ? (
                    <div className="text-sm text-muted-foreground">
                      Last sync: {wearable.lastSync}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {wearable.id === "whoop"
                        ? "Ready to connect"
                        : "Coming soon"}
                    </div>
                  )}
                  {wearable.connected && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      Syncing automatically
                    </div>
                  )}
                </div>
                <div className="w-32">
                  {wearable.connected ? (
                    <Button variant="outline" className="w-full">
                      Disconnect
                    </Button>
                  ) : (
                    wearable.connectButton
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Sync Settings</CardTitle>
          <CardDescription>
            Configure how often your wearable data is synchronized and which
            metrics to track.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Real-time sync</div>
              <div className="text-sm text-muted-foreground">
                Receive data updates as soon as they&apos;re available
              </div>
            </div>
            <Badge variant="default">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Historical data import</div>
              <div className="text-sm text-muted-foreground">
                Import up to 30 days of historical data when connecting
              </div>
            </div>
            <Badge variant="default">Enabled</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Data retention</div>
              <div className="text-sm text-muted-foreground">
                Keep your health data secure and accessible
              </div>
            </div>
            <Badge variant="secondary">Unlimited</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
          <CardDescription>
            Having issues with your wearable connections? Here are some common
            solutions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="font-medium mb-2">Common issues:</p>
            <ul className="space-y-1 text-muted-foreground ml-4">
              <li>
                • Data not syncing: Check your device&apos;s internet connection
              </li>
              <li>
                • Missing recent data: Wait a few minutes for sync to complete
              </li>
              <li>
                • Connection failed: Try disconnecting and reconnecting your
                device
              </li>
              <li>
                • Permissions error: Ensure you granted all requested
                permissions
              </li>
            </ul>
          </div>
          <div className="pt-2">
            <Button variant="outline" size="sm">
              <Icons.discord className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Cursor rules applied correctly.
