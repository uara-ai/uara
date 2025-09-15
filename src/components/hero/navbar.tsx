"use client";

import Link from "next/link";
import { LoginButton } from "./login-button";
import { usePathname } from "next/navigation";
import { routes } from "@/packages/config/routes";
import { cn } from "@/lib/utils";
import { Logo } from "../logo";

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="absolute top-0 left-0 right-0 z-30 p-6 lg:p-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Logo hidden />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="#pricing"
            className={cn(
              "text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal",
              pathname === "#pricing" && "text-white"
            )}
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className={cn(
              "text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal",
              pathname === "#faq" && "text-white"
            )}
          >
            FAQ
          </Link>
          <Link
            href="#reviews"
            className="text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal"
          >
            Reviews
          </Link>
          <Link
            href="/blog"
            className="text-white/90 hover:text-white transition-colors font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal"
          >
            Blog
          </Link>
        </div>

        {/* Login Button */}
        <LoginButton />
      </div>
    </nav>
  );
}

// Cursor rules applied correctly.
