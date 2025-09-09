"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bed, Brain, FlaskConical, Sparkles } from "lucide-react";
import Image from "next/image";

interface WelcomeScreenProps {
  input: string;
  status: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSuggestionClick: (suggestion: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const suggestions = [
  {
    title: "Analyze my sleep patterns",
    subtitle: "Get insights from your sleep data and wearables",
    icon: <Bed />,
  },
  {
    title: "Optimize my recovery",
    subtitle: "Improve HRV and recovery metrics",
    icon: <Sparkles />,
  },
  {
    title: "Plan longevity routine",
    subtitle: "Create a personalized anti-aging protocol",
    icon: <Brain />,
  },
  {
    title: "Review lab results",
    subtitle: "Understand your biomarkers and health metrics",
    icon: <FlaskConical />,
  },
];

export function WelcomeScreen({
  input,
  status,
  onInputChange,
  onSubmit,
  onSuggestionClick,
  inputRef,
}: WelcomeScreenProps) {
  return (
    <motion.div
      key="initial"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[70vh] max-w-3xl mx-auto px-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="text-center mb-12 flex flex-col items-center justify-center"
      >
        <Image src="/logo.svg" alt="Uara AI" width={100} height={100} />
        <h1 className="text-4xl font-medium text-gray-900 dark:text-gray-100 mb-2">
          uara<span className="text-blue-500">.ai</span>
        </h1>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <form onSubmit={onSubmit} className="relative">
          <div className="relative group">
            <Input
              ref={inputRef}
              value={input}
              onChange={onInputChange}
              placeholder="Ask anything"
              className="w-full h-14 pl-4 pr-16 text-base rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 transition-all duration-200 resize-none"
              disabled={false}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Button
                type="submit"
                size="sm"
                className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-30"
                variant="ghost"
                disabled={!input.trim() || status === "submitted"}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="w-full max-w-4xl mt-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion) => (
            <motion.button
              key={suggestion.title}
              type="button"
              onClick={() => onSuggestionClick(suggestion.title)}
              className="group p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <div className="flex items-start space-x-3">
                {suggestion.icon && (
                  <suggestion.icon.type
                    {...suggestion.icon.props}
                    className="size-5 text-muted-foreground"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {suggestion.subtitle}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Cursor rules applied correctly.
