export const routes = {
  home: {
    root: "/",
    pricing: "/pricing",
    faq: "/faq",
    reviews: "/reviews",
    blog: "/blog",
    privacy: "/privacy",
    terms: "/terms",
    login: "/login",
    register: "/register",
  },
  api: {
    stripe: {
      checkout: "/api/stripe/checkout",
      portal: "/api/stripe/portal",
      webhook: "/api/stripe/webhook",
    },
  },
  overview: {
    home: "/overview",
    healthOS: "/overview/health-os",
    settings: "/overview/settings",
    wearables: "/overview/settings?tab=wearables",
    profile: "/overview/settings?tab=profile",
    privacy: "/overview/settings?tab=privacy",
    notifications: "/overview/settings?tab=notifications",
  },
};
