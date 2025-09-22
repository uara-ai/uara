import { Suspense } from "react";
import { WhoopDebugPanel } from "@/components/admin/debug/whoop-debug-panel";
import { Loader2 } from "lucide-react";

function DebugLoading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    </div>
  );
}

export default function WhoopDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              WHOOP API Debug
            </h1>
            <p className="text-gray-600 mt-1">
              Test API connections and inspect WHOOP data
            </p>
          </div>
        </div>

        {/* Debug Panel */}
        <Suspense fallback={<DebugLoading />}>
          <WhoopDebugPanel />
        </Suspense>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
