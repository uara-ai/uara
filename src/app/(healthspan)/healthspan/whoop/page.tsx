import React, { Suspense } from "react";
import { WhoopCards } from "@/components/healthspan/whoop-cards";
import { WhoopTable } from "@/components/healthspan/whoop-table";
import { Separator } from "@/components/ui/separator";
import { WhoopRefreshButton } from "@/components/healthspan/whoop-refresh-button";
import {
  getWhoopSummaryServer,
  getWhoopDataServer,
  processWhoopDataToStats,
} from "@/actions/whoop-data-action";

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

// Separate components for optimized loading
async function WhoopCardsSection() {
  // Fetch summary data for cards (fast, cached)
  const whoopSummary = await getWhoopSummaryServer(7); // Last 7 days only
  const whoopStats = whoopSummary
    ? await processWhoopDataToStats(whoopSummary)
    : null;

  return (
    <div className="space-y-4">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">WHOOP Dashboard</h1>
            <p className="text-muted-foreground">
              View your WHOOP recovery, sleep, strain, and workout data in one
              place.
            </p>
            {whoopSummary?._metadata && (
              <p className="text-sm text-muted-foreground mt-2">
                Last updated:{" "}
                {new Date(whoopSummary._metadata.fetchedAt).toLocaleString()} •
                Last 7 days •{" "}
                {Object.values(whoopSummary._metadata.counts).reduce(
                  (a, b) => a + b,
                  0
                )}{" "}
                summary records
              </p>
            )}
          </div>
          <WhoopRefreshButton />
        </div>
      </div>
      <WhoopCards whoopData={whoopSummary} whoopStats={whoopStats} />
    </div>
  );
}

async function WhoopTableSection() {
  // Fetch full data for table (slower, more comprehensive)
  const whoopData = await getWhoopDataServer(30, 25); // 30 days, 25 records limit

  return <WhoopTable whoopData={whoopData} />;
}

export default function WhoopPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-8">
        {/* WHOOP Cards Section - Fast loading 
        <Suspense fallback={<WhoopCardsLoading />}>
          <WhoopCardsSection />
        </Suspense>*/}

        <div className="px-4 lg:px-6">
          <Separator />
        </div>

        {/* WHOOP Table Section - Slower loading but more data */}
        <div className="space-y-4">
          <Suspense fallback={<WhoopTableLoading />}>
            <WhoopTableSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
