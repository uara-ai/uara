"use client";

import { Check, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Logo } from "@/components/logo";
import {
  subscribeAction,
  getSubscriberCount,
} from "@/actions/subscribe-action";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function WaitlistPage() {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usersOnWaitlist, setUsersOnWaitlist] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  const handleJoinWaitlist = async () => {
    if (!user?.email) {
      toast.error("Please sign in to join the waitlist");
      return;
    }

    setIsLoading(true);
    try {
      const result = await subscribeAction({ email: user.email });

      if (result?.data?.success) {
        setIsSubscribed(true);
        // Save subscription state to localStorage
        localStorage.setItem(`waitlist_${user.email}`, "subscribed");
        toast.success("Welcome to the waitlist!");
        // Update waitlist count after successful subscription
        fetchWaitlistCount();
      } else {
        // If they're already on the list, also mark as subscribed
        setIsSubscribed(true);
        localStorage.setItem(`waitlist_${user.email}`, "subscribed");
        toast.error("You're already on the list!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWaitlistCount = async () => {
    try {
      const countResult = await getSubscriberCount();

      if (
        countResult?.success &&
        countResult.data &&
        typeof countResult.data === "object" &&
        "count" in countResult.data
      ) {
        setUsersOnWaitlist((countResult.data as { count: number }).count + 100);
      }
    } catch (error) {
      console.error("Error fetching waitlist count:", error);
    } finally {
      setIsLoadingCount(false);
    }
  };

  // Load saved subscription state from localStorage
  useEffect(() => {
    if (user?.email) {
      const savedState = localStorage.getItem(`waitlist_${user.email}`);
      if (savedState === "subscribed") {
        setIsSubscribed(true);
      }
    }
    fetchWaitlistCount();
  }, [user?.email]);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Main heading */}
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            Uara requires an invitation
          </h1>

          {/* Subtitle */}
          <p className="text-md text-muted-foreground mb-12 font-light">
            Join the waitlist to be notified when access
            <br />
            opens up.
          </p>

          {/* Waitlist Button */}
          <div className="p-6 mb-8 space-y-4">
            <Button
              className="max-w-xs mx-auto w-full border border-border"
              variant="secondary"
              onClick={handleJoinWaitlist}
              disabled={isLoading || isSubscribed || !user?.email}
            >
              {isLoading ? (
                <>
                  <Loader className="size-4 animate-spin mr-2" />
                  Adding to waitlist...
                </>
              ) : isSubscribed ? (
                <>
                  <Check className="size-4 mr-2" />
                  Added to waitlist
                </>
              ) : (
                "Join the waitlist"
              )}
            </Button>

            {user?.email && (
              <p className="text-muted-foreground text-sm">
                Signed in as{" "}
                <span className="text-foreground font-semibold">
                  {user.email}
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              {isLoadingCount ? (
                <>
                  <Loader className="size-3 animate-spin mr-1 inline" />
                  Loading...
                </>
              ) : (
                `${usersOnWaitlist.toLocaleString()} users on the waitlist`
              )}
            </span>
          </div>
          {/* Navigation indicator */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2 text-gray-400">
              <Logo hidden className="size-6" />
              <span className="text-sm">uara.ai</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
