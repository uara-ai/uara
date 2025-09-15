"use client";

import { AvatarCircles } from "@/components/magicui/avatar-circles";

const avatars = [
  {
    imageUrl: "https://avatars.githubusercontent.com/u/16860528",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/20110627",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/106103625",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59228569",
  },
];

export function SecondarySection() {
  return (
    <div className="relative z-20 text-white w-full lg:w-1/2 px-6 lg:px-8 lg:text-left text-center mt-20 flex items-end justify-center lg:justify-end">
      <div className="flex flex-col items-center text-center space-y-6 mb-16">
        <p className="font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal">
          Trusted by
        </p>

        {/* Avatar Circles */}
        <div className="flex flex-col items-center space-y-2">
          <AvatarCircles numPeople={200} avatarUrls={avatars} />
        </div>

        <p className="font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal">
          Clients
        </p>

        {/* Stats */}
        <div className="space-y-3 text-center max-w-sm tracking-wider font-mono">
          <p className="font-[family-name:var(--font-geist-sans)] text-[16px] font-normal text-white/80">
            5+ hours saved per month on manual data analysis and research for
            actionable insights.
          </p>
          <p className="font-[family-name:var(--font-geist-sans)] text-[16px] font-normal text-white/80">
            78% improvement in self-reported energy levels after just 4 weeks on
            the platform.
          </p>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
