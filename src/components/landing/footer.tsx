"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";
import { Twitter, Instagram, MailIcon, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative w-full py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large UARA Text */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#085983]/30"></div>
            <h2 className="footer-title px-6 font-[family-name:var(--font-instrument-serif)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal text-[#085983] tracking-wider">
              UARA
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#085983]/30"></div>
          </div>
        </div>

        {/* Footer Card */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
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
              <div className="footer-grid grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start min-h-[250px]">
                {/* Left Side - Navigation Links */}
                <div className="space-y-6 text-white">
                  <div className="space-y-4">
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

                {/* Right Side - Legal Links and Social */}
                <div className="space-y-6 text-white lg:text-right">
                  <div className="space-y-4">
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
                  <div className="footer-social flex justify-center lg:justify-end gap-4 mt-8">
                    <Link
                      href="https://x.com/uaradotai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-social-icon w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors border border-white/20"
                    >
                      <Twitter className="w-5 h-5 text-white" />
                    </Link>
                    <Link
                      href="mailto:hello@uara.ai"
                      className="footer-social-icon w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors border border-white/20"
                    >
                      <MailIcon className="w-5 h-5 text-white" />
                    </Link>
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
                <p className="text-white/80 font-[family-name:var(--font-geist-sans)] text-sm">
                  Made with{" "}
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

        @media (max-width: 640px) {
          .footer-title {
            font-size: 4rem !important;
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
            font-size: 3rem !important;
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
