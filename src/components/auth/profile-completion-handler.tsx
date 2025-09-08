"use client";

import { useEffect, useState } from "react";
import { ProfileCompletionDialog } from "./profile-completion-dialog";
import { getUserProfileStatusAction } from "@/actions/user-profile-action";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { toast } from "sonner";

export function ProfileCompletionHandler() {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        console.log("ProfileCompletionHandler: Starting check", {
          userId: user?.id,
        });

        // Only proceed if user is authenticated
        if (!user?.id) {
          console.log("ProfileCompletionHandler: No user found");
          setIsLoading(false);
          return;
        }

        // Always check profile status for authenticated users
        console.log(
          "ProfileCompletionHandler: Checking profile status for user"
        );

        // Check if user needs to complete profile (handle database errors gracefully)
        try {
          const statusResult = await getUserProfileStatusAction();

          if (statusResult.success && statusResult.data) {
            const { profileCompleted, hasRequiredInfo, userExists } =
              statusResult.data;

            if (profileCompleted && hasRequiredInfo) {
              console.log("User profile already completed - no dialog needed");
            } else {
              // Show dialog if user doesn't exist, incomplete profile, or missing required info
              if (!userExists) {
                console.log(
                  "User doesn't exist in database - showing profile dialog"
                );
                toast.info(
                  "Welcome! Let's set up your health profile to get started."
                );
              } else if (!hasRequiredInfo) {
                console.log(
                  "User missing required info - showing profile dialog"
                );
                toast.info("Please complete your health profile to continue.");
              } else {
                console.log("User profile incomplete - showing profile dialog");
                toast.info("Please complete your health profile to continue.");
              }
              setShowDialog(true);
            }
          } else {
            // Show dialog for database errors or other issues
            console.log("Status check failed, showing profile dialog");
            toast.info("Please complete your health profile to continue.");
            setShowDialog(true);
          }
        } catch (error) {
          // If database check fails (no table, etc.), show dialog anyway
          console.log("Database check failed, showing profile dialog:", error);
          toast.info("Welcome! Let's set up your health profile.");
          setShowDialog(true);
        }
      } catch (error) {
        console.error("Error in profile completion handler:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileStatus();
  }, [user]);

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

  console.log("ProfileCompletionHandler: Render state", {
    isLoading,
    showDialog,
  });

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
