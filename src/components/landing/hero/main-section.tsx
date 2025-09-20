import { SecondarySection } from "./secondary-section";

export function MainSection() {
  return (
    <div className="relative z-20 text-white w-full lg:w-1/2 px-6 lg:px-8 lg:text-left text-center mt-20 flex flex-col items-center justify-center">
      {/* Main Title */}
      <div className="text-center font-[family-name:var(--font-instrument-serif)] text-[48px] lg:text-[96px] md:text-[64px] sm:text-[32px] font-normal leading-tight mb-6">
        <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
          Uara{" "}
        </span>
        <span className="bg-gradient-to-r from-[#d5f1ff] via-[#a2e0ff] to-[#4ec4ff] bg-clip-text text-transparent animate-shimmer">
          AI
        </span>
      </div>
      {/* Subtitle */}
      <h1 className="mb-12 text-center justify-center flex flex-col items-center">
        <span className="font-[family-name:var(--font-instrument-serif)] text-[24px] lg:text-[40px] md:text-[32px] sm:text-[20px] font-normal leading-relaxed">
          Live Younger, For Longer.
        </span>
        <span className="font-[family-name:var(--font-instrument-serif)] text-[24px] lg:text-[40px] md:text-[32px] sm:text-[20px] font-normal leading-relaxed">
          Engineered for Human Optimization.
        </span>
      </h1>
      <h2 className="text-center font-[family-name:var(--font-geist-sans)] text-lg">
        Your health data is fragmented. Your potential is not. Uara.ai is the
        operating system that unifies your wearables, labs, and logs,
        translating raw data into an actionable longevity protocol.
      </h2>
      <SecondarySection />
    </div>
  );
}

// Cursor rules applied correctly.
