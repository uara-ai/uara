import { Navbar } from "@/components/landing/navbar";
import { WipBanner } from "@/components/landing/wip-banner";
import { Footer } from "@/components/landing/footer";
import { ProfileCompletionHandler } from "@/components/auth/profile-completion-handler";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Remove this */}
      <ProfileCompletionHandler />
      <Navbar />
      <Hero />
      <WipBanner />
      <Footer />
    </div>
  );
}

// Cursor rules applied correctly.
