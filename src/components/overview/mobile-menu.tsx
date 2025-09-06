"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/packages/config/sidebar-items";
import { routes } from "@/packages/config/routes";
import { cn } from "@/lib/utils";
import React from "react";

export function MobileMenu() {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
          className="rounded-full w-8 h-8 items-center relative flex md:hidden"
        >
          <Menu className="w-4 h-4 text-primary" />
        </Button>
      </div>
      <SheetContent
        side="left"
        className="border-none rounded-none -ml-4 bg-slate-50"
      >
        {/* Header with Logo */}
        <div className="flex items-center space-x-3 p-4 border-b border-border ml-4">
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg border border-border">
            <Image src="/logo.svg" alt="uara" width={30} height={30} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-blue-800">
              Uara<span className="text-blue-500">.ai</span>
            </span>
            <span className="text-xs text-muted-foreground">Health OS</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 ml-6">
          <nav className="space-y-2">
            {sidebarItems.navMain.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  pathname.includes(item.url)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.icon &&
                  React.createElement(item.icon, {
                    className: cn(
                      "size-4",
                      pathname.includes(item.url) && "text-primary"
                    ),
                  })}
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} Uara.ai Health OS
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
