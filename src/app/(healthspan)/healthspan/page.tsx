import { DataTable } from "@/components/healthspan/data-table";
import { SectionCards } from "@/components/healthspan/section-cards";
import { ChartAreaInteractive } from "@/components/healthspan/chart-area-interactive";
import data from "./data.json";
import { GreetingHeader } from "@/components/healthspan/greeting-header";

export default function HealthspanPage() {
  return (
    <div className="flex flex-col gap-4">
      <GreetingHeader className="ml-6 mb-2" />

      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <SectionCards />

      <DataTable data={data} />
    </div>
  );
}

// Cursor rules applied correctly.
