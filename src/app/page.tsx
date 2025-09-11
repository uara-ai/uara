import { Navbar } from "@/components/landing/navbar";
//import { WipBanner } from "@/components/landing/wip-banner";
import { Footer } from "@/components/landing/footer";
import { ProfileCompletionHandler } from "@/components/auth/profile-completion-handler";
import { Hero } from "@/components/landing/hero";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
// import { Timeline } from "@/components/landing/timeline";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Remove this */}
      <ProfileCompletionHandler />
      <Navbar />
      <Hero />
      <SmoothCursor />
      {/* <Timeline /> 
      <WipBanner />*/}
      <Footer />
    </div>
  );
}

// Cursor rules applied correctly.
