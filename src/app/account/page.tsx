"use client";

import { Suspense } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserInfoTab } from "@/components/account/user-info-tab";
import { HealthDataTab } from "@/components/account/health-data-tab";
import { BillingTab } from "@/components/account/billing-tab";
import { User, CreditCard, ScanHeart } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { RateLimitProvider } from "@/hooks/use-rate-limit-context";

function AccountPageContent() {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault("user-info")
  );
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isDialogOpen={false}
        chatId={null}
        selectedVisibilityType="public"
        status="ready"
        user={user}
      />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-20">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your profile, health data settings, and billing information.
          </p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user-info" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">User Info</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="health-data"
              className="flex items-center gap-2"
            >
              <ScanHeart className="h-4 w-4" />
              <span className="hidden sm:inline">Health Data</span>
              <span className="sm:hidden">Health</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
              <span className="sm:hidden">Billing</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="user-info" className="space-y-4">
              <UserInfoTab />
            </TabsContent>

            <TabsContent value="health-data" className="space-y-4">
              <HealthDataTab />
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <BillingTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RateLimitProvider enabled={true}>
        <AccountPageContent />
      </RateLimitProvider>
    </Suspense>
  );
}

// Cursor rules applied correctly.
