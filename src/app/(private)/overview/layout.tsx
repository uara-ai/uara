import { Header } from "@/components/overview/header";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/overview/sidebar";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { User } from "@/data/user.type";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await withAuth({ ensureSignedIn: true });

  return (
    <div className="relative">
      {/* Desktop Layout */}
      <SidebarProvider className="hidden md:flex">
        <AppSidebar />
        <SidebarInset>
          <div className="hidden md:block">
            <Header user={user as User} />
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6 ml-12">
            <NuqsAdapter>{children}</NuqsAdapter>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <Header user={user as User} />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <NuqsAdapter>{children}</NuqsAdapter>
        </div>
      </div>
    </div>
  );
}
