import BentoGrid from "@/components/kokonutui/bento-grid";
import { TextEffect } from "@/components/motion-primitives/text-effect";

export default function Features() {
  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
      <div className="flex items-center justify-center">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
        <h2 className="px-6 font-geist-sans text-3xl sm:text-4xl lg:text-5xl font-normal text-[#085983]">
          Unlock more performance
        </h2>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
      </div>
      <p className=" text-center font-geist-sans text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0 mt-4">
        Wearables. Labs. Apps. All disconnected. You&apos;re drowning in data
        but starving for insights. Early adopters are already ahead of the
        curve.
      </p>

      <BentoGrid />
    </div>
  );
}
