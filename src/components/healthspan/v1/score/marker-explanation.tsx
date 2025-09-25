"use client";

import React from "react";
import { Info, TrendingUp, TrendingDown, Target } from "lucide-react";

export function MarkerExplanation() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Info className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
        <h2 className="text-lg font-medium text-[#085983] tracking-wider">
          Marker Types Explained
        </h2>
      </div>

      {/* Higher is Better */}
      <div className="bg-green-50/50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="size-6 text-[#085983] bg-[#085983]/10 rounded-lg p-1" />
          <h3 className="font-medium text-[#085983] tracking-wider">
            Higher is Better
          </h3>
        </div>
        <div className="text-sm text-[#085983]/60 space-y-2">
          <div>
            <strong>Nutrition:</strong> Protein intake supports muscle health
            and metabolism
          </div>
          <div>
            <strong>Sleep & Recovery:</strong> Higher sleep efficiency, HRV, and
            recovery scores indicate better rest
          </div>
          <div>
            <strong>Movement & Fitness:</strong> More distance, energy
            expenditure, and data quality
          </div>
          <div>
            <strong>Mind & Stress:</strong> Higher mood, energy, focus,
            mindfulness, and gratitude levels
          </div>
          <div>
            <strong>Health Checks:</strong> Higher HDL cholesterol protects
            heart health
          </div>
        </div>
      </div>

      {/* Lower is Better */}
      <div className="bg-red-50/50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="size-6 text-[#085983] bg-[#085983]/10 rounded-lg p-1" />
          <h3 className="font-medium text-[#085983] tracking-wider">
            Lower is Better
          </h3>
        </div>
        <div className="text-sm text-[#085983]/60 space-y-2">
          <div>
            <strong>Nutrition:</strong> Less sugar and alcohol reduces health
            risks
          </div>
          <div>
            <strong>Sleep & Recovery:</strong> Lower resting heart rate, fewer
            wake times and disturbances
          </div>
          <div>
            <strong>Mind & Stress:</strong> Lower stress levels, screen time,
            and workload perception
          </div>
          <div>
            <strong>Health Checks:</strong> Lower waist circumference, glucose,
            LDL, triglycerides, and inflammation
          </div>
        </div>
      </div>

      {/* Optimal Range */}
      <div className="bg-blue-50/50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="size-6 text-[#085983] bg-[#085983]/10 rounded-lg p-1" />
          <h3 className="font-medium text-[#085983] tracking-wider">
            Optimal Range
          </h3>
        </div>
        <div className="bg-blue-100/50 rounded-lg p-4 mb-4">
          <p className="text-sm text-[#085983]/80">
            These markers have U-shaped risk curves where both too little and
            too much can be harmful. The optimal range represents the "sweet
            spot" for health outcomes.
          </p>
        </div>
        <div className="text-sm text-[#085983]/60 space-y-2">
          <div>
            <strong>Nutrition:</strong> Daily calories, macronutrients, water,
            caffeine - balanced intake is key
          </div>
          <div>
            <strong>Sleep & Recovery:</strong> Total sleep hours, REM/deep sleep
            - need adequate but not excessive
          </div>
          <div>
            <strong>Movement & Fitness:</strong> Daily strain and heart rate
            zones for optimal training
          </div>
          <div>
            <strong>Health Checks:</strong> BMI, body fat, blood pressure,
            vitamin D - optimal ranges for health
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
