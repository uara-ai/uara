import { getBillingInfoAction } from "@/actions/get-billing-info-action";
import { getUserById, createUser } from "@/lib/db/queries";
import type { User } from "@/lib/db/schema";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

export type AuthUser = {
  id: string;
  email?: string;
  name?: string | null;
  surname?: string | null;
  pictureUrl?: string | null;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { user } = await withAuth({ ensureSignedIn: true });
    if (!user) redirect("/login");

    return {
      id: user.id,
      email: user.email,
      name: user.firstName,
      surname: user.lastName,
      pictureUrl: user.profilePictureUrl,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getOrCreateUser(
  workosUser: AuthUser
): Promise<User | null> {
  try {
    // Try to get existing user
    let user = await getUserById(workosUser.id);

    // If user doesn't exist, create them
    if (!user) {
      user = await createUser({
        id: workosUser.id,
        profileCompleted: false,
        dataProcessingConsent: false,
      });
    }

    return user;
  } catch (error) {
    console.error("Error getting or creating user:", error);
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireUser(): Promise<User> {
  const authUser = await requireAuth();
  const user = await getOrCreateUser(authUser);
  if (!user) {
    throw new Error("Failed to get or create user");
  }
  return user;
}

// Check if user has pro subscription
export async function isProUser(): Promise<boolean> {
  try {
    const result = await getBillingInfoAction({});

    if (!result.data) {
      return false;
    }

    const subscription = result.data.Subscription;

    // Check if user has an active subscription
    if (!subscription) {
      return false;
    }

    // Check if subscription is active and not canceled
    const isActive = subscription.status === "active";
    const isNotCanceled = !subscription.canceledAt && !subscription.endedAt;
    const isNotExpired = subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd) > new Date()
      : true;

    return isActive && isNotCanceled && isNotExpired;
  } catch (error) {
    console.error("Error checking pro status:", error);
    return false;
  }
}

// Cursor rules applied correctly.
