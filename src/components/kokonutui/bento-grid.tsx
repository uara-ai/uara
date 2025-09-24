"use client";

/**
 * @author: @dorian_baffier
 * @description: Bento Grid
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import Anthropic from "@/components/kokonutui/anthropic";
import AnthropicDark from "@/components/kokonutui/anthropic-dark";
import Google from "@/components/kokonutui/gemini";
import OpenAI from "@/components/kokonutui/open-ai";
import OpenAIDark from "@/components/kokonutui/open-ai-dark";
import MistralAI from "@/components/kokonutui/mistral";
import DeepSeek from "@/components/kokonutui/deepseek";
import X from "@/components/kokonutui/x";
import XDark from "@/components/kokonutui/x-dark";
import Discord from "@/components/kokonutui/discord";
import GitHub from "@/components/kokonutui/github";
import GitHubDark from "@/components/kokonutui/github-dark";
import { cn } from "@/lib/utils";
import {
  Mic,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  type Variants,
} from "motion/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { IconCheck } from "@tabler/icons-react";
import Image from "next/image";
import Vercel from "./vercel";
import VercelDark from "./vercel-dark";
import Supabase from "./supabase";

interface BentoItem {
  id: string;
  title: string;
  description: string;
  icons?: boolean;
  href?: string;
  feature?:
    | "chart"
    | "counter"
    | "code"
    | "timeline"
    | "spotlight"
    | "icons"
    | "typing"
    | "metrics";
  spotlightItems?: string[];
  timeline?: Array<{ year: string; event: string }>;
  code?: string;
  codeLang?: string;
  typingText?: string;
  metrics?: Array<{
    label: string;
    value: number;
    suffix?: string;
    color?: string;
  }>;
  statistic?: {
    value: string;
    label: string;
    start?: number;
    end?: number;
    suffix?: string;
  };
  size?: "sm" | "md" | "lg";
  className?: string;
}

const bentoItems: BentoItem[] = [
  {
    id: "main",
    title: "The Open-Source Health OS for Founders",
    description:
      "Track, understand, and improve your healthspan with a transparent, community-driven platform built for founders and builders.",
    href: "#",
    feature: "spotlight",
    spotlightItems: [
      "Founder Health Score",
      "AI Mentor Feedback",
      "Accountability Nudges",
      "Habit & Recovery Tracking",
      "Full Data Ownership",
    ],
    size: "lg",
    className: "col-span-2 row-span-1 md:col-span-2 md:row-span-1",
  },
  {
    id: "stat1",
    title: "AI Insights & Accountability",
    description:
      "Actionable recommendations powered by AI — not just numbers, but daily guidance to help you stick to healthier habits.",
    href: "#",
    feature: "typing",
    typingText:
      "const analyzeHealth = async () => {\n  const mentor = new HealthMentor({\n    model: 'gpt-4o-mini',\n    inputs: [hrv, sleep, recovery, habits],\n    memory: new HealthHistory()\n  });\n\n  // Generate personalized feedback\n  await mentor.coach(founderData);\n\n  return mentor;\n};",
    size: "md",
    className: "col-span-2 row-span-1 col-start-1 col-end-3",
  },
  {
    id: "partners",
    title: "Built in Public, Backed by Community",
    description:
      "Open-source by design and shaped by early adopters. Join the community helping founders stay sharp and resilient.",
    icons: true,
    href: "#",
    feature: "icons",
    size: "md",
    className: "col-span-1 row-span-1",
  },
  {
    id: "innovation",
    title: "Founder Health Timeline",
    description:
      "From tracking data to extending healthspan, Uara evolves with you — focusing on measurable progress and resilience.",
    href: "#",
    feature: "timeline",
    timeline: [
      { year: "2023", event: "Idea: Healthspan OS for Founders" },
      { year: "2024", event: "AI Insights + Wearables Integration" },
      { year: "2025", event: "Open Source Launch & Community Growth" },
      { year: "2026", event: "Advanced Recovery Optimization" },
      { year: "2027", event: "Longevity Benchmarks & Peer Comparisons" },
    ],
    size: "sm",
    className: "col-span-1 row-span-1",
  },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const SpotlightFeature = ({ items }: { items: string[] }) => {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item, index) => (
        <motion.li
          key={`spotlight-${item.toLowerCase().replace(/\s+/g, "-")}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
          className="flex items-center gap-2"
        >
          <IconCheck className="h-4 w-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            {item}
          </span>
        </motion.li>
      ))}
    </ul>
  );
};

const CounterAnimation = ({
  start,
  end,
  suffix = "",
}: {
  start: number;
  end: number;
  suffix?: string;
}) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    let currentFrame = 0;
    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const easedProgress = 1 - (1 - progress) ** 3;
      const current = start + (end - start) * easedProgress;

      setCount(Math.min(current, end));

      if (currentFrame === totalFrames) {
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [start, end]);

  return (
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        {count.toFixed(1).replace(/\.0$/, "")}
      </span>
      <span className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
        {suffix}
      </span>
    </div>
  );
};

const ChartAnimation = ({ value }: { value: number }) => {
  return (
    <div className="mt-2 w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </div>
  );
};

const IconsFeature = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {/* Twitter X */}
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <X className="w-7 h-7 dark:hidden transition-transform " />
          <XDark className="w-7 h-7 hidden dark:block transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          X
        </span>
      </motion.div>

      {/* Discord */}
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <Discord className="w-7 h-7 transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          Discord
        </span>
      </motion.div>

      {/* GitHub */}
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <GitHub className="w-7 h-7 dark:hidden transition-transform " />
          <GitHubDark className="w-7 h-7 hidden dark:block transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          GitHub
        </span>
      </motion.div>

      {/* Vercel */}
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <Vercel className="w-7 h-7 dark:hidden transition-transform " />
          <VercelDark className="w-7 h-7 hidden dark:block transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          Vercel
        </span>
      </motion.div>

      {/* Supabase */}
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <Supabase className="w-7 h-7 transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          Supabase
        </span>
      </motion.div>

      {/* OpenAI */}
      <motion.div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 dark:from-neutral-800/80 dark:to-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 group transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-600">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <OpenAI className="w-7 h-7 dark:hidden transition-transform " />
          <OpenAIDark className="w-7 h-7 hidden dark:block transition-transform " />
        </div>
        <span className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
          OpenAI
        </span>
      </motion.div>
    </div>
  );
};

