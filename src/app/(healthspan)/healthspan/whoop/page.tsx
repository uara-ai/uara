import React, { Suspense } from "react";
import { WhoopCards } from "@/components/healthspan/whoop-cards";
import { WhoopTable } from "@/components/healthspan/whoop-table";
import { Separator } from "@/components/ui/separator";
import {
  getWhoopDataServer,
  processWhoopDataToStats,
} from "@/actions/whoop-data-action";

// Loading components
function WhoopCardsLoading() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 h-32 rounded-lg"
        ></div>
      ))}
    </div>
  );
}

function WhoopTableLoading() {
  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

export default async function WhoopPage() {
  // Fetch WHOOP data server-side with reduced limits for better performance
  const whoopData = await getWhoopDataServer(30, 25); // 30 days, 25 records limit
  const whoopStats = whoopData
    ? await processWhoopDataToStats(whoopData)
    : null;

  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-8">
        {/* WHOOP Cards Section */}
        <div className="space-y-4">
          <div className="px-4 lg:px-6">
            <h1 className="text-3xl font-bold">WHOOP Dashboard</h1>
            <p className="text-muted-foreground">
              View your WHOOP recovery, sleep, strain, and workout data in one
              place.
            </p>
            {whoopData?._metadata && (
              <p className="text-sm text-muted-foreground mt-2">
                Last updated:{" "}
                {new Date(whoopData._metadata.fetchedAt).toLocaleString()} •
                {Object.values(whoopData._metadata.counts).reduce(
                  (a, b) => a + b,
                  0
                )}{" "}
                total records
              </p>
            )}
          </div>

          <Suspense fallback={<WhoopCardsLoading />}>
            <WhoopCards whoopData={whoopData} whoopStats={whoopStats} />
          </Suspense>
        </div>

        <div className="px-4 lg:px-6">
          <Separator />
        </div>

        {/* WHOOP Table Section */}
        <div className="space-y-4">
          <Suspense fallback={<WhoopTableLoading />}>
            <WhoopTable whoopData={whoopData} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
