import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <Link href="/login">
      <Button
        variant="outline"
        className="bg-white/5 border-2 border-[#085983] text-white hover:bg-white/10 hover:text-white font-[family-name:var(--font-instrument-serif)] text-base tracking-wider font-normal px-4 py-2 h-auto backdrop-blur-sm rounded-full transition-all duration-200"
      >
        Login
        <LogIn className="ml-2 w-4 h-4" />
      </Button>
    </Link>
  );
}

// Cursor rules applied correctly.
