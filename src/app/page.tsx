"use client";

import { Navbar } from "@/components/navbar";
import { ChatInterface } from "@/components/ai";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { ProfileCompletionHandler } from "@/components/auth/profile-completion-handler";

export default function Home() {
  const user = useAuth();
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ProfileCompletionHandler />
      <Navbar
        isDialogOpen={false}
        chatId={null}
        selectedVisibilityType="public"
        onVisibilityChange={() => {}}
        status="ready"
        user={user.user}
        onHistoryClick={() => {}}
      />
      <ChatInterface />
    </div>
  );
}

// Cursor rules applied correctly.
