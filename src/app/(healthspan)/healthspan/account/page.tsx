"use client";

import { Suspense } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserInfoTab } from "@/components/account/user-info-tab";
import { HealthDataTab } from "@/components/account/health-data-tab";
import { BillingTab } from "@/components/account/billing-tab";
import { IconUser, IconCreditCard, IconHeartbeat } from "@tabler/icons-react";
import { RateLimitProvider } from "@/hooks/use-rate-limit-context";

function AccountPageContent() {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString.withDefault("user-info")
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          {/* Mobile: Simple title */}
          <div className="block sm:hidden mb-4">
            <h1 className="font-[family-name:var(--font-instrument-serif)] text-2xl font-normal text-[#085983] leading-tight">
              Account Settings
            </h1>
          </div>

          {/* Desktop: Decorative title with lines */}
          <div className="hidden sm:flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
            <div className="flex items-center gap-3 px-6">
              <IconUser className="h-8 w-8 text-[#085983]" />
              <h1 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl lg:text-4xl font-normal text-[#085983]">
                Account Settings
              </h1>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
          </div>

          <p className="font-[family-name:var(--font-geist-sans)] text-sm sm:text-base lg:text-lg text-[#085983]/80 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Manage your personal information, health data integrations, and
            billing preferences to optimize your longevity journey.
          </p>
        </div>

        {/* Account Settings Content */}
        <div className="mx-auto px-4 sm:px-6 max-w-6xl">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl sm:rounded-2xl border border-[#085983]/20 shadow-sm">
              <TabsTrigger
                value="user-info"
                className="flex items-center gap-2 font-[family-name:var(--font-geist-sans)] text-[#085983] data-[state=active]:bg-[#085983] data-[state=active]:text-white rounded-lg sm:rounded-xl"
              >
                <IconUser className="h-4 w-4" />
                <span className="hidden sm:inline">Personal Info</span>
                <span className="sm:hidden">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="health-data"
                className="flex items-center gap-2 font-[family-name:var(--font-geist-sans)] text-[#085983] data-[state=active]:bg-[#085983] data-[state=active]:text-white rounded-lg sm:rounded-xl"
              >
                <IconHeartbeat className="h-4 w-4" />
                <span className="hidden sm:inline">Health Data</span>
                <span className="sm:hidden">Health</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex items-center gap-2 font-[family-name:var(--font-geist-sans)] text-[#085983] data-[state=active]:bg-[#085983] data-[state=active]:text-white rounded-lg sm:rounded-xl"
              >
                <IconCreditCard className="h-4 w-4" />
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
