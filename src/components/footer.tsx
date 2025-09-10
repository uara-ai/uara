import { Logo } from "./logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icons } from "./ui/icons";
import { Heart } from "lucide-react";

export function Footer({ fullWidth = false }: { fullWidth?: boolean }) {
  const mainLinks = [
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ];

  const otherLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ];

  const socialLinks = [
    { href: "https://x.com/uaradotai", icon: Icons.x, label: "X/Twitter" },
  ];

  return (
    <footer className="border-t border-border bg-background px-4 md:px-0 mt-24">
      <div className={cn("mx-auto py-12", !fullWidth && "container")}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="space-y-4">
            <Logo />
            <div className="space-y-2">
              <p className="text-xs text-primary font-medium tracking-wider">
                Live younger, for longer.
              </p>
              <p className="text-[10px] text-muted-foreground">
                All your health data in one place. We connects wearables, labs,
                fitness, and food logs, then uses AI to spot patterns and coach
                you to a longer, healthier life.
              </p>
            </div>
          </div>

          {/* Main Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Links</h4>
            <div className="space-y-2">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block text-xs text-muted-foreground hover:text-primary transition-colors"
                  )}
                  prefetch
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Other Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Legal</h4>
            <div className="space-y-2">
              {otherLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block text-xs text-muted-foreground hover:text-primary transition-colors"
                  )}
                  prefetch
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social & Inside Jokes */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Social</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <link.icon className="size-4" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-mono tracking-wider">
                The Notion for health.
              </p>
            </div>

            <div className="space-y-1 text-right">
              <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                Made with <Heart className="size-3 fill-red-500 text-red-500" />{" "}
                by{" "}
                <Link
                  href="https://x.com/FedericoFan"
                  target="_blank"
                  className="hover:underline hover:underline-offset-2 hover:text-primary"
                >
                  Federico
                </Link>
              </p>
              <p className="text-[10px] text-muted-foreground">
                © 2025 uara.ai - All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
