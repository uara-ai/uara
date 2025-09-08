"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProfileCompletionDialog } from "./profile-completion-dialog";
import {
  getUserProfileStatusAction,
  initializeUserAction,
} from "@/actions/user-profile-action";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

export function ProfileCompletionHandler() {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        // Only proceed if user is authenticated
        if (!user?.id) {
          setIsLoading(false);
          return;
        }

        const showProfileDialog = searchParams.get("showProfileDialog");

        if (showProfileDialog === "true") {
          // Check if user actually needs to complete profile
          const statusResult = await getUserProfileStatusAction();

          // If user not found in database, initialize them first
          if (
            !statusResult.success &&
            statusResult.error === "Resource not found"
          ) {
            console.log("User not found in database, initializing...");
            const initResult = await initializeUserAction({ id: user.id });

            if (initResult.success) {
              console.log("User initialized successfully");
              setShowDialog(true);
            } else {
              console.error("Failed to initialize user:", initResult.error);
            }
          } else if (
            statusResult.success &&
            !statusResult.data?.profileCompleted
          ) {
            console.log("User found but profile not completed");
            setShowDialog(true);
          } else if (
            statusResult.success &&
            statusResult.data?.profileCompleted
          ) {
            console.log("User profile already completed");
          } else {
            console.error("Error checking profile status:", statusResult.error);
          }

          // Clean up URL parameter
          const url = new URL(window.location.href);
          url.searchParams.delete("showProfileDialog");
          router.replace(url.pathname + url.search, { scroll: false });
        }
      } catch (error) {
        console.error("Error in profile completion handler:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileStatus();
  }, [searchParams, router, user]);

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowDialog(false);
    }
  };

  const handleProfileComplete = () => {
    setShowDialog(false);
    // Optionally refresh the page or show a success message
    window.location.reload();
  };

  if (isLoading) {
    return null; // Don't render anything while loading
  }

  return (
    <ProfileCompletionDialog
      open={showDialog}
      onOpenChange={handleDialogClose}
      onComplete={handleProfileComplete}
    />
  );
}

// Cursor rules applied correctly.
