export type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  category?: string;
  tags?: string[];
  author?: string;
  readingTime?: string;
  draft?: boolean;
  featured?: boolean;
  lastModified?: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "biomarkers",
    name: "Biomarkers",
    description: "Biological age, lab tests, and health metrics",
    icon: "🧬",
  },
  {
    slug: "supplements",
    name: "Supplements",
    description: "Science-backed longevity supplements and nutrition",
    icon: "💊",
  },
  {
    slug: "lifestyle",
    name: "Lifestyle",
    description: "Habits and practices for extended healthspan",
    icon: "🌟",
  },
  {
    slug: "technology",
    name: "Technology",
    description: "Wearables, apps, and health tech innovations",
    icon: "⌚",
  },
  {
    slug: "nutrition",
    name: "Nutrition",
    description: "Diet strategies and meal planning for longevity",
    icon: "🥗",
  },
  {
    slug: "exercise",
    name: "Exercise",
    description: "Training protocols and movement optimization",
    icon: "💪",
  },
  {
    slug: "sleep",
    name: "Sleep",
    description: "Sleep optimization and recovery science",
    icon: "😴",
  },
  {
    slug: "mental-health",
    name: "Mental Health",
    description: "Stress management and cognitive wellness",
    icon: "🧠",
  },
];

export function getCategoryInfo(categorySlug: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.slug === categorySlug);
}

// Cursor rules applied correctly.
