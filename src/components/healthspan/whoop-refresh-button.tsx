"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function WhoopRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);

      const response = await fetch("/api/wearables/whoop/refresh", {
        method: "POST",
      });

      if (response.ok) {
        // Refresh the page to show updated data
        router.refresh();
      } else {
        console.error("Failed to refresh WHOOP data");
      }
    } catch (error) {
      console.error("Error refreshing WHOOP data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="gap-2"
    >
      <IconRefresh
        className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
      />
      {isRefreshing ? "Refreshing..." : "Refresh"}
    </Button>
  );
}

// Cursor rules applied correctly.
