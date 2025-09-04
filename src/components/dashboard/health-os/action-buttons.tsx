"use client";

import { Button } from "@/components/ui/button";
import { Heart, FileText, Activity, Clock, Brain, Target } from "lucide-react";

interface ActionButtonsProps {
  className?: string;
}

export function ActionButtons({ className }: ActionButtonsProps) {
  const actions = [
    {
      icon: Heart,
      label: "Biological Age",
      onClick: () => console.log("Biological Age clicked"),
    },
    {
      icon: FileText,
      label: "Upload Labs",
      onClick: () => console.log("Upload Labs clicked"),
    },
    {
      icon: Activity,
      label: "HRV Analysis",
      onClick: () => console.log("HRV Analysis clicked"),
    },
    {
      icon: Clock,
      label: "Sleep Tracking",
      onClick: () => console.log("Sleep Tracking clicked"),
    },
    {
      icon: Brain,
      label: "Stress Monitor",
      onClick: () => console.log("Stress Monitor clicked"),
    },
    {
      icon: Target,
      label: "Longevity Goals",
      onClick: () => console.log("Longevity Goals clicked"),
    },
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <Button
            key={index}
            variant="ghost"
            className="flex items-center gap-1.5 h-8 px-1.5 sm:px-2 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50/50 border-0 rounded transition-colors duration-200"
            onClick={action.onClick}
          >
            <IconComponent className="h-3.5 w-3.5" />
            <span className="font-medium hidden sm:block">{action.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
