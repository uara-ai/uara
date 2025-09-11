"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { User } from "@/lib/user.type";
import { UserMenu } from "@/components/auth/user-menu";
import { Logo } from "../logo";
import { routes } from "@/packages/config/routes";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

interface NavbarProps {
  user: User | null;
}

const menuItems = [
  {
    label: "Pricing",
    href: routes.home.pricing, // or #pricing
  },
  {
    label: "FAQ",
    href: routes.home.faq,
  },
  {
    label: "Reviews",
    href: routes.home.reviews,
  },
  {
    label: "Blog",
    href: routes.home.blog,
  },
];

const Navbar = memo(() => {
  const user = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav
        className={cn(
          "fixed left-0 right-0 z-30 top-0 border-b border-border/40 transition-all duration-200 bg-background"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className={cn("flex items-center")}>
              <Logo className="h-8 w-8" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-foreground",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop User Menu */}
            <div className={cn("hidden md:flex items-center")}>
              <UserMenu user={user.user} />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="border-b border-border pb-4">
                    <SheetTitle className="text-left">Menu</SheetTitle>
                  </SheetHeader>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-4 mt-6">
                    {menuItems.map((item) => (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "text-base font-medium py-2 px-4 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground"
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>

                  {/* Mobile User Menu */}
                  <div className="mt-8 pt-6 border-t border-border">
                    {user ? (
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-3 px-4 py-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {user.user?.firstName?.charAt(0)?.toUpperCase() ||
                                user.user?.email?.charAt(0)?.toUpperCase() ||
                                "U"}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {`${user.user?.firstName || ""} ${
                                user.user?.lastName || ""
                              }`.trim() || user.user?.email}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.user?.email}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <SheetClose asChild>
                            <Link
                              href="/account"
                              className="text-sm py-2 px-4 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              Account
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href="/account/support"
                              className="text-sm py-2 px-4 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              Support
                            </Link>
                          </SheetClose>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4">
                        <SheetClose asChild>
                          <Link href="/login">
                            <Button className="w-full" size="sm">
                              Login
                            </Button>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
});

Navbar.displayName = "Navbar";

export { Navbar };
