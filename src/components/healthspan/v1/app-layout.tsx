import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileSidebar } from "./mobile-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RateLimitProvider } from "@/hooks/use-rate-limit-context";

interface AppLayoutProps {
  children: ReactNode;
  className?: string;
  user?: any; // User type for header
}

export function AppLayout({ children, className, user }: AppLayoutProps) {
  return (
    <TooltipProvider>
      <RateLimitProvider>
        <div className="min-h-screen bg-background">
          {/* Mobile sidebar - client component */}
          <MobileSidebar />

          {/* Desktop sidebar - always visible on md+ */}
          <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block md:w-16 lg:w-32">
            <Sidebar />
          </div>

          {/* Main content area */}
          <div className="md:ml-16">
            <div className="mx-auto max-w-7xl">
              {/* Header - responsive design handles mobile vs desktop */}
              <Header user={user} />

              {/* Main content */}
              <main className={cn("flex-1", className)}>
                {/* Content container with responsive padding - add bottom padding for mobile nav */}
                <div className="py-6 pb-20 md:pb-6 bg-slate-100 rounded-2xl mb-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </RateLimitProvider>
    </TooltipProvider>
  );
}

// Cursor rules applied correctly.
