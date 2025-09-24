"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, Repeat2 } from "lucide-react";
import { useState } from "react";
import { useCheckout } from "@/hooks/use-checkout";

export interface PricingCardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  tierId?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClaimClick?: () => void;
}

export default function PricingCardFlip({
  title = "Design Systems",
  subtitle = "Explore the fundamentals",
  description = "Dive deep into the world of modern UI/UX design.",
  features = ["UI/UX", "Modern Design", "Tailwind CSS", "Kokonut UI"],
  tierId,
  isLoading = false,
  disabled = false,
  onClaimClick,
}: PricingCardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { checkout, isLoading: checkoutLoading, error } = useCheckout();

  const handleClaimClick = async () => {
    if (onClaimClick) {
      onClaimClick();
    } else if (tierId) {
      await checkout(tierId);
    }
  };

  const isButtonLoading = isLoading || checkoutLoading;

  return (
    <div
      className="relative w-full max-w-[280px] h-[320px] group [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative w-full h-full",
          "[transform-style:preserve-3d]",
          "transition-all duration-700",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]"
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full",
            "[backface-visibility:hidden] [transform:rotateY(0deg)]",
            "overflow-hidden rounded-2xl",
            "bg-gradient-to-b from-[#085983]/5 via-white to-[#085983]/10",
            "border border-[#085983]/20",
            "shadow-xs",
            "transition-all duration-700",
            "group-hover:shadow-lg",
            isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="relative h-full overflow-hidden">
            <div className="absolute inset-0 flex items-start justify-center pt-24">
              <div className="relative w-[200px] h-[100px] flex items-center justify-center">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute w-[50px] h-[50px]",
                      "rounded-[140px]",
                      "animate-[scale_3s_linear_infinite]",
                      "opacity-0",
                      "shadow-[0_0_50px_rgba(8,89,131,0.3)]",
                      "bg-gradient-to-br from-[#085983]/20 to-[#085983]/40",
                      "group-hover:animate-[scale_2s_linear_infinite]"
                    )}
                    style={{
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-[#085983] leading-snug tracking-tighter transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px]">
                  {title}
                </h3>
                <p className="text-sm text-[#085983]/70 line-clamp-2 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px] delay-[50ms]">
                  {subtitle}
                </p>
              </div>
              <div className="relative group/icon">
                <div
                  className={cn(
                    "absolute inset-[-8px] rounded-lg transition-opacity duration-300",
                    "bg-gradient-to-br from-[#085983]/20 via-[#085983]/10 to-transparent"
                  )}
                />
                <Repeat2 className="relative z-10 w-4 h-4 text-[#085983] transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full",
            "[backface-visibility:hidden] [transform:rotateY(180deg)]",
            "p-6 rounded-2xl",
            "bg-gradient-to-b from-[#085983]/5 via-white to-[#085983]/10",
            "border border-[#085983]/20",
            "shadow-xs",
            "flex flex-col",
            "transition-all duration-700",
            "group-hover:shadow-lg",
            !isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#085983] leading-snug tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px]">
                {title}
              </h3>
              <p className="text-sm text-[#085983]/70 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px] line-clamp-2">
                {description}
              </p>
            </div>

            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-[#085983]/80 transition-all duration-500"
                  style={{
                    transform: isFlipped
                      ? "translateX(0)"
                      : "translateX(-10px)",
                    opacity: isFlipped ? 1 : 0,
                    transitionDelay: `${index * 100 + 200}ms`,
                  }}
                >
                  <ArrowRight className="w-3 h-3 text-[#085983]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#085983]/20">
            <div
              className={cn(
                "group/start relative",
                "flex items-center justify-between",
                "p-3 -m-3 rounded-xl",
                "transition-all duration-300",
                "bg-gradient-to-r from-[#085983]/5 via-[#085983]/5 to-[#085983]/5",
                "hover:from-[#085983]/10 hover:from-0% hover:via-[#085983]/5 hover:via-100% hover:to-transparent hover:to-100%",
                "hover:scale-[1.02] hover:cursor-pointer",
                disabled ? "opacity-50 cursor-not-allowed" : ""
              )}
              onClick={!disabled ? handleClaimClick : undefined}
            >
              <span className="text-sm font-medium text-[#085983] transition-colors duration-300 group-hover/start:text-[#085983]/80">
                {isButtonLoading ? "Processing..." : "Claim now"}
              </span>
              <div className="relative group/icon">
                <div
                  className={cn(
                    "absolute inset-[-6px] rounded-lg transition-all duration-300",
                    "bg-gradient-to-br from-[#085983]/20 via-[#085983]/10 to-transparent",
                    "opacity-0 group-hover/start:opacity-100 scale-90 group-hover/start:scale-100"
                  )}
                />
                <ArrowRight className="relative z-10 w-4 h-4 text-[#085983] transition-all duration-300 group-hover/start:translate-x-0.5 group-hover/start:scale-110" />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-2">
              <p className="text-red-500 text-xs text-center">{error}</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scale {
          0% {
            transform: scale(2);
            opacity: 0;
            box-shadow: 0px 0px 50px rgba(8, 89, 131, 0.3);
          }
          50% {
            transform: translate(0px, -5px) scale(1);
            opacity: 1;
            box-shadow: 0px 8px 20px rgba(8, 89, 131, 0.3);
          }
          100% {
            transform: translate(0px, 5px) scale(0.1);
            opacity: 0;
            box-shadow: 0px 10px 20px rgba(8, 89, 131, 0);
          }
        }
      `}</style>
    </div>
  );
}

// Cursor rules applied correctly.