const TimelineFeature = ({
  timeline,
}: {
  timeline: Array<{ year: string; event: string }>;
}) => {
  return (
    <div className="mt-3 relative">
      <div className="absolute top-0 bottom-0 left-[9px] w-[2px] bg-neutral-200 dark:bg-neutral-700" />
      {timeline.map((item) => (
        <motion.div
          key={`timeline-${item.year}-${item.event
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          className="flex gap-3 mb-3 relative"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: (0.15 * Number.parseInt(item.year)) % 10,
          }}
        >
          <div className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600 flex-shrink-0 z-10 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {item.year}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400">
              {item.event}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

function AIHealthInsights() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isDemo, setIsDemo] = useState(true);

  const healthInsights = [
    {
      title: "Sleep Quality",
      value: "87%",
      trend: "up",
      color: "emerald",
      recommendation:
        "Your sleep has improved 12% this week. Keep your 10:30 PM bedtime routine.",
    },
    {
      title: "HRV Recovery",
      value: "92ms",
      trend: "up",
      color: "blue",
      recommendation:
        "HRV is in optimal range. Consider adding 5 minutes of morning breathwork.",
    },
    {
      title: "Stress Load",
      value: "23%",
      trend: "down",
      color: "amber",
      recommendation:
        "Stress levels decreased. Your meditation practice is paying off!",
    },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isDemo) return;

    let timeoutId: NodeJS.Timeout;
    const runAnalysis = () => {
      setIsAnalyzing(true);
      setCurrentInsight((prev) => (prev + 1) % healthInsights.length);

      timeoutId = setTimeout(() => {
        setIsAnalyzing(false);
        timeoutId = setTimeout(runAnalysis, 2000);
      }, 3000);
    };

    const initialTimeout = setTimeout(runAnalysis, 500);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo, healthInsights.length]);

  const handleClick = () => {
    if (isDemo) {
      setIsDemo(false);
      setIsAnalyzing(false);
    } else {
      setIsAnalyzing((prev) => !prev);
      if (!isAnalyzing) {
        setCurrentInsight((prev) => (prev + 1) % healthInsights.length);
      }
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: "bg-emerald-500 dark:bg-emerald-400",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-200 dark:border-emerald-800/30",
      },
      blue: {
        bg: "bg-blue-500 dark:bg-blue-400",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800/30",
      },
      amber: {
        bg: "bg-amber-500 dark:bg-amber-400",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800/30",
      },
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  const insight = healthInsights[currentInsight];
  const colorClasses = getColorClasses(insight.color);

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-4">
        {/* Health Insight Card */}
        <motion.div
          key={currentInsight}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "w-full p-4 rounded-xl border-2 transition-all duration-300",
            colorClasses.border,
            "bg-gradient-to-br from-white/80 to-neutral-50/80 dark:from-neutral-900/80 dark:to-neutral-800/80",
            "backdrop-blur-sm shadow-lg"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", colorClasses.bg)} />
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                {insight.title}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className={cn("text-lg font-bold", colorClasses.text)}>
                {insight.value}
              </span>
              {insight.trend === "up" ? (
                <CheckCircle2 className={cn("w-4 h-4", colorClasses.text)} />
              ) : (
                <Clock className={cn("w-4 h-4", colorClasses.text)} />
              )}
            </div>
          </div>

          {/* Progress visualization */}
          <div className="mb-3 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full", colorClasses.bg)}
              initial={{ width: 0 }}
              animate={{ width: "87%" }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            />
          </div>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {insight.recommendation}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

const MetricsFeature = ({
  metrics,
}: {
  metrics: Array<{
    label: string;
    value: number;
    suffix?: string;
    color?: string;
  }>;
}) => {
  const getColorClass = (color = "emerald") => {
    const colors = {
      emerald: "bg-emerald-500 dark:bg-emerald-400",
      blue: "bg-blue-500 dark:bg-blue-400",
      violet: "bg-violet-500 dark:bg-violet-400",
      amber: "bg-amber-500 dark:bg-amber-400",
      rose: "bg-rose-500 dark:bg-rose-400",
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <div className="mt-3 space-y-3">
      {metrics.map((metric, index) => (
        <motion.div
          key={`metric-${metric.label.toLowerCase().replace(/\s+/g, "-")}`}
          className="space-y-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 * index }}
        >
          <div className="flex justify-between items-center text-sm">
            <div className="text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-1.5">
              {metric.label === "Uptime" && <Clock className="w-3.5 h-3.5" />}
              {metric.label === "Response time" && (
                <Zap className="w-3.5 h-3.5" />
              )}
              {metric.label === "Cost reduction" && (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {metric.label}
            </div>
            <div className="text-neutral-700 dark:text-neutral-300 font-semibold">
              {metric.value}
              {metric.suffix}
            </div>
          </div>
          <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${getColorClass(metric.color)}`}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, metric.value)}%`,
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: 0.15 * index,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

function AIInput_Voice() {
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (submitted) {
      intervalId = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      setTime(0);
    }

    return () => clearInterval(intervalId);
  }, [submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isDemo) return;

    let timeoutId: NodeJS.Timeout;
    const runAnimation = () => {
      setSubmitted(true);
      timeoutId = setTimeout(() => {
        setSubmitted(false);
        timeoutId = setTimeout(runAnimation, 1000);
      }, 3000);
    };

    const initialTimeout = setTimeout(runAnimation, 100);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [isDemo]);

  const handleClick = () => {
    if (isDemo) {
      setIsDemo(false);
      setSubmitted(false);
    } else {
      setSubmitted((prev) => !prev);
    }
  };

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            submitted
              ? "bg-none"
              : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
          )}
          type="button"
          onClick={handleClick}
        >
          {submitted ? (
            <Image
              src="/logo.svg"
              alt="mic"
              width={24}
              height={24}
              style={{ animationDuration: "5s" }}
              className="size-10 rounded-sm animate-spin cursor-pointer pointer-events-auto"
            />
          ) : (
            <Mic className="w-6 h-6 text-[#085983] dark:text-white/70" />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            submitted
              ? "text-black/70 dark:text-white/70"
              : "text-black/30 dark:text-white/30"
          )}
        >
          {formatTime(time)}
        </span>

        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {[...Array(48)].map((_, i) => (
            <div
              key={`voice-bar-${i}`}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                submitted
                  ? "bg-black/50 dark:bg-white/50 animate-pulse"
                  : "bg-black/10 dark:bg-white/10 h-1"
              )}
              style={
                submitted && isClient
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <p className="h-4 text-xs text-black/70 dark:text-white/70">
          {submitted ? "Listening..." : "Click to speak"}
        </p>
      </div>
    </div>
  );
}

const BentoCard = ({ item }: { item: BentoItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [2, -2]);
  const rotateY = useTransform(x, [-100, 100], [-2, 2]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 100);
    y.set(yPct * 100);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <Link
        href={item.href || "#"}
        className={`
                    group relative flex flex-col gap-4 h-full rounded-xl p-5
                    bg-gradient-to-b from-neutral-50/60 via-neutral-50/40 to-neutral-50/30 
                    dark:from-neutral-900/60 dark:via-neutral-900/40 dark:to-neutral-900/30
                    border border-neutral-200/60 dark:border-neutral-800/60
                    before:absolute before:inset-0 before:rounded-xl
                    before:bg-gradient-to-b before:from-white/10 before:via-white/20 before:to-transparent 
                    dark:before:from-black/10 dark:before:via-black/20 dark:before:to-transparent
                    before:opacity-100 before:transition-opacity before:duration-500
                    after:absolute after:inset-0 after:rounded-xl after:bg-neutral-50/70 dark:after:bg-neutral-900/70 after:z-[-1]
                    backdrop-blur-[4px]
                    shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)]
                    hover:border-neutral-300/50 dark:hover:border-neutral-700/50
                    hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
                    hover:backdrop-blur-[6px]
                    hover:bg-gradient-to-b hover:from-neutral-50/60 hover:via-neutral-50/30 hover:to-neutral-50/20
                    dark:hover:from-neutral-800/60 dark:hover:via-neutral-800/30 dark:hover:to-neutral-800/20
                    transition-all duration-500 ease-out ${item.className}
                `}
        tabIndex={0}
        aria-label={`${item.title} - ${item.description}`}
      >
        <div
          className="relative z-10 flex flex-col gap-3 h-full"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold tracking-tight text-[#085983] dark:text-neutral-100 group-hover:text-[#085983]/80 dark:group-hover:text-neutral-300 transition-colors duration-300">
                {item.title}
              </h3>
              <div className="text-neutral-400 dark:text-neutral-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 tracking-tight">
              {item.description}
            </p>

            {/* Feature specific content */}
            {item.feature === "spotlight" && item.spotlightItems && (
              <SpotlightFeature items={item.spotlightItems} />
            )}

            {item.feature === "counter" && item.statistic && (
              <div className="mt-auto pt-3">
                <CounterAnimation
                  start={item.statistic.start || 0}
                  end={item.statistic.end || 100}
                  suffix={item.statistic.suffix}
                />
              </div>
            )}

            {item.feature === "chart" && item.statistic && (
              <div className="mt-auto pt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {item.statistic.label}
                  </span>
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {item.statistic.end}
                    {item.statistic.suffix}
                  </span>
                </div>
                <ChartAnimation value={item.statistic.end || 0} />
              </div>
            )}

            {item.feature === "timeline" && item.timeline && (
              <TimelineFeature timeline={item.timeline} />
            )}

            {item.feature === "icons" && <IconsFeature />}

            {item.feature === "typing" && <AIHealthInsights />}

            {item.feature === "metrics" && item.metrics && (
              <MetricsFeature metrics={item.metrics} />
            )}

            {item.icons && !item.feature && (
              <div className="mt-auto pt-4 flex items-center flex-wrap gap-4 border-t border-neutral-200/70 dark:border-neutral-800/70">
                <OpenAI className="w-5 h-5 dark:hidden opacity-70 hover:opacity-100 transition-opacity" />
                <OpenAIDark className="w-5 h-5 hidden dark:block opacity-70 hover:opacity-100 transition-opacity" />
                <AnthropicDark className="w-5 h-5 dark:block hidden opacity-70 hover:opacity-100 transition-opacity" />
                <Anthropic className="w-5 h-5 dark:hidden opacity-70 hover:opacity-100 transition-opacity" />
                <Google className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                <MistralAI className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                <DeepSeek className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function BentoGrid() {
  return (
    <section className="relative py-18 bg-white dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bento Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-6"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={fadeInUp} className="md:col-span-1">
              <BentoCard item={bentoItems[0]} />
            </motion.div>
            <motion.div variants={fadeInUp} className="md:col-span-2">
              <BentoCard item={bentoItems[1]} />
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeInUp} className="md:col-span-1">
              <BentoCard item={bentoItems[2]} />
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="md:col-span-1 rounded-xl overflow-hidden bg-gradient-to-b from-neutral-50/80 to-neutral-50 dark:from-neutral-900/80 dark:to-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 hover:border-neutral-400/30 dark:hover:border-neutral-600/30 hover:shadow-lg hover:shadow-neutral-200/20 dark:hover:shadow-neutral-900/20 transition-all duration-300"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold tracking-tight text-[#085983] dark:text-neutral-100">
                    Voice Assistant
                  </h3>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 tracking-tight mb-4">
                  Interact with our AI using natural voice commands. Experience
                  seamless voice-driven interactions with advanced speech
                  recognition.
                </p>
                <AIInput_Voice />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
