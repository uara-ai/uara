import React, { Suspense } from "react";
import { WhoopCards } from "@/components/healthspan/whoop-cards";
import { WhoopTable } from "@/components/healthspan/whoop-table";
import { WhoopManagementMenu } from "@/components/healthspan/v1/wearables/whoop-management-menu";
import {
  getWhoopSummaryServer,
  getWhoopDataServer,
  getWhoopUserServer,
  processWhoopDataToStats,
} from "@/actions/whoop-data-action";

export const dynamic = "force-dynamic";

// Enhanced loading components
function WhoopCardsLoading() {
  return (
    <div className="space-y-4">
      <div className="px-4 lg:px-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 h-32 rounded-lg border"
          >
            <div className="p-4 space-y-3">
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="h-8 w-16 bg-gray-300 rounded"></div>
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhoopTableLoading() {
  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

async function WhoopTableSection() {
  // Fetch full data for table (slower, more comprehensive)
  const whoopData = await getWhoopDataServer(30, 25); // 30 days, 25 records limit

  return <WhoopTable whoopData={whoopData} />;
}

export default async function WhoopPage() {
  // Fetch data in parallel for better performance
  const [whoopSummary, whoopUser] = await Promise.all([
    getWhoopSummaryServer(7), // Last 7 days only
    getWhoopUserServer(),
  ]);

  const whoopStats = whoopSummary
    ? await processWhoopDataToStats(whoopSummary)
    : null;

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          {/* Mobile: Simple title */}
          <div className="block sm:hidden mb-4">
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl font-normal text-[#085983] leading-tight">
              Your WHOOP Insights
            </h2>
          </div>

          {/* Desktop: Decorative title with lines */}
          <div className="hidden sm:flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
            <h2 className="px-6 font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl lg:text-4xl font-normal text-[#085983]">
              Your WHOOP Insights
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
          </div>

          <p className="font-[family-name:var(--font-geist-sans)] text-sm sm:text-base lg:text-lg text-[#085983]/80 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Real-time recovery, sleep, and strain insights from your WHOOP data,
            designed to optimize your performance and longevity.
          </p>
        </div>

        {/* WHOOP Cards - Only show when connected and have data */}
        {whoopUser && (
          <WhoopCards whoopData={whoopSummary} whoopStats={whoopStats} />
        )}

        {/* WHOOP Management Menu */}
        <div className="mx-auto px-4 sm:px-6 mb-8">
          <div className="max-w-md mx-auto">
            <WhoopManagementMenu
              whoopUser={whoopUser}
              isConnected={!!whoopUser}
            />
          </div>
        </div>

        {/* WHOOP Table Section - Slower loading but more data 
        <div className="space-y-4">
          <Suspense fallback={<WhoopTableLoading />}>
            <WhoopTableSection />
          </Suspense>
        </div>*/}
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
