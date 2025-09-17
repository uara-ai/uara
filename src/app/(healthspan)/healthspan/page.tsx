import React, { Suspense } from "react";
import { AIWhoopAnalysis } from "@/components/healthspan/ai-whoop-analysis";
import {
  getWhoopSummaryServer,
  processWhoopDataToStats,
} from "@/actions/whoop-data-action";
import { getUserProfileAction } from "@/actions/get-user-profile-action";
import { IconLoader, IconBrain } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Loading component for AI analysis
function HealthspanLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Overall score card skeleton */}
      <Card className="bg-gradient-to-r from-[#085983]/5 to-[#085983]/10 border-[#085983]/20 rounded-xl sm:rounded-2xl">
        <CardHeader className="text-center">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis cards skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="bg-white rounded-xl sm:rounded-2xl border-[#085983]/20"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 p-4 bg-[#085983]/5 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading message */}
      <Card className="bg-white rounded-xl sm:rounded-2xl border-[#085983]/20">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <IconLoader className="h-8 w-8 animate-spin text-[#085983] mx-auto" />
            <p className="text-[#085983] font-[family-name:var(--font-instrument-serif)]">
              Initializing AI health analysis...
            </p>
            <p className="text-sm text-[#085983]/70">
              This may take a few moments as we prepare your personalized
              insights
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function HealthspanContent() {
  // Fetch WHOOP data for analysis (more comprehensive than summary)
  const whoopData = await getWhoopSummaryServer(30); // Last 30 days for better analysis
  const whoopStats = whoopData
    ? await processWhoopDataToStats(whoopData)
    : null;

  // Fetch user profile for personalization
  let userProfile = null;
  try {
    const profileResult = await getUserProfileAction({});
    if (profileResult?.data) {
      userProfile = profileResult.data;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }

  return (
    <AIWhoopAnalysis
      whoopData={whoopData}
      whoopStats={whoopStats}
      user={userProfile}
      className="w-full"
    />
  );
}

export default async function HealthspanPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-8">
        {/* Section Header 
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          {/* Mobile: Simple title 
          <div className="block sm:hidden mb-4">
            <h1 className="font-[family-name:var(--font-instrument-serif)] text-2xl font-normal text-[#085983] leading-tight">
              AI Health Analysis
            </h1>
          </div>

          {/* Desktop: Decorative title with lines
          <div className="hidden sm:flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
            <div className="flex items-center gap-3 px-6">
              <IconBrain className="h-8 w-8 text-[#085983]" />
              <h1 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl lg:text-4xl font-normal text-[#085983]">
                AI Health Analysis
              </h1>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
          </div>

          <p className="font-[family-name:var(--font-geist-sans)] text-sm sm:text-base lg:text-lg text-[#085983]/80 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Advanced AI-powered analysis of your WHOOP data, providing
            personalized insights and actionable recommendations to optimize
            your health, performance, and longevity.
          </p>
        </div>*/}

        {/* AI Analysis Content */}
        <Suspense fallback={<HealthspanLoading />}>
          <HealthspanContent />
        </Suspense>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
