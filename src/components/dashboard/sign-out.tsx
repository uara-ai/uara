"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignOut() {
  const { signOut, user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // Redirect to homepage after successful sign out
      router.push("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!user) return null;

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
    </DropdownMenuItem>
  );
}
