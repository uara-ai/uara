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
  const textColor = isScrolled ? "text-[#085983]" : "text-white";
  const hoverTextColor = isScrolled
    ? "hover:text-[#085983]/80"
    : "hover:text-white";
  const bgColor = isScrolled ? "bg-white/80" : "bg-white/5";
  const hoverBgColor = isScrolled ? "hover:bg-white" : "hover:bg-white/10";
  const borderColor = "border-[#085983]"; // Keep border consistent

  return (
    <Link href="/login">
      <Button
        variant="outline"
        className={cn(
          `${bgColor} ${hoverBgColor} border-2 ${borderColor} ${textColor} ${hoverTextColor} ${className} font-[family-name:var(--font-instrument-serif)] text-base tracking-wider font-normal px-4 py-2 h-auto backdrop-blur-sm rounded-full transition-all duration-200`
        )}
        data-fast-goal="login_button_nav_click"
      >
        Login
        <LogIn className="ml-2 w-4 h-4" />
      </Button>
    </Link>
  );
}

// Cursor rules applied correctly.
