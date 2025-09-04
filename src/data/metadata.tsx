import { Twitter, Linkedin, Mail } from "lucide-react";

export const DATA = {
  // Brand & positioning
  name: "Uara.ai | Live younger for longer.",
  initials: "UA",
  url: "https://uara.ai",
  location: "Remote • Europe (CET)",
  locationLink: "https://www.google.com/maps/place/Europe",
  description:
    "All your health data in one place. Uara.ai connects wearables, labs, fitness, and food logs, then uses AI to spot patterns and coach you to a longer, healthier life.",
  summary:
    "Uara.ai is a consumer longevity coach. We aggregate your health data (wearables, labs, fitness, nutrition) and use AI to translate trends into simple, actionable guidance to slow your pace of aging.",

  avatarUrl: "/logo.svg",

  // 🔎 Primary keywords / services (used across pages & schema)
  skills: [
    "Longevity coaching app",
    "Biological age tracking",
    "Pace of aging (Whoop) insights",
    "HRV, sleep, recovery analytics",
    "Lab test upload & AI explanation",
    "Nutrition & lifestyle correlation",
    "Personalized health recommendations",
    "Health data aggregation",
    "Privacy-first health vault",
    "Weekly healthspan reports",
    "Aging score & trendlines",
    "Consumer health intelligence",
    "Consumer longevity coach",
  ],

  contact: {
    email: "fed@uara.ai",
    tel: "",
    social: {
      Twitter: {
        name: "Twitter / X",
        url: "https://x.com/FedericoFan",
        icon: Twitter,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/federico-fanini/",
        icon: Linkedin,
        navbar: true,
      },
      Email: {
        name: "Email",
        url: "mailto:fed@uara.ai",
        icon: Mail,
        navbar: false,
      },
    },
  },

  // Optional: audiences/use-cases you target (helps long-tail)
  industries: [
    "Longevity enthusiasts",
    "Biohackers",
    "Wearables",
    "Labs",
    "Fitness",
    "Nutrition",
    "Healthspan",
    "Aging score",
    "Aging trendlines",
    "Aging insights",
    "Aging analysis",
    "Aging report",
    "Aging coach",
    "Aging advisor",
    "Aging coach app",
    "Aging advisor app",
    "Whoop",
    "Athletes & high performers",
    "Busy professionals",
    "Wellness & fitness communities",
  ],

  // 🔎 Long-tail keywords you want to rank for
  keywords: [
    "longevity coach app",
    "longevity panel app",
    "biological age tracker",
    "wearables",
    "labs",
    "fitness",
    "nutrition",
    "healthspan",
    "aging score",
    "aging trendlines",
    "aging insights",
    "aging analysis",
    "aging report",
    "aging coach",
    "aging advisor",
    "aging coach app",
    "whoop",
    "athletes & high performers",
    "pace of aging whoop",
    "hrv sleep recovery analytics",
    "ai health insights",
    "lab test explanation ai",
    "health data aggregator app",
    "nutrition correlation hrv",
  ],

  // 🌐 Per-page SEO metadata (titles, descriptions, og)
  meta: {
    home: {
      title: "Uara.ai — Live younger for longer | Track, Understand, Improve",
      description:
        "Connect Whoop, labs, fitness, and nutrition. Uara.ai uses AI to find patterns, explain results, and coach you to slow your pace of aging.",
      ogImage: "/og/opengraph-image.png",
    },
    pricing: {
      title: "Pricing — Uara.ai Longevity Coach",
      description:
        "Simple plans for longevity coaching. Start with core insights, upgrade for advanced correlations and weekly healthspan reports.",
      ogImage: "/og/opengraph-image.png",
    },
    howItWorks: {
      title: "How It Works — Data In, Insight Out | Uara.ai",
      description:
        "Connect your data, get a unified health dashboard, and receive AI-powered insights and weekly reports focused on healthspan.",
      ogImage: "/og/opengraph-image.png",
    },
    faq: {
      title: "FAQ — Uara.ai Longevity Coach",
      description:
        "What data does Uara.ai use? How do insights work? Is it medical advice? Learn how we approach privacy, security, and recommendations.",
      ogImage: "/og/opengraph-image.png",
    },
    transparency: {
      title: "Transparency — Roadmap & Principles | Uara.ai",
      description:
        "Our approach to privacy, data ownership, and product roadmap. Uara.ai is a user-first, privacy-first health product.",
      ogImage: "/og/opengraph-image.png",
    },
    wallOfLove: {
      title: "Wall of Love — Stories from Early Users | Uara.ai",
      description:
        "Feedback and testimonials from people improving their recovery, sleep, and aging pace with Uara.ai.",
      ogImage: "/og/opengraph-image.png",
    },
    request: {
      title: "Join the Waitlist — Get Early Access | Uara.ai",
      description:
        "Be first to try Uara.ai. Connect your data and start receiving personalized longevity insights.",
      ogImage: "/og/opengraph-image.png",
    },
    examples: {
      title: "Features — What Uara.ai Can Do",
      description:
        "Whoop-first dashboard, AI lab explanations, nutrition & lifestyle correlations, weekly healthspan reports.",
      ogImage: "/og/opengraph-image.png",
    },
    changelog: {
      title: "Changelog — Building Uara.ai in Public",
      description:
        "Product updates and improvements as we build a consumer longevity coach focused on healthspan.",
      ogImage: "/og/opengraph-image.png",
    },
  },

  // ⚙️ JSON-LD (inject via Next metadata API)
  schemaOrg: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Uara.ai",
      url: "https://uara.ai",
      logo: "https://uara.ai/logo-uara.png",
      sameAs: [
        "https://x.com/FedericoFan",
        "https://www.linkedin.com/in/federico-fanini/",
        "https://uara.ai",
      ],
    },
    // Represent the app itself
    app: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Uara.ai — Longevity Coach",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description:
        "A consumer longevity coach that aggregates health data (Whoop, labs, fitness, nutrition) and uses AI to deliver actionable insights.",
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        // Use a placeholder or bind to your actual plan later
        price: "0.00",
        availability: "https://schema.org/PreOrder",
        url: "https://uara.ai/waitlist",
      },
      publisher: { "@type": "Organization", name: "Uara.ai" },
    },
  },
} as const;
