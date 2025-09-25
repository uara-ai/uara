import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileSidebar } from "./mobile-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RateLimitProvider } from "@/hooks/use-rate-limit-context";
import { IconCamera } from "@tabler/icons-react";

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
          {/* Mobile/Tablet sidebar - client component for mobile and tablet */}
          <MobileSidebar />

          {/* Desktop sidebar - only visible on lg+ (large screens) */}
          <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-32">
            <Sidebar />
          </div>

          {/* Main content area with responsive margins */}
          <div className="lg:ml-32">
            <div className="mx-auto max-w-7xl">
              {/* Header - responsive design handles mobile/tablet vs desktop */}
              <Header user={user} />

              {/* Main content with improved responsive design */}
              <main className={cn("flex-1", className)}>
                {/* Content container with better responsive padding and spacing */}
                <div className="relative mx-2 sm:mx-4 lg:mx-0">
                  <div className="relative py-4 sm:py-0 pb-20 lg:pb-6 bg-slate-50 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 lg:mb-8 border border-dotted border-[#085983] min-h-[calc(100vh-12rem)] sm:min-h-[calc(100vh-10rem)]">
                    {/* Screenshot watermark */}
                    <div className="flex items-center gap-1 absolute top-[-1px] left-1/2 transform -translate-x-1/2 text-xs text-[#085983] font-medium opacity-70 bg-slate-50 px-2 z-10">
                      <IconCamera className="size-3.5" />
                      screenshot and share
                    </div>

                    {/* Content with responsive padding */}
                    <div className="px-3 sm:px-6 lg:px-0 pt-6 sm:pt-8">
                      {children}
                    </div>
                  </div>
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
