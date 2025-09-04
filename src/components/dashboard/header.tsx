import { MobileMenu } from "@/components/dashboard/mobile-menu";
import { UserMenu } from "@/components/dashboard/user-menu";

export function Header() {
  return (
    <header className="sticky top-0 flex shrink-0 items-center justify-center gap-2 border-b border-border bg-slate-50 p-3">
      <MobileMenu />

      <div className="flex space-x-2 ml-auto">
        <UserMenu />
      </div>
    </header>
  );
}
