"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";
import DynamicText from "@/components/kokonutui/dynamic-text";
import { SocialLinks } from "@/components/design-system";

export function Footer() {
  return (
    <footer className="relative w-full py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dynamic Text */}
        <div className="text-center">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
            <div className="px-6 min-h-[120px] sm:min-h-[140px] md:min-h-[160px] lg:min-h-[180px] flex items-center justify-center">
              <DynamicText
                className="flex items-center justify-center"
                textClassName="footer-title font-geist-sans text-xl sm:text-4xl font-normal text-[#085983] tracking-wider text-center"
                duration={1500}
                finalIndex={3}
              />
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
          </div>
        </div>

        {/* Footer Card */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                width={1000}
                height={1000}
                src="/footer.jpg"
                alt="Futuristic landscape background"
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#085983]/10 via-[#085983]/30 to-[#085983]/10"></div>
              {/* Additional overlay for better text contrast */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content */}
            <div className="footer-padding relative z-10 p-8 sm:p-12 lg:p-16">
              <div className="footer-grid grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start min-h-[250px]">
                {/* Left Side - Navigation Links */}
                <div className="space-y-6 text-white">
                  <div className="space-y-4">
                    <h3 className="font-[family-name:var(--font-geist-sans)] text-md font-medium text-white/60 mb-4">
                      Menu
                    </h3>
                    <Link
                      href="#how-it-works"
                      className="footer-links block font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl font-normal hover:text-white/80 transition-colors"
                    >
                      Features
                    </Link>
                    <Link
                      href="#pricing"
                      className="footer-links block font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl font-normal hover:text-white/80 transition-colors"
                    >
                      Pricing
                    </Link>
                    <Link
                      href="#faq"
                      className="footer-links block font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl font-normal hover:text-white/80 transition-colors"
                    >
                      FAQ
                    </Link>
                  </div>
                </div>

                {/* Center - Free Tools */}
                <div className="space-y-6 text-white lg:text-center">
                  <div className="space-y-4">
                    <h3 className="font-[family-name:var(--font-geist-sans)] text-md font-medium text-white/60 mb-4">
                      Free Tools
                    </h3>
                    <Link
                      href="/bmi-calculator"
                      className="footer-links block font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl font-normal hover:text-white/80 transition-colors"
                    >
                      BMI Calculator
                    </Link>
                  </div>
                </div>

                {/* Right Side - Legal Links and Social */}
                <div className="space-y-6 text-white lg:text-right">
                  <div className="space-y-4">
                    <h3 className="font-[family-name:var(--font-geist-sans)] text-md font-medium text-white/60 mb-4">
                      Legal
                    </h3>
                    <Link
                      href="/privacy"
                      className="footer-links block font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl font-normal hover:text-white/80 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/terms"
                      className="footer-links block font-[family-name:var(--font-geist-sans)] text-lg sm:text-xl font-normal hover:text-white/80 transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </div>

                  {/* Social Icons */}
                  <div className="flex items-end justify-end lg:justify-end gap-4 mt-8 bg-white/90 backdrop-blur-sm rounded-full p-2 border border-white/20 max-w-40 ml-auto">
                    <SocialLinks />
                  </div>
                </div>
              </div>

              {/* Bottom Center - Logo and Copyright */}
              <div className="mt-12 pt-8 border-t border-white/20 text-center space-y-6 text-white">
                <div className="flex justify-center">
                  <Logo className="w-16 h-16 text-white" hidden />
                </div>
                <p className="font-[family-name:var(--font-geist-sans)] text-sm text-white/80">
                  2025 Uara.ai. All rights reserved
                </p>
                <div className="flex flex-col gap-1">
                  <p className="text-white/80 font-geist-sans text-xs font-semibold">
                    OSS Friends:
                  </p>
                  <Link
                    href="https://lockedin.bio"
                    target="_blank"
                    className="hover:text-white/100 transition-colors font-geist-sans text-xs font-semibold"
                  >
                    Lockedin
                  </Link>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-white/80 font-[family-name:var(--font-geist-sans)] text-sm flex items-center gap-2 justify-center">
                    Built with{" "}
                    <Heart className="w-4 h-4 fill-red-400 text-red-400 inline-block" />{" "}
                    by{" "}
                    <Link
                      href="https://x.com/FedericoFan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white/100 transition-colors"
                    >
                      Federico
                    </Link>
                  </p>
                  <p className="text-white/80 font-[family-name:var(--font-geist-sans)] text-sm flex items-center gap-2 justify-center">
                    Images by{" "}
                    <Image
                      src="/revolte.png"
                      alt="Revolte"
                      width={16}
                      height={16}
                      className="inline-block rounded-full"
                    />{" "}
                    <Link
                      href="https://www.revolte.design/?utm_source=uara.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white/100 transition-colors"
                    >
                      Rvoltedev
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-12 left-12 w-20 h-20 bg-[#085983]/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Mobile responsive adjustments */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }
          .footer-social {
            justify-content: center !important;
          }
        }

        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .footer-title {
            font-size: 2.5rem !important;
            line-height: 1.1;
          }
          .footer-links {
            font-size: 1.125rem !important;
          }
          .footer-padding {
            padding: 2rem 1rem;
          }
          .footer-spacing {
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 430px) {
          .footer-title {
            font-size: 2rem !important;
          }
          .footer-links {
            font-size: 1rem !important;
          }
          .footer-padding {
            padding: 1.5rem 0.75rem;
          }
          .footer-social-icon {
            width: 2.5rem;
            height: 2.5rem;
          }
        }
      `}</style>
    </footer>
  );
}

// Cursor rules applied correctly.
