import { DocSidebar } from "@/components/design-system/docs-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DocHeader } from "@/components/design-system/doc-header";

export default function UILayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DocSidebar />
      <SidebarInset>
        <DocHeader />
        <div className="flex flex-1 flex-col gap-4 py-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
