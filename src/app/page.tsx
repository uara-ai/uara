import { Footer } from "@/components/landing/footer";
import { ProfileCompletionHandler } from "@/components/auth/profile-completion-handler";
import { Hero } from "@/components/landing/hero/hero";
import { Navbar } from "@/components/landing/hero/navbar";
import { HowItWorks } from "@/components/landing/how-it-works";
import { PricingSection } from "@/components/landing/pricing/pricing-section";
import { EarlyAdoptersSection } from "@/components/landing/early-adopters-section";
// import { Problem } from "@/components/landing/problem";
// import { HowItWorks } from "@/components/landing/how-it-works";
// import { Features } from "@/components/landing/features";
// import { PricingCard } from "@/components/landing/pricing-card";
import { FAQ } from "@/components/landing/faq";
import { BottomCTA } from "@/components/landing/bottom-cta";
import { Wearables } from "@/components/landing/wearables";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      <div>
        <Hero />
        <Wearables />
        <EarlyAdoptersSection />
        <HowItWorks />
        <PricingSection redirectTo="/waitlist" />
        <FAQ />
        <BottomCTA />
      </div>

      <Footer />
    </div>
  );
}

// Cursor rules applied correctly.
