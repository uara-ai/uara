"use client";

import React, { useState, memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "./theme-switcher";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

import {
  Binoculars,
  Book,
  Bug,
  Code,
  FileText,
  Github,
  Info,
  Instagram,
  Settings,
  Shield,
  Sun,
} from "lucide-react";
import { Icons } from "./ui/icons";

// Navigation Menu Component - contains all the general navigation items
export const NavigationMenu = memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center hover:bg-accent hover:text-accent-foreground rounded-md transition-colors cursor-pointer !size-6 !p-0 !m-0">
              <Settings />
            </div>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          Menu
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-[240px] z-[110] mr-5">
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/lookout" className="w-full flex items-center gap-2">
            <Binoculars size={16} />
            <span>Lookout</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link
            href={"https://api.scira.ai/"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2"
          >
            <Code size={16} />
            <span>API</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer py-1 hover:bg-transparent!">
          <div
            className="flex items-center justify-between w-full px-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Sun size={16} />
              <span className="text-sm">Theme</span>
            </div>
            <ThemeSwitcher />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* About and Information */}
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/about" className="w-full flex items-center gap-2">
            <Info size={16} />
            <span>About</span>
          </Link>
        </DropdownMenuItem>
        {/* Blog */}
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/blog" className="w-full flex items-center gap-2">
            <Book size={16} />
            <span>Blog</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="/terms" className="w-full flex items-center gap-2">
            <FileText size={16} />
            <span>Terms</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link
            href="/privacy-policy"
            className="w-full flex items-center gap-2"
          >
            <Shield size={16} />
            <span>Privacy</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* Social and External Links */}
        <DropdownMenuItem className="cursor-pointer" asChild>
          <a
            href={"https://git.new/scira"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2"
          >
            <Github size={16} />
            <span>Github</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <a
            href={"https://x.com/sciraai"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2"
          >
            <Icons.twitter />
            <span>X.com</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" asChild>
          <a
            href={"https://www.instagram.com/scira.ai"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2"
          >
            <Instagram size={16} />
            <span>Instagram</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" asChild>
          <a
            href={"https://scira.userjot.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2"
          >
            <Bug className="size-4" />
            <span>Feature/Bug Request</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
