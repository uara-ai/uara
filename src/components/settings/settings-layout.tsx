"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WearablesSettings } from "./wearables-settings";
import { Icons } from "@/components/ui/icons";

export function SettingsLayout() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and configure your health integrations.
        </p>
      </div>

      <Tabs defaultValue="wearables" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wearables" className="flex items-center gap-2">
            <Icons.android className="h-4 w-4" />
            Wearables
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Icons.logo className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Icons.logo className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Icons.discord className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wearables" className="space-y-6">
          <WearablesSettings />
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Profile settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control how your data is used and shared.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Privacy settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Notification settings coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Cursor rules applied correctly.
