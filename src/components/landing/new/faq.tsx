"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQ() {
  const faqItems = [
    {
      id: "item-1",
      question: "How does the Lifetime Deal work?",
      answer:
        "Pay once for $99 and get unlimited access to Uara forever. No monthly subscriptions, no hidden fees. After the first 50 spots are taken, the price increases to $149.",
    },
    {
      id: "item-2",
      question: "What happens after the 100 spots are gone?",
      answer:
        "Once all lifetime deal spots are claimed, Uara will transition to a subscription model. Lifetime deal holders will always maintain their access without any additional charges.",
    },
    {
      id: "item-3",
      question: "Which devices and wearables can I connect?",
      answer:
        "We currently integrate with popular platforms like Apple Health, Fitbit, Oura, and Garmin — with more on the way. You can also upload lab results directly.",
    },
    {
      id: "item-4",
      question: "How accurate are the health insights?",
      answer:
        "Our AI algorithms are trained on peer-reviewed research and clinical data. We provide science-backed recommendations while always encouraging you to consult with healthcare professionals for medical decisions.",
    },
    {
      id: "item-5",
      question: "Is my health data secure?",
      answer:
        "Absolutely. We use bank-level encryption and never sell your data to third parties. Your health information is stored securely and only used to provide you with personalized insights.",
    },
  ];

  return (
    <div
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24"
      id="faq"
    >
      <div className="flex items-center justify-center px-4">
        <div className="hidden sm:flex flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
        <h2 className="px-2 sm:px-6 font-geist-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#085983] text-center">
          Frequently Asked Questions
        </h2>
        <div className="hidden sm:flex flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
      </div>
      <p className="text-center font-geist-sans text-sm sm:text-base md:text-lg lg:text-xl text-[#085983]/80 max-w-4xl mx-auto leading-relaxed px-4 mt-4 sm:mt-6">
        Discover quick and comprehensive answers to common questions about our
        platform, services, and features.
      </p>

      <div className="mt-12 sm:mt-16 lg:mt-20">
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-[#085983]/20 rounded-2xl bg-white/50 backdrop-blur-sm px-6 py-2 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="cursor-pointer text-left font-geist-sans text-base md:text-lg font-medium text-[#085983] hover:no-underline hover:text-[#085983]/80 transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="font-geist-sans text-sm md:text-base text-[#085983]/70 leading-relaxed pt-2">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <p className="font-geist-sans text-sm md:text-base text-[#085983]/70">
              Can't find what you're looking for? Contact our{" "}
              <Link
                href="#"
                className="text-[#085983] font-medium hover:underline transition-all"
              >
                customer support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
