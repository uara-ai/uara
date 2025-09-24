import type { Metadata } from "next";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/healthspan/v1/app-layout";
import { AccessRestrictionWrapper } from "@/components/auth/access-restriction-wrapper";

export const metadata: Metadata = {
  title: "Healthspan Dashboard | Uara.ai",
  description: "Your personalized longevity dashboard and health insights",
};

interface HealthspanLayoutProps {
  children: React.ReactNode;
}

export const dynamic = "force-dynamic";

export default async function HealthspanLayout({
  children,
}: HealthspanLayoutProps) {
  const user = await withAuth({ ensureSignedIn: true });
  if (!user) {
    redirect("/login");
  }

  // Check if user has access
  if (user.user.email !== "fed@uara.ai") {
    return (
      <AccessRestrictionWrapper user={user.user}>
        {children}
      </AccessRestrictionWrapper>
    );
  }

  // Show full app layout only for fed@uara.ai
  return <AppLayout user={user.user}>{children}</AppLayout>;
}

// Cursor rules applied correctly.
