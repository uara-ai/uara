"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { WhoopAuth } from "@/packages/whoop/auth";

interface WhoopConnectButtonProps {
  userId?: string;
  className?: string;
  variant?: "default" | "secondary" | "outline";
}

export function WhoopConnectButton({
  userId,
  className,
  variant = "default",
}: WhoopConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setIsLoading(true);

      // Generate state parameter for security
      const state = WhoopAuth.generateState();

      // Get the authorization URL
      const authUrl = WhoopAuth.getAuthUrl(window.location.origin, state);

      // Redirect to Whoop OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating Whoop connection:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      variant={variant}
      className={className}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      )}
      {isLoading ? "Connecting..." : "Connect Whoop"}
    </Button>
  );
}

// Cursor rules applied correctly.
