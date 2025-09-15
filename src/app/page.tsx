import { Footer } from "@/components/landing/footer";
import { ProfileCompletionHandler } from "@/components/auth/profile-completion-handler";
import { Hero } from "@/components/landing/hero/hero";
import { Navbar } from "@/components/landing/hero/navbar";
// import { Problem } from "@/components/landing/problem";
// import { HowItWorks } from "@/components/landing/how-it-works";
// import { Features } from "@/components/landing/features";
// import { PricingCard } from "@/components/landing/pricing-card";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      <div>
        <Hero />
      </div>

      <Footer />
    </div>
  );
}

// Cursor rules applied correctly.
