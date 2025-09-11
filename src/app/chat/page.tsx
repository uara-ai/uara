import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChatPageLayout } from "@/components/ai/chat-layout";
import { RateLimitProvider } from "@/hooks/use-rate-limit-context";

export default async function ChatPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const userProfile = {
    id: user.id,
    firstName: user.name,
    lastName: user.surname,
    name: user.name && user.surname ? `${user.name} ${user.surname}` : null,
    email: user.email,
    profilePictureUrl: user.pictureUrl,
    avatarUrl: user.pictureUrl,
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RateLimitProvider enabled={!!user}>
        <ChatPageLayout user={userProfile} />
      </RateLimitProvider>
    </Suspense>
  );
}

// Cursor rules applied correctly.
