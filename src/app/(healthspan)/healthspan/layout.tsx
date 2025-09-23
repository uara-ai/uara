import type { Metadata } from "next";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";
import { AppLayout } from "@/components/healthspan/v1/app-layout";

export const metadata: Metadata = {
  title: "Healthspan Dashboard | Uara.ai",
  description: "Your personalized longevity dashboard and health insights",
};

interface HealthspanLayoutProps {
  children: React.ReactNode;
}

export default async function HealthspanLayout({
  children,
}: HealthspanLayoutProps) {
  const user = await withAuth({ ensureSignedIn: true });
  if (!user) {
    redirect("/login");
  }

  return <AppLayout user={user.user}>{children}</AppLayout>;
}

// Cursor rules applied correctly.
