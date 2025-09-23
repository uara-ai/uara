import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "workoscdn.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
    ],
  },
  async rewrites() {
    return {
      // Handle subdomain routing for ui.uara.ai
      beforeFiles: [
        {
          source: "/(.*)",
          destination: "/ui/$1",
          has: [
            {
              type: "host",
              value: "ui.uara.ai",
            },
          ],
        },
        {
          source: "/",
          destination: "/ui",
          has: [
            {
              type: "host",
              value: "ui.uara.ai",
            },
          ],
        },
      ],
    };
  },
};

export default nextConfig;
