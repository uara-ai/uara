import { DataTable } from "@/components/healthspan/data-table";
import { SectionCards } from "@/components/healthspan/section-cards";
import { ChartAreaInteractive } from "@/components/healthspan/chart-area-interactive";
import data from "./data.json";
import { GreetingHeader } from "@/components/healthspan/greeting-header";
import { WhoopCards } from "@/components/healthspan/whoop-cards";
import {
  getWhoopSummaryServer,
  processWhoopDataToStats,
} from "@/actions/whoop-data-action";

export default async function HealthspanPage() {
  // Fetch summary data for cards (fast, cached)
  const whoopSummary = await getWhoopSummaryServer(7); // Last 7 days only
  const whoopStats = whoopSummary
    ? await processWhoopDataToStats(whoopSummary)
    : null;

  return (
    <div className="flex flex-col gap-4">
      <GreetingHeader className="ml-6 mb-2" />

      <WhoopCards whoopData={whoopSummary} whoopStats={whoopStats} />
    </div>
  );
}

// Cursor rules applied correctly.

/*<div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <SectionCards />

      <DataTable data={data} />*/
