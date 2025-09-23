"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { SocialLinks } from "./social-links";
import { IconPackage } from "@tabler/icons-react";

interface DocHeaderProps {
  title?: string;
  description?: string;
  showBreadcrumb?: boolean;
}

export function DocHeader({
  title = "UI Components",
  description = "Component library documentation",
  showBreadcrumb = true,
}: DocHeaderProps) {
  return (
    <header className="flex h-auto min-h-16 shrink-0 items-center gap-2 border-b border-[#085983]/20 px-4 sm:px-6 py-3 font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center gap-3 flex-1">
        <SidebarTrigger className="-ml-1 text-[#085983] hover:bg-[#085983]/10" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 bg-[#085983]/20"
        />

        {/* Breadcrumb - hidden on mobile */}
        {showBreadcrumb && (
          <>
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/ui"
                    className="text-[#085983]/60 hover:text-[#085983]"
                  >
                    Overview
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}
      </div>

      {/* Social Links */}
      <SocialLinks className="ml-auto" showStars={true} />
    </header>
  );
}
