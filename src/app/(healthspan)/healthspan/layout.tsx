import type { Metadata } from "next";
import { AppSidebar } from "@/components/healthspan/app-sidebar";
import { SiteHeader } from "@/components/healthspan/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Healthspan Dashboard | Uara.ai",
  description: "Your personalized longevity dashboard and health insights",
};

interface HealthspanLayoutProps {
  children: React.ReactNode;
}

export default function HealthspanLayout({ children }: HealthspanLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Cursor rules applied correctly.
