import React from "react";
import { AiTipsChart } from "@/components/healthspan/v1/healthspan/ai-tips-chart";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export default async function TipsPage() {
  const { user } = await withAuth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto pt-8 pb-12">
        {/* AI Tips Chart Component */}
        <AiTipsChart />
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
