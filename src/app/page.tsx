import { Footer } from "@/components/landing/new/footer";
import { BottomCTA } from "@/components/landing/new/bottom-cta";
import HeroSection from "@/components/landing/new/hero-section";
import { HeroHeader } from "@/components/landing/new/header";
import Features from "@/components/landing/new/features";
import Pricing from "@/components/landing/new/pricing";
import FAQ from "@/components/landing/new/faq";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <HeroHeader />

      <div>
        <HeroSection />
        <Features />
        <Pricing />

        <FAQ />
        <BottomCTA />
      </div>

      <Footer />
    </div>
  );
}

// Cursor rules applied correctly.
