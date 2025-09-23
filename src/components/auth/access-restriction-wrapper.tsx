import { AccessRestrictionOverlay } from "./access-restriction-overlay";
import { AuthUser } from "@/lib/auth";

interface AccessRestrictionWrapperProps {
  children: React.ReactNode;
  user: AuthUser;
}

export async function AccessRestrictionWrapper({
  children,
  user,
}: AccessRestrictionWrapperProps) {
  // If user is authenticated and email doesn't match fed@uara.ai, show restriction overlay
  if (user && user.email !== "fed@uara.ai") {
    return <AccessRestrictionOverlay />;
  }

  // Otherwise, render children normally
  return <>{children}</>;
}

// Cursor rules applied correctly.
