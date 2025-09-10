"use client";

import { useEffect, useState } from "react";
import { ProfileCompletionDialog } from "./profile-completion-dialog";
import { checkUserExistsAction } from "@/actions/user-profile-action";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

export function ProfileCompletionHandler() {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkUser = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await checkUserExistsAction({});
        if (result?.data) {
          const { exists, profileCompleted } = result.data;
          if (!exists || !profileCompleted) {
            setShowDialog(true);
          }
        } else {
          setShowDialog(true);
        }
      } catch (error) {
        console.error("Error:", error);
        setShowDialog(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [user]);

  if (isLoading) return null;

  return (
    <ProfileCompletionDialog
      open={showDialog}
      onOpenChange={setShowDialog}
      onComplete={() => {
        setShowDialog(false);
        window.location.reload();
      }}
    />
  );
}

// Cursor rules applied correctly.
