import { WhoopCards } from "@/components/healthspan/whoop-cards";
import { WhoopTable } from "@/components/healthspan/whoop-table";
import { Separator } from "@/components/ui/separator";

export default function WhoopPage() {
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
          </div>

          {/* Client-side data fetching for better performance */}
          <WhoopCards />
        </div>

        <div className="px-4 lg:px-6">
          <Separator />
        </div>

        {/* WHOOP Table Section */}
        <div className="space-y-4">
          {/* Client-side data fetching for better performance */}
          <WhoopTable />
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
