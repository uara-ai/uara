"use client";

import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Button } from "@/components/ui/button";

export function SignOut() {
  const { signOut } = useAuth();

  return (
    <Button
      onClick={() => signOut()}
      variant="ghost"
      size="sm"
      className="w-full justify-start text-[#085983]"
    >
      Sign out
    </Button>
  );
}
