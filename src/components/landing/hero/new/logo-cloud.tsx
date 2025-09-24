import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
import Image from "next/image";

export const LogoCloud = () => {
  return (
    <section className="bg-background pb-16 md:pb-32">
      <div className="group relative m-auto max-w-6xl px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="inline md:max-w-44 md:border-r md:pr-6">
            <p className="text-end text-sm">All the wearables data decoded</p>
          </div>
          <div className="relative py-6 md:w-[calc(100%-11rem)]">
            <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
              <div className="flex items-center gap-2">
                <Image
                  className="mx-auto h-5 w-fit dark:invert"
                  src="/brands/whoop.svg"
                  alt="WHOOP Logo"
                  height={20}
                  width={20}
                />
                <span className="text-sm font-medium">WHOOP</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  className="mx-auto h-5 w-fit dark:invert"
                  src="/brands/apple.png"
                  alt="Apple Logo"
                  height={20}
                  width={20}
                />
                <span className="text-sm font-medium">Apple Health</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  className="mx-auto h-5 w-fit dark:invert"
                  src="/brands/oura.jpg"
                  alt="Oura Logo"
                  height={20}
                  width={20}
                />
                <span className="text-sm font-medium">Oura</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  className="mx-auto h-5 w-fit dark:invert"
                  src="/brands/coros.png"
                  alt="Coros Logo"
                  height={20}
                  width={20}
                />
                <span className="text-sm font-medium">Coros</span>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  className="mx-auto h-5 w-fit dark:invert"
                  src="/brands/garmin.jpg"
                  alt="Garmin Logo"
                  height={20}
                  width={20}
                />
                <span className="text-sm font-medium">Garmin</span>
              </div>
            </InfiniteSlider>

            <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
            <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-20"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-20"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
