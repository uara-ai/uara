import { MobileMenu } from "@/components/overview/mobile-menu";
import { UserMenu } from "@/components/overview/user-menu";
import { User } from "@/data/user.type";

export function Header({ user }: { user: User }) {
  return (
    <header className="sticky top-0 flex shrink-0 items-center justify-center gap-2 border-b border-border bg-sidebar p-3">
      <MobileMenu />

      <div className="flex space-x-2 ml-auto">
        <UserMenu user={user} />
      </div>
    </header>
  );
}
