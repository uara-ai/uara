"use client";

import { cn } from "@/lib/utils";

interface HowItWorksProps {
  className?: string;
}

const workflowSteps = [
  {
    number: "1.",
    title: "Connect Everything",
    subtitle: "One hub for wearables, labs, and lifestyle logs.",
    description:
      "Stop switching between apps. Uara AI syncs your Oura, recovery, activity, and blood test results into one secure dashboard, so you see the big picture instantly.",
    mockImageUrl:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=400&fit=crop&auto=format",
  },
  {
    number: "2.",
    title: "Personalized Insights",
    subtitle: "Science-backed recommendations, explained simply.",
    description:
      "We analyze your heart rate, HRV, biomarkers, and recovery trends, then translate them into clear guidance: what matters, why it matters, and what to do next.",
    mockImageUrl:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&auto=format",
  },
  {
    number: "3.",
    title: "Longevity Routines",
    subtitle: "Turn data into better sleep, energy, and recovery.",
    description:
      "Get personalized routines for sleep, nutrition, and exercise. Each plan adapts as your data changes, ensuring your body gets exactly what it needs, when it needs it.",
    mockImageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop&auto=format",
  },
  {
    number: "4.",
    title: "Actionable Lab Reviews",
    subtitle: "From numbers to next steps.",
    description:
      "Upload your lab reports, and Uara AI transforms them into plain-language insights with clear action items. No more guessing what a biomarker means.",
    mockImageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop&auto=format",
  },
];

export function HowItWorks({ className }: HowItWorksProps) {
  return (
    <section
      className={cn(
        "relative w-full bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
            <h2 className="px-6 font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#085983]">
              From raw data to daily action
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
          </div>

          <p className="font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl text-[#085983]/80 max-w-3xl mx-auto leading-relaxed">
            Uara unifies your wearables, labs and lifestyle into one simple
            system. It will give you clarity, control and a longer healthspan
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-20 lg:space-y-32">
          {workflowSteps.map((step, index) => (
            <WorkflowStep
              key={step.number}
              step={step}
              index={index}
              isReversed={index % 2 === 1}
            />
          ))}
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .workflow-title {
            font-size: 28px !important;
          }
          .workflow-subtitle {
            font-size: 18px !important;
          }
          .workflow-description {
            font-size: 16px !important;
            line-height: 1.5 !important;
          }
        }

        @media (max-width: 430px) {
          .workflow-title {
            font-size: 24px !important;
          }
          .workflow-subtitle {
            font-size: 16px !important;
          }
          .workflow-description {
            font-size: 14px !important;
          }
        }
      `}</style>
    </section>
  );
}

function WorkflowStep({
  step,
  index,
  isReversed,
}: {
  step: (typeof workflowSteps)[0];
  index: number;
  isReversed: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center",
        isReversed && "lg:grid-flow-col-dense"
      )}
    >
      {/* Content */}
      <div
        className={cn(
          "space-y-6",
          isReversed
            ? "lg:col-start-2 text-center lg:text-left"
            : "text-center lg:text-left"
        )}
      >
        <div className="space-y-4">
          <h3 className="workflow-title font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#085983]">
            {step.number} {step.title}
          </h3>

          <h4 className="workflow-subtitle font-[family-name:var(--font-geist-sans)] text-xl sm:text-xl lg:text-2xl font-normal text-[#085983]/90">
            {step.subtitle}
          </h4>
        </div>

        <p className="workflow-description font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl font-normal text-[#085983]/70 leading-relaxed max-w-2xl mx-auto lg:mx-0">
          {step.description}
        </p>
      </div>

      {/* Image */}
      <div className={cn("relative", isReversed ? "lg:col-start-1" : "")}>
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
          <img
            src={step.mockImageUrl}
            alt={`${step.title} visualization`}
            className="w-full h-64 sm:h-80 lg:h-96 object-cover"
          />
          {/* Overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#085983]/20 to-transparent"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#085983]/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#085983]/5 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
