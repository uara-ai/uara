"use client";

import { useState, useEffect } from "react";
import { LoginButton } from "./login-button";
import { Logo } from "../../logo";
import { NavLinks } from "./nav-links";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the hero section (viewport height)
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      setIsScrolled(scrollY > viewportHeight * 0.8); // Trigger at 80% of viewport height
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-30 p-2 lg:p-4 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md border-b border-[#085983]/50"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Logo hidden />
        </div>

        <NavLinks isScrolled={isScrolled} />

        {/* Login Button - Hidden on mobile (included in mobile menu) */}
        <div className="hidden md:block">
          <LoginButton isScrolled={isScrolled} />
        </div>
      </div>
    </nav>
  );
}

// Cursor rules applied correctly.
