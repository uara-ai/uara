"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { WelcomeScreen } from "@/components/ai";
import { WipBanner } from "@/components/landing/wip-banner";
import { Footer } from "@/components/landing/footer";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { ProfileCompletionHandler } from "@/components/auth/profile-completion-handler";
import { RateLimitProvider } from "@/hooks/use-rate-limit-context";
import { useState, useRef } from "react";

export default function Home() {
  const user = useAuth();
  const router = useRouter();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user.user) return;

    // Navigate to chat page with the initial message as a query parameter
    const searchParams = new URLSearchParams();
    searchParams.set("message", input);
    router.push(`/chat?${searchParams.toString()}`);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (!user.user) return;

    // Navigate to chat page with the suggestion as a query parameter
    const searchParams = new URLSearchParams();
    searchParams.set("message", suggestion);
    router.push(`/chat?${searchParams.toString()}`);
  };

  return (
    <RateLimitProvider enabled={!!user.user}>
      <div className="min-h-screen relative overflow-hidden">
        <ProfileCompletionHandler />
        <Navbar user={user.user} />
        <WelcomeScreen
          input={input}
          status="ready"
          onInputChange={handleInputChange}
          onSubmit={handleChatSubmit}
          onSuggestionClick={handleSuggestionClick}
          inputRef={inputRef}
        />
        <WipBanner />
        <Footer />
      </div>
    </RateLimitProvider>
  );
}

// Cursor rules applied correctly.
