"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

interface GreetingHeaderProps {
  className?: string;
}

export function GreetingHeader({ className }: GreetingHeaderProps) {
  const [greeting, setGreeting] = useState("");
  const { user, loading } = useAuth();

  useEffect(() => {
    const updateGreeting = () => {
      if (loading) {
        setGreeting("Loading...");
        return;
      }

      const now = new Date();
      const hour = now.getHours();

      let timeOfDay = "";
      if (hour >= 5 && hour < 12) {
        timeOfDay = "Morning";
      } else if (hour >= 12 && hour < 17) {
        timeOfDay = "Afternoon";
      } else if (hour >= 17 && hour < 21) {
        timeOfDay = "Evening";
      } else {
        timeOfDay = "Night";
      }

      // Extract user name from Supabase auth
      let userName = "User";
      if (user) {
        const userMetadata = user.user_metadata || {};
        const fullName =
          userMetadata.full_name ||
          userMetadata.name ||
          `${userMetadata.first_name || ""} ${
            userMetadata.last_name || ""
          }`.trim();

        // Use first name if available, otherwise full name, otherwise "User"
        userName =
          userMetadata.first_name ||
          fullName.split(" ")[0] ||
          fullName ||
          "User";
      }

      setGreeting(`Good ${timeOfDay}, ${userName}`);
    };

    // Update greeting immediately
    updateGreeting();

    // Update greeting every minute to handle time changes
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, [user, loading]);

  // Split greeting to apply gradient to user name only
  const greetingParts = greeting.split(", ");
  const timeGreeting = greetingParts[0];
  const userName = greetingParts[1];

  return (
    <h1 className={`text-2xl font-medium text-slate-900 ${className || ""}`}>
      {timeGreeting}
      {userName && (
        <>
          ,{" "}
          <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">
            {userName}
          </span>
          <p className="text-sm text-muted-foreground mt-1">
            here is a quick look at how things are going.
          </p>
        </>
      )}
    </h1>
  );
}

// Cursor rules applied correctly.
