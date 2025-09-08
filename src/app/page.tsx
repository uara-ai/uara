"use client";

import { Bg } from "@/components/bg";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

export default function Home() {
  const user = useAuth();
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar
        isDialogOpen={false}
        chatId={null}
        selectedVisibilityType="public"
        onVisibilityChange={() => {}}
        status="ready"
        user={user.user}
        onHistoryClick={() => {}}
      />
    </div>
  );
}

// Cursor rules applied correctly.
