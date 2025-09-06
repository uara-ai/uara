import { signOut } from "@workos-inc/authkit-nextjs";
import { Button } from "@/components/ui/button";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="w-full justify-start"
      >
        Sign out
      </Button>
    </form>
  );
}
