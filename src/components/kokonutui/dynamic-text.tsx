"use client";

/**
 * @author: @dorian_baffier
 * @description: Dynamic Text
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Phrase {
  text: string;
  category: string;
}

const phrases: Phrase[] = [
  { text: "Defend your health smarter.", category: "Health" },
  { text: "Your Health OS.", category: "Platform" },
  { text: "Become an unstoppable founder.", category: "Performance" },
  { text: "Stronger founder, stronger aura.", category: "Aura" },
  { text: "Uara.ai", category: "Brand" },
];

interface DynamicTextProps {
  className?: string;
  textClassName?: string;
  duration?: number;
  finalIndex?: number;
}

const DynamicText = ({
  className,
  textClassName,
  duration = 1200,
  finalIndex = phrases.length - 1,
}: DynamicTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex >= phrases.length) {
          clearInterval(interval);
          setIsAnimating(false);
          return finalIndex;
        }

        return nextIndex;
      });
    }, duration);

    return () => clearInterval(interval);
  }, [isAnimating, duration, finalIndex]);

  // Animation variants for the text
  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 },
  };

  return (
    <div
      className={className || "flex items-center justify-center"}
      aria-label="Dynamic health and performance phrases"
    >
      <div className="relative flex items-center justify-center overflow-visible">
        {isAnimating ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentIndex}
              className={
                textClassName ||
                "absolute text-2xl font-medium text-gray-800 dark:text-gray-200"
              }
              aria-live="off"
              initial={textVariants.hidden}
              animate={textVariants.visible}
              exit={textVariants.exit}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {phrases[currentIndex].text}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div
            className={
              textClassName ||
              "text-2xl font-medium text-gray-800 dark:text-gray-200"
            }
          >
            {phrases[currentIndex].text}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicText;
