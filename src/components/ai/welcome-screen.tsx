"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bed, Brain, FlaskConical, Sparkles } from "lucide-react";
import Image from "next/image";

interface WelcomeScreenProps {
  input: string;
  status: string;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
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
      className="flex flex-col items-center justify-center min-h-[70vh] max-w-3xl mx-auto px-4 mt-16"
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
        className="w-full max-w-3xl"
      >
        <form onSubmit={onSubmit} className="relative">
          <div className="relative flex items-center gap-2 rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-2 shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
            <Input
              ref={inputRef}
              value={input}
              onChange={onInputChange}
              placeholder="Ask anything about your health and longevity..."
              className="flex-1 border-0 bg-transparent text-lg py-3 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
              disabled={status === "submitted"}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || status === "submitted"}
              className="shrink-0 rounded-xl h-12 w-12 p-0 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.title}
              type="button"
              onClick={() => onSuggestionClick(suggestion.title)}
              className="group p-5 text-left rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-pointer"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ y: 0, scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                {suggestion.icon && (
                  <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <suggestion.icon.type
                      {...suggestion.icon.props}
                      className="size-5"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {suggestion.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 group-hover:text-foreground/80 transition-colors">
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
