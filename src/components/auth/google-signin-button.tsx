"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Icons } from "../ui/icons";

export function GoogleSignInButton() {
  const { signInWithGoogle, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={loading || isSigningIn}
      variant="default"
      className="active:scale-[0.98] bg-primary px-6 py-4 text-secondary font-medium flex space-x-2 h-[40px] w-full"
    >
      {isSigningIn ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <>
          <Icons.google />
          <span>Continue with Google</span>
        </>
      )}
    </Button>
  );
}

export function GoogleSignOutButton() {
  const { signOut, user } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!user) return null;

  return (
    <Button
      onClick={handleSignOut}
      disabled={isSigningOut}
      variant="ghost"
      className="w-full"
    >
      {isSigningOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isSigningOut ? "Signing out..." : "Sign out"}
    </Button>
  );
}
