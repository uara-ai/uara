"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LoginButton } from "./login-button";

interface NavLinksProps {
  isScrolled?: boolean;
}

export function NavLinks({ isScrolled = false }: NavLinksProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
        <Link
          href="#reviews"
          className={`${textColor} ${hoverTextColor} transition-colors font-[family-name:var(--font-instrument-serif)] text-2xl font-normal`}
        >
          Reviews
        </Link>
        <Link
          href="/blog"
          className={`${textColor} ${hoverTextColor} transition-colors font-[family-name:var(--font-instrument-serif)] text-2xl font-normal`}
        >
          Blog
        </Link>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-white hover:text-white/80 transition-colors"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
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
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-80 h-full bg-black/80 backdrop-blur-md border-l border-white/20">
            {/* Close button */}
            <div className="flex justify-end p-6">
              <button
                onClick={toggleMenu}
                className="p-2 text-white hover:text-white/80 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-6 px-6 py-4">
              <Link
                href="#pricing"
                onClick={toggleMenu}
                className={cn(
                  "text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-xl font-normal py-2 border-b border-white/10",
                  pathname === "#pricing" && "text-white"
                )}
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                onClick={toggleMenu}
                className={cn(
                  "text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-xl font-normal py-2 border-b border-white/10",
                  pathname === "#faq" && "text-white"
                )}
              >
                FAQ
              </Link>
              <Link
                href="#reviews"
                onClick={toggleMenu}
                className="text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-xl font-normal py-2 border-b border-white/10"
              >
                Reviews
              </Link>
              <Link
                href="/blog"
                onClick={toggleMenu}
                className="text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-xl font-normal py-2 border-b border-white/10"
              >
                Blog
              </Link>

              {/* Mobile Login Button */}
              <div className="pt-4">
                <LoginButton isScrolled={isScrolled} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Cursor rules applied correctly.
