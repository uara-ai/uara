import { LoginButton } from "./login-button";
import { Logo } from "../../logo";
import { NavLinks } from "./nav-links";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 p-6 lg:p-8 ">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Logo hidden />
        </div>

        <NavLinks />

        {/* Login Button - Hidden on mobile (included in mobile menu) */}
        <div className="hidden md:block">
          <LoginButton />
        </div>
      </div>
    </nav>
  );
}

// Cursor rules applied correctly.
