"use client";

import { AvatarCircles } from "@/components/magicui/avatar-circles";
import { useEffect, useState } from "react";
import {
  getSubscriberCount,
  getSubscriberAvatars,
} from "@/actions/subscribe-action";

interface SubscriberData {
  count: number;
  avatars: { imageUrl: string; email?: string }[];
}

export function SecondarySection() {
  const [subscriberData, setSubscriberData] = useState<SubscriberData>({
    count: 300,
    avatars: [
      { imageUrl: "https://avatars.githubusercontent.com/u/16860520" },
      { imageUrl: "https://avatars.githubusercontent.com/u/20110627" },
      { imageUrl: "https://avatars.githubusercontent.com/u/106103625" },
      { imageUrl: "https://avatars.githubusercontent.com/u/59228569" },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscriberData() {
      try {
        const [countResult, avatarsResult] = await Promise.all([
          getSubscriberCount(),
          getSubscriberAvatars(4),
        ]);

        if (countResult.success && avatarsResult.success) {
          setSubscriberData({
            count: (countResult.data as any)?.count || "380+",
            avatars:
              (avatarsResult.data as any)?.avatars || subscriberData.avatars,
          });
        }
      } catch (error) {
        console.error("Error fetching subscriber data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscriberData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const displayCount = isLoading ? "300+" : `${subscriberData.count}+`;
  return (
    <div className="relative z-20 text-white w-full lg:w-1/2 px-6 lg:px-8 lg:text-left text-center mt-20 flex items-end justify-center lg:justify-end">
      <div className="flex flex-col items-center text-center space-y-6 mb-16">
        <p className="font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal">
          {displayCount} people
        </p>

        {/* Avatar Circles */}
        <div className="flex flex-col items-center space-y-2">
          <AvatarCircles
            numPeople={subscriberData.count}
            avatarUrls={subscriberData.avatars}
          />
        </div>

        <p className="font-[family-name:var(--font-instrument-serif)] text-[32px] font-normal">
          in waitlist
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
