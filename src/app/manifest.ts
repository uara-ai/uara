import { MetadataRoute } from "next";
import { DATA } from "@/lib/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Uara.ai - Live younger for longer",
    short_name: "Uara.ai",
    description: DATA.description,
    start_url: "/healthspan",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    scope: "/healthspan",
    id: "/healthspan",
    categories: ["health", "fitness", "lifestyle", "productivity"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/og/opengraph-image.png",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "Uara.ai Dashboard - Your Longevity Coach",
      },
    ],
    shortcuts: [
      {
        name: "Dashboard",
        short_name: "Dashboard",
        description: "View your health dashboard",
        url: "/healthspan",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "AI Chat",
        short_name: "Chat",
        description: "Chat with your AI longevity coach",
        url: "/healthspan/chat",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      {
        name: "Whoop Data",
        short_name: "Whoop",
        description: "View your Whoop health insights",
        url: "/healthspan/whoop",
        icons: [
          {
            src: "/brands/whoop.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
      {
        name: "Account",
        short_name: "Account",
        description: "Manage your account and settings",
        url: "/healthspan/account",
        icons: [
          {
            src: "/logo.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
  };
}

// Cursor rules applied correctly.
