import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ProfileCompletionHandler } from "@/components/auth/profile-completion-handler";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { PricingCard } from "@/components/landing/pricing-card";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Remove this */}
      <ProfileCompletionHandler />
      <Navbar />
      <Hero />
      <HowItWorks />
      {/* Demo section like datafast */}
      <Problem />
      <Features />
      <PricingCard hidden />
      <Footer />
    </div>
  );
}

// Cursor rules applied correctly.
