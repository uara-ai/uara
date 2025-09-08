"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProfileCompletionDialog } from "./profile-completion-dialog";
import { getUserProfileStatusAction } from "@/actions/user-profile-action";

export function ProfileCompletionHandler() {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const showProfileDialog = searchParams.get("showProfileDialog");

        if (showProfileDialog === "true") {
          // Check if user actually needs to complete profile
          const statusResult = await getUserProfileStatusAction();

          if (statusResult.success && !statusResult.data?.profileCompleted) {
            setShowDialog(true);
          }

          // Clean up URL parameter
          const url = new URL(window.location.href);
          url.searchParams.delete("showProfileDialog");
          router.replace(url.pathname + url.search, { scroll: false });
        }
      } catch (error) {
        console.error("Error checking profile status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileStatus();
  }, [searchParams, router]);

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
