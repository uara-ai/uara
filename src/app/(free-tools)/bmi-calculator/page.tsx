import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BMICalculator } from "@/components/free-tools";
import { Footer } from "@/components/landing/footer";
import { Navbar } from "@/components/landing/hero/navbar";

// SEO Metadata
export const metadata: Metadata = {
  title: "Free BMI Calculator - Calculate Your Body Mass Index | Uara.ai",
  description:
    "Calculate your BMI (Body Mass Index) instantly with our free, accurate calculator. Get personalized health insights, BMI categories, and science-backed recommendations for optimal health.",
  keywords: [
    "BMI calculator",
    "body mass index",
    "BMI chart",
    "healthy weight",
    "weight calculator",
    "health assessment",
    "obesity calculator",
    "underweight calculator",
    "overweight calculator",
    "health tools",
    "free BMI calculator",
    "BMI categories",
    "ideal weight calculator",
  ],
  openGraph: {
    title: "Free BMI Calculator - Calculate Your Body Mass Index | Uara.ai",
    description:
      "Calculate your BMI instantly with our free, accurate calculator. Get personalized health insights and recommendations.",
    type: "website",
    siteName: "Uara.ai",
    images: [
      {
        url: "/og/bmi-calculator-og.png",
        width: 1200,
        height: 630,
        alt: "BMI Calculator - Free Health Tool by Uara.ai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free BMI Calculator - Calculate Your Body Mass Index | Uara.ai",
    description:
      "Calculate your BMI instantly with our free, accurate calculator. Get personalized health insights and recommendations.",
    images: ["/og/bmi-calculator-og.png"],
  },
  alternates: {
    canonical: "https://uara.ai/bmi-calculator",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "BMI Calculator",
      description:
        "Free online BMI calculator to determine body mass index and health category",
      url: "https://uara.ai/bmi-calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Any",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@type": "Organization",
        name: "Uara.ai",
        url: "https://uara.ai",
      },
    }),
  },
};

const bmiCategories = [
  {
    category: "Severely Underweight",
    range: "< 16.0",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description:
      "Severely below normal weight. Immediate medical consultation strongly recommended.",
  },
  {
    category: "Underweight",
    range: "16.0 - 18.4",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description:
      "Below normal weight range. Consider consulting a healthcare provider for nutritional guidance.",
  },
  {
    category: "Normal (Healthy) Weight",
    range: "18.5 - 24.9",
    color: "text-green-600",
    bgColor: "bg-green-50",
    description:
      "Healthy weight range associated with lower risk of chronic diseases (WHO/CDC guidelines).",
  },
  {
    category: "Overweight",
    range: "25.0 - 29.9",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    description:
      "Above normal weight range. Focus on balanced diet and regular exercise.",
  },
  {
    category: "Obesity, Class I",
    range: "30.0 - 34.9",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description:
      "Class I obesity. Increased risk for various health conditions. Professional medical guidance recommended.",
  },
  {
    category: "Obesity, Class II",
    range: "35.0 - 39.9",
    color: "text-red-600",
    bgColor: "bg-red-50",
    description:
      "Class II obesity. Significantly increased health risks. Medical supervision strongly recommended.",
  },
  {
    category: "Obesity, Class III",
    range: "≥ 40.0",
    color: "text-red-800",
    bgColor: "bg-red-100",
    description:
      "Class III (severe/morbid) obesity. Highest health risks. Immediate comprehensive medical care needed.",
  },
];

const healthTips = [
  {
    title: "Balanced Nutrition",
    description:
      "Focus on whole foods, lean proteins, fruits, vegetables, and whole grains for sustainable weight management.",
    icon: "🥗",
  },
  {
    title: "Regular Exercise",
    description:
      "Aim for 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week.",
    icon: "🏃‍♂️",
  },
  {
    title: "Stay Hydrated",
    description:
      "Drink adequate water throughout the day to support metabolism and overall health.",
    icon: "💧",
  },
  {
    title: "Quality Sleep",
    description:
      "Get 7-9 hours of quality sleep to support healthy weight and hormone regulation.",
    icon: "😴",
  },
];

