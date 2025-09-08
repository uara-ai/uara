"use client";

import { Bg } from "@/components/bg";
import { Navbar } from "@/components/navbar";
import { ChatInterface } from "@/components/ai";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

export default function Home() {
  const user = useAuth();
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Bg />
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
