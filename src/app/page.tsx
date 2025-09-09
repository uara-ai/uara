"use client";

import { Navbar } from "@/components/navbar";
import { ChatInterface } from "@/components/ai";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { ProfileCompletionHandler } from "@/components/auth/profile-completion-handler";
import { RateLimitProvider } from "@/hooks/use-rate-limit-context";

export default function Home() {
  const user = useAuth();
  return (
    <RateLimitProvider enabled={!!user.user}>
      <div className="min-h-screen relative overflow-hidden">
        <ProfileCompletionHandler />
        <Navbar
          isDialogOpen={false}
          chatId={null}
          selectedVisibilityType="public"
          status="ready"
          user={user.user}
        />
        <ChatInterface user={user.user} />
      </div>
    </RateLimitProvider>
  );
}

// Cursor rules applied correctly.
