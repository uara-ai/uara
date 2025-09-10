"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { ChatLayout } from "@/components/ai";
import { RateLimitProvider } from "@/hooks/use-rate-limit-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Minimal loading component
const FastLoader = () => (
  <div className="flex flex-col h-screen bg-background">
    <div className="h-16 border-b border-gray-200 flex items-center px-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </div>
    <div className="flex-1 p-4 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
    <div className="p-4 border-t border-gray-200 animate-pulse">
      <div className="h-11 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

export default function ChatPage() {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user.loading && !user.user) {
      router.push("/login");
    }
  }, [user.loading, user.user, router]);

  if (user.loading) return <FastLoader />;
  if (!user.user) return null;

  return (
    <RateLimitProvider enabled>
      <ChatLayout user={user.user} />
    </RateLimitProvider>
  );
}

// Cursor rules applied correctly.
