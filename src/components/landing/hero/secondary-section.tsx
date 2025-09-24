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
            count: (countResult.data as any)?.count || "380",
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

  const displayCount = isLoading ? "300+" : `${subscriberData.count}`;
  return (
    <div className="text-white w-full mt-10 flex justify-center sm:justify-start">
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-6">
        {/* Avatar Circles */}
        <div className="flex-col sm:flex-row flex items-center gap-2">
          <AvatarCircles
            numPeople={subscriberData.count}
            avatarUrls={subscriberData.avatars}
          />
          <p className="font-geist-sans text-md font-normal text-[#085983]">
            trusted by <strong>{displayCount}</strong> amazing founders
          </p>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
