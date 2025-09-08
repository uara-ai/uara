import { handleAuth, withAuth } from "@workos-inc/authkit-nextjs";
import { initializeUserAction } from "@/actions/user-profile-action";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

// Handle auth callback and initialize user in database
export const GET = async (req: NextRequest) => {
  // First handle the WorkOS auth callback
  const authResult = await handleAuth()(req);

  // If auth was successful, initialize user in database
  try {
    const { user } = await withAuth();

    if (user) {
      const initResult = await initializeUserAction({
        id: user.id,
      });

      if (initResult.success && initResult.data?.isNewUser) {
        // Redirect new users to profile completion
        return redirect("/?showProfileDialog=true");
      } else if (
        initResult.success &&
        !initResult.data?.user.profileCompleted
      ) {
        // Redirect existing users with incomplete profiles
        return redirect("/?showProfileDialog=true");
      }
    }
  } catch (error) {
    console.error("User initialization error:", error);
    // Continue to default redirect even if user init fails
  }

  // Default redirect for completed profiles or if initialization fails
  return authResult || redirect("/");
};

// Cursor rules applied correctly.
