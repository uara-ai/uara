"use client";

import React, { useState, memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

import {
  Book,
  Bug,
  FileText,
  Github,
  Info,
  Instagram,
  Menu,
  Shield,
} from "lucide-react";
import { Icons } from "./ui/icons";

// Navigation Menu Component - contains all the general navigation items
export const NavigationMenu = memo(function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center justify-center mr-4 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors cursor-pointer">
              <Menu className="size-4 " />
            </div>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={4}>
          Menu
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-[240px] z-[110] mr-10 mt-2">
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