export default function BMICalculatorPage() {
  return (
    <div>
      <main>
        {/* Hero Section - Following hero.tsx patterns */}
        <section className="relative w-full py-16 overflow-hidden">
          {/* Background with gradient overlay similar to hero.tsx */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#085983]/5 via-white to-[#085983]/5"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Navigation breadcrumb */}
            <nav className="mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-[#085983]/60">
                <li>
                  <Link
                    href="/"
                    className="hover:text-[#085983] transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <span className="text-[#085983] font-medium">
                    BMI Calculator
                  </span>
                </li>
              </ol>
            </nav>

            {/* Header - Following how-it-works.tsx section header pattern */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              {/* Mobile: Simple title without decorative lines */}
              <div className="block sm:hidden mb-4">
                <h1 className="font-[family-name:var(--font-instrument-serif)] text-3xl font-normal text-[#085983] leading-tight">
                  Free BMI Calculator
                </h1>
              </div>

              {/* Desktop: Decorative title with lines */}
              <div className="hidden sm:flex items-center justify-center mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
                <h1 className="px-6 font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#085983]">
                  Free BMI Calculator
                </h1>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
              </div>

              <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                Calculate your Body Mass Index (BMI) instantly and get
                personalized health insights. Understand your health status with
                science-backed recommendations.
              </p>
            </div>

            {/* BMI Calculator Component */}
            <BMICalculator />
          </div>
        </section>

        {/* BMI Categories Section - Following early-adopters patterns */}
        <section className="relative w-full py-16 lg:py-24 overflow-hidden">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header - Following how-it-works.tsx pattern */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              {/* Mobile: Simple title without decorative lines */}
              <div className="block sm:hidden mb-4">
                <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl font-normal text-[#085983] leading-tight">
                  Understanding BMI Categories
                </h2>
              </div>

              {/* Desktop: Decorative title with lines */}
              <div className="hidden sm:flex items-center justify-center mb-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
                <h2 className="px-6 font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#085983]">
                  Understanding BMI Categories
                </h2>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
              </div>

              <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                Learn what your BMI score means for your health and wellbeing
                with medically accurate WHO/CDC categories.
              </p>
            </div>

            {/* Simplified grid layout with better spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {bmiCategories.map((category, index) => (
                <BMICategoryCard
                  key={category.category}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* BMI Formula & Medical Accuracy Section */}
        <section className="relative w-full py-16 lg:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl sm:text-3xl lg:text-4xl font-normal text-[#085983] mb-4">
                BMI Formula & Medical Standards
              </h2>
              <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg text-[#085983]/70 max-w-3xl mx-auto">
                Our calculator uses the official WHO and CDC formulas for
                medical accuracy.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Metric Formula */}
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                <h3 className="font-[family-name:var(--font-instrument-serif)] text-xl font-semibold text-[#085983] mb-4">
                  Metric Formula
                </h3>
                <div className="bg-white p-6 rounded-lg border-l-4 border-[#085983] mb-4">
                  <div className="font-mono text-lg text-center">
                    BMI = weight (kg) ÷ height (m)²
                  </div>
                </div>
                <p className="font-[family-name:var(--font-geist-sans)] text-sm text-[#085983]/70">
                  Standard metric calculation used in medical literature and WHO
                  guidelines.
                </p>
              </div>

              {/* Imperial Formula */}
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                <h3 className="font-[family-name:var(--font-instrument-serif)] text-xl font-semibold text-[#085983] mb-4">
                  Imperial Formula
                </h3>
                <div className="bg-white p-6 rounded-lg border-l-4 border-[#085983] mb-4">
                  <div className="font-mono text-lg text-center">
                    BMI = (weight (lbs) ÷ height (in)²) × 703
                  </div>
                </div>
                <p className="font-[family-name:var(--font-geist-sans)] text-sm text-[#085983]/70">
                  U.S. standard calculation with the 703 conversion factor for
                  medical accuracy.
                </p>
              </div>
            </div>

            {/* Medical Sources */}
            <div className="mt-12 bg-blue-50 p-8 rounded-xl border border-blue-200">
              <h3 className="font-[family-name:var(--font-instrument-serif)] text-lg font-semibold text-[#085983] mb-4">
                Medical Standards & Sources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#085983] mb-2">
                    Category Standards
                  </h4>
                  <ul className="text-sm text-[#085983]/70 space-y-1">
                    <li>• World Health Organization (WHO)</li>
                    <li>• U.S. Centers for Disease Control (CDC)</li>
                    <li>• National Heart, Lung, and Blood Institute</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#085983] mb-2">
                    Limitations
                  </h4>
                  <ul className="text-sm text-[#085983]/70 space-y-1">
                    <li>• Does not distinguish muscle vs. fat mass</li>
                    <li>• May vary by ethnicity and age</li>
                    <li>• Screening tool, not diagnostic</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative w-full py-16 lg:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-[family-name:var(--font-geist-sans)] text-lg font-semibold text-[#085983] mb-3">
                  What is BMI and how is it calculated?
                </h3>
                <p className="font-[family-name:var(--font-geist-sans)] text-[#085983]/70 leading-relaxed">
                  BMI (Body Mass Index) is a measure that uses your height and
                  weight to determine if you're in a healthy weight range. It's
                  calculated by dividing your weight in kilograms by your height
                  in meters squared (kg/m²).
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-[family-name:var(--font-geist-sans)] text-lg font-semibold text-[#085983] mb-3">
                  Is BMI accurate for everyone?
                </h3>
                <p className="font-[family-name:var(--font-geist-sans)] text-[#085983]/70 leading-relaxed">
                  BMI is a useful screening tool, but it has limitations. It
                  doesn't distinguish between muscle and fat mass, so athletes
                  or very muscular individuals may have a high BMI without
                  excess body fat. Always consult healthcare professionals for
                  comprehensive health assessment.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-[family-name:var(--font-geist-sans)] text-lg font-semibold text-[#085983] mb-3">
                  What should I do if my BMI is outside the normal range?
                </h3>
                <p className="font-[family-name:var(--font-geist-sans)] text-[#085983]/70 leading-relaxed">
                  If your BMI is outside the normal range, consider consulting
                  with a healthcare provider or registered dietitian. They can
                  help create a personalized plan for achieving and maintaining
                  a healthy weight through proper nutrition and exercise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Following early-adopters overlay pattern */}
        <section className="relative w-full py-16 lg:py-24 overflow-hidden">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#085983]/40 via-[#085983]/60 to-[#085983]/40"></div>
          <div className="absolute inset-0 bg-black/30"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-blue-100/20 via-white/15 to-blue-50/20 backdrop-blur-md rounded-2xl lg:rounded-3xl p-8 sm:p-12 lg:p-16 border-2 border-white/30">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-tight text-white">
                    Take Control of Your{" "}
                    <span className="block text-blue-200 bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text">
                      Health Journey
                    </span>
                  </h2>

                  <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                    Ready for personalized health insights beyond BMI? Uara.ai
                    analyzes your wearables, labs, and lifestyle data to provide
                    comprehensive longevity recommendations.
                  </p>
                </div>

                <Link
                  href="/login"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-b from-white via-gray-50 to-white text-[#085983] font-[family-name:var(--font-geist-sans)] text-lg font-bold rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 tracking-wider border-2 border-white/50"
                  style={{
                    boxShadow:
                      "0 8px 20px rgba(255, 255, 255, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  START YOUR HEALTH JOURNEY
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// BMI Category Card Component - Following early-adopters PainPointCard pattern
interface BMICategoryCardProps {
  category: {
    category: string;
    range: string;
    color: string;
    bgColor: string;
    description: string;
  };
  index: number;
}

function BMICategoryCard({ category, index }: BMICategoryCardProps) {
  // Use more subtle, unified styling approach
  const isHighRisk =
    category.category.includes("Severely") ||
    category.category.includes("Class III");
  const isMediumRisk =
    category.category.includes("Class II") ||
    category.category.includes("Class I") ||
    category.category.includes("Overweight") ||
    category.category.includes("Underweight");
  const isNormal = category.category.includes("Normal");

  return (
    <div className="relative overflow-hidden p-6 lg:p-8 rounded-xl sm:rounded-2xl border-2 border-[#085983]/10 bg-gradient-to-br from-white via-gray-50/30 to-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#085983]/2 to-transparent opacity-50"></div>

      {/* Subtle top border accent based on category */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 rounded-t-xl transition-all duration-300",
          isNormal
            ? "bg-gradient-to-r from-green-400/30 to-green-500/30"
            : isMediumRisk
            ? "bg-gradient-to-r from-yellow-400/30 to-orange-400/30"
            : isHighRisk
            ? "bg-gradient-to-r from-red-400/30 to-red-500/30"
            : "bg-gradient-to-r from-[#085983]/20 to-[#085983]/30"
        )}
      ></div>

      <div className="relative z-10 text-center space-y-4">
        {/* Range Display */}
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-[#085983]/5 to-[#085983]/10 border border-[#085983]/10">
          <div className="font-[family-name:var(--font-geist-sans)] text-lg font-bold text-[#085983]">
            {category.range}
          </div>
        </div>

        {/* Category Title */}
        <h3 className="font-[family-name:var(--font-geist-sans)] text-xl lg:text-2xl font-semibold text-[#085983] mb-3 transition-colors leading-tight">
          {category.category}
        </h3>

        {/* Description */}
        <p className="font-[family-name:var(--font-geist-sans)] text-sm lg:text-base text-[#085983]/70 leading-relaxed transition-colors">
          {category.description}
        </p>
      </div>

      {/* Subtle decorative elements */}
      <div className="absolute top-4 right-4 w-6 h-6 bg-[#085983]/3 rounded-full blur-sm"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 bg-[#085983]/5 rounded-full blur-sm"></div>
    </div>
  );
}

// Cursor rules applied correctly.
