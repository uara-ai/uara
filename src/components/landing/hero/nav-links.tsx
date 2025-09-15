"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { LoginButton } from "./login-button";
import { Logo } from "@/components/logo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavLinksProps {
  isScrolled?: boolean;
}

export function NavLinks({ isScrolled = false }: NavLinksProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define text color based on scroll state
  const textColor = isScrolled ? "text-[#085983]" : "text-white/90";
  const hoverTextColor = isScrolled
    ? "hover:text-[#085983]/80"
    : "hover:text-white";
  const activeTextColor = isScrolled ? "text-[#085983]" : "text-white";

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8 ml-8">
        <Link
          href="#features"
          className={`${textColor} ${hoverTextColor} transition-colors font-[family-name:var(--font-instrument-serif)] text-2xl font-normal`}
        >
          Features
        </Link>
        <Link
          href="#pricing"
          className={cn(
            `${textColor} ${hoverTextColor} transition-colors font-[family-name:var(--font-instrument-serif)] text-2xl font-normal`,
            pathname === "#pricing" && activeTextColor
          )}
        >
          Pricing
        </Link>
        <Link
          href="#faq"
          className={cn(
            `${textColor} ${hoverTextColor} transition-colors font-[family-name:var(--font-instrument-serif)] text-2xl font-normal`,
            pathname === "#faq" && activeTextColor
          )}
        >
          FAQ
        </Link>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <button
            className={cn(
              "md:hidden p-4 text-white hover:text-white/80 transition-colors",
              textColor
            )}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-menu-3"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 6h10" />
              <path d="M4 12h16" />
              <path d="M7 12h13" />
              <path d="M4 18h10" />
            </svg>
          </button>
        </SheetTrigger>

        <SheetContent side="right" className="w-80 bg-white">
          <SheetHeader className="pb-6">
            <SheetTitle className="flex items-center justify-start">
              <Logo hidden />
            </SheetTitle>
          </SheetHeader>

          <SheetDescription className="pl-6 pr-6">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-6">
              <Link
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-gray-700 hover:text-[#085983] transition-colors font-[family-name:var(--font-instrument-serif)] text-xl font-normal py-2 border-b border-gray-200"
                )}
              >
                Features
              </Link>
              <Link
                href="#pricing"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-gray-700 hover:text-[#085983] transition-colors font-[family-name:var(--font-instrument-serif)] text-xl font-normal py-2 border-b border-gray-200"
                )}
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-gray-700 hover:text-[#085983] transition-colors font-[family-name:var(--font-instrument-serif)] text-xl font-normal py-2 border-b border-gray-200"
                )}
              >
                FAQ
              </Link>

              {/* Mobile Login Button */}
              <div className="pt-4">
                <LoginButton className="bg-[#085983] hover:bg-[#085983]/90 text-white w-full" />
              </div>
            </div>
          </SheetDescription>
        </SheetContent>
      </Sheet>
    </>
  );
}

// Cursor rules applied correctly.
