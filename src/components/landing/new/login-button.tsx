import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoginButtonProps {
  isScrolled?: boolean;
  className?: string;
}

export function LoginButton({
  className,
  isScrolled = false,
}: LoginButtonProps) {
  // Define colors based on scroll state
  const textColor = isScrolled ? "text-[#085983]" : "text-[#085983]";
  const hoverTextColor = isScrolled
    ? "hover:text-[#085983]/80"
    : "hover:text-[#085983]/80";
  const bgColor = isScrolled ? "bg-white/80" : "bg-white/5";
  const hoverBgColor = isScrolled ? "hover:bg-white" : "hover:bg-white/10";
  const borderColor = "border-[#085983]"; // Keep border consistent

  return (
    <Button
      variant="outline"
      className={cn(
        `${bgColor} ${hoverBgColor} border-2 ${borderColor} ${textColor} ${hoverTextColor} ${className} font-geist-sans text-sm tracking-wider font-semibold px-4 py-2 h-auto backdrop-blur-sm rounded-full transition-all duration-200`
      )}
      asChild
    >
      <Link href="/login" className="flex items-center">
        Get Started
        <LogIn className="ml-2 w-4 h-4" />
      </Link>
    </Button>
  );
}

// Cursor rules applied correctly.
