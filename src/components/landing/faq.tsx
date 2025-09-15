"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQProps {
  className?: string;
}

const faqData = [
  {
    question: "How does the Lifetime Deal work?",
    answer:
      "Pay once for $49 and get unlimited access to Uara AI forever. No monthly subscriptions, no hidden fees. After the first 10 spots are taken, the price increases to $79 for Tier 2.",
    defaultOpen: true,
  },
  {
    question: "What happens after the 100 spots are gone?",
    answer:
      "Once all lifetime deal spots are claimed, Uara AI will transition to a subscription model. Lifetime deal holders will always maintain their access without any additional charges.",
    defaultOpen: false,
  },
  {
    question: "Which devices and wearables can I connect?",
    answer:
      "We currently integrate with popular platforms like Apple Health, Fitbit, Oura, and Garmin — with more on the way. You can also upload lab results (PDF/CSV) directly.",
    defaultOpen: false,
  },
  {
    question: "How accurate are the health insights?",
    answer:
      "Our AI algorithms are trained on peer-reviewed research and clinical data. We provide science-backed recommendations while always encouraging you to consult with healthcare professionals for medical decisions.",
    defaultOpen: false,
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Yes! We offer a 30-day money-back guarantee. If you're not completely satisfied with Uara AI within the first 30 days, we'll provide a full refund, no questions asked.",
    defaultOpen: false,
  },
  {
    question: "Is my health data secure?",
    answer:
      "Absolutely. We use bank-level encryption and never sell your data to third parties. Your health information is stored securely and only used to provide you with personalized insights.",
    defaultOpen: false,
  },
];

export function FAQ({ className }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(
    new Set(
      faqData
        .map((_, index) => (faqData[index].defaultOpen ? index : -1))
        .filter((i) => i !== -1)
    )
  );

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className={cn("relative w-full py-16 lg:py-24", className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          {/* Mobile: Simple title without decorative lines */}
          <div className="block sm:hidden mb-4">
            <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl font-normal text-[#085983] leading-tight">
              Questions? We've Got Answers.
            </h2>
          </div>

          {/* Desktop: Decorative title with lines */}
          <div className="hidden sm:flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
            <h2 className="px-6 font-[family-name:var(--font-instrument-serif)] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#085983]">
              Questions? We've Got Answers.
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
          </div>

          <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Uara unifies your wearables, labs and lifestyle into one simple
            system. It will give you clarity, control and a longer healthspan
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openItems.has(index)}
              onToggle={() => toggleItem(index)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .faq-question {
            font-size: 18px !important;
          }
          .faq-answer {
            font-size: 16px !important;
          }
        }

        @media (max-width: 430px) {
          .faq-question {
            font-size: 16px !important;
          }
          .faq-answer {
            font-size: 14px !important;
          }
        }
      `}</style>
    </section>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ question, answer, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <div className="group">
      {/* Question */}
      <button
        onClick={onToggle}
        className="w-full text-left p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#085983]/20 hover:border-[#085983]/40 transition-all duration-300 hover:shadow-lg flex items-center justify-between gap-4"
      >
        <h3 className="faq-question font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl lg:text-2xl font-medium text-[#085983] leading-relaxed flex-1">
          {question}
        </h3>

        {/* Toggle Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-[#085983] to-[#0a6b99] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110">
            {isOpen ? (
              <ChevronUp className="w-6 h-6 text-white" />
            ) : (
              <ChevronDown className="w-6 h-6 text-white" />
            )}
          </div>
        </div>
      </button>

      {/* Answer */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <div className="pt-4 border-t border-[#085983]/10">
            <p className="faq-answer font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl font-normal text-[#085983]/70 leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
