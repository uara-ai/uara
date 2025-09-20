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
    return [
      {
        source: "/js/script.js",
        destination: "https://datafa.st/js/script.js",
      },
      {
        source: "/api/events",
        destination: "https://datafa.st/api/events",
      },
    ];
  },
};

export default nextConfig;
