"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import React from "react";
import { sidebarItems } from "@/packages/config/sidebar-items";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/packages/config/routes";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="overflow-hidden" {...props}>
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)]"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="md:h-8 md:p-0 mt-2"
              >
                <Link href={routes.overview.home}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-border">
                    <Image src="/logo.svg" alt="uara" width={24} height={24} />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Uara<span className="text-blue-500">.ai</span>
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {sidebarItems.navMain.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn(
                      pathname.includes(item.url) &&
                        "bg-blue-800 text-white rounded-lg"
                    )}
                  >
                    <Link href={item.url}>
                      <SidebarMenuButton
                        tooltip={{
                          children: item.title,
                          hidden: false,
                        }}
                        isActive={pathname.includes(item.url)}
                        className={cn(
                          "px-2.5 md:px-2",
                          pathname.includes(item.url) &&
                            "bg-blue-800 text-white"
                        )}
                      >
                        {item.icon &&
                          React.createElement(item.icon, {
                            className: cn(
                              "size-8",
                              pathname.includes(item.url) &&
                                "dark:text-white light:text-blue-800"
                            ),
                          })}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="text-xs text-muted-foreground text-center">
          beta
        </SidebarFooter>
      </Sidebar>
    </Sidebar>
  );
}
