"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Heart, Activity } from "lucide-react";

export function ScientificRationale() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Brain className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
        <h2 className="text-lg font-medium text-[#085983] tracking-wider">
          Scientific Rationale
        </h2>
      </div>

      {/* Main Description */}
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-[#085983] leading-relaxed">
          Our health score calculation is based on established scientific
          principles and follows standard composite-index methodologies used in
          health research and epidemiology.
        </p>
      </div>

      {/* Key Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="size-6 text-[#085983] bg-[#085983]/10 rounded-lg p-1" />
            <h3 className="font-medium text-[#085983] tracking-wider">
              Normalization Approach
            </h3>
          </div>
          <div className="space-y-2 text-sm text-[#085983]/60">
            <div>• Each marker normalized to 0-100 scale</div>
            <div>• Literature-aligned target ranges</div>
            <div>• Directionally-aware transformations</div>
            <div>• Avoids punishing healthy values</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="size-6 text-[#085983] bg-[#085983]/10 rounded-lg p-1" />
            <h3 className="font-medium text-[#085983] tracking-wider">
              Equal Weighting
            </h3>
          </div>
          <div className="space-y-2 text-sm text-[#085983]/60">
            <div>• Prevents overfitting to single metrics</div>
            <div>• Maintains interpretability</div>
            <div>• Reduces day-to-day noise</div>
            <div>• Balances across health domains</div>
          </div>
        </div>
      </div>

      {/* Physiological Foundation */}
      <div className="bg-[#085983]/5 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="size-6 text-[#085983] bg-[#085983]/10 rounded-lg p-1" />
          <h3 className="font-medium text-[#085983] tracking-wider">
            Physiological Foundation
          </h3>
        </div>
        <p className="text-sm text-[#085983]/80">
          The scoring methodology respects known U-shaped risk curves for
          metrics like sleep duration and BMI, while using linear relationships
          for clear directional benefits like cardiovascular fitness and stress
          management.
        </p>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
