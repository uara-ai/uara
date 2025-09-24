import BentoGrid from "@/components/kokonutui/bento-grid";

export default function Features() {
  return (
    <div
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      id="features"
    >
      <div className="flex items-center justify-center px-4">
        <div className="hidden sm:flex flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
        <h2 className="px-2 sm:px-6 font-geist-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#085983] text-center">
          Unlock more performance
        </h2>
        <div className="hidden sm:flex flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
      </div>
      <p className="text-center font-geist-sans text-sm sm:text-base md:text-lg lg:text-xl text-[#085983]/80 max-w-4xl mx-auto leading-relaxed px-4 mt-4 sm:mt-6">
        You&apos;re drowning in data but starving for insights. Early adopters
        are already ahead of the curve.
      </p>

      <BentoGrid />
    </div>
  );
}
