import { DataTable } from "@/components/healthspan/data-table";
import { SectionCards } from "@/components/healthspan/section-cards";
import { ChartAreaInteractive } from "@/components/healthspan/chart-area-interactive";
import data from "./data.json";

export default function HealthspanPage() {
  return (
    <div className="flex flex-col gap-4">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  );
}

// Cursor rules applied correctly.
