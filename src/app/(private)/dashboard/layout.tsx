import { Header } from "@/components/dashboard/header";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* Desktop Layout */}
      <SidebarProvider className="hidden md:flex">
        <AppSidebar />
        <SidebarInset>
          <div className="hidden md:block">
            <Header />
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-100">
            <NuqsAdapter>{children}</NuqsAdapter>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 bg-slate-100 min-h-screen">
          <NuqsAdapter>{children}</NuqsAdapter>
        </div>
      </div>
    </div>
  );
}
