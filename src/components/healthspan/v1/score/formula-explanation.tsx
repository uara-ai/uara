"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, TrendingDown, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FormulaExplanation() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="size-8 text-[#085983] bg-[#085983]/10 rounded-lg p-2" />
        <h2 className="text-lg font-medium text-[#085983] tracking-wider">
          Mathematical Formula
        </h2>
      </div>

      <div className="space-y-6">
        {/* Overview Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-medium text-[#085983] tracking-wider mb-4">
            Calculation Steps
          </h3>
          <div className="space-y-3 text-sm text-[#085983]/80">
            <div>
              <strong>1. Individual Marker Scoring:</strong> Each health marker
              is normalized to 0-100 based on its type
            </div>
            <div>
              <strong>2. Category Subscore:</strong> Average of all valid
              markers within each category
            </div>
            <div>
              <strong>3. Overall Health Score:</strong> Average of all category
              subscores (equal weighting)
            </div>
          </div>
        </div>

        {/* Formula Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Higher is Better */}
          <div className="bg-[#085983]/5 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="size-6 text-[#085983] bg-[#085983]/10 rounded-lg p-1" />
              <h3 className="font-medium text-[#085983] tracking-wider">
                Higher is Better
              </h3>
            </div>
            <div className="bg-[#085983] text-white rounded-lg p-4 font-mono text-sm mb-4">
              s<sub>i</sub> = 100 × clip((x<sub>i</sub> - L<sub>i</sub>) / (U
              <sub>i</sub> - L<sub>i</sub>), 0, 1)
            </div>
            <div className="text-sm text-[#085983]/60 space-y-2">
              <div>Examples: Protein, HRV, HDL</div>
              <div>Range: L (0 pts) → U (100 pts)</div>
            </div>
          </div>

          {/* Lower is Better */}
          <div className="bg-[#085983]/5 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="size-6 text-[#085983] bg-[#085983]/10 rounded-lg p-1" />
              <h3 className="font-medium text-[#085983] tracking-wider">
                Lower is Better
              </h3>
            </div>
            <div className="bg-[#085983] text-white rounded-lg p-4 font-mono text-sm mb-4">
              s<sub>i</sub> = 100 × clip((U<sub>i</sub> - x<sub>i</sub>) / (U
              <sub>i</sub> - L<sub>i</sub>), 0, 1)
            </div>
            <div className="text-sm text-[#085983]/60 space-y-2">
              <div>Examples: Sugar, Stress, LDL</div>
              <div>Range: L (100 pts) → U (0 pts)</div>
            </div>
          </div>

          {/* Optimal Range */}
          <div className="bg-[#085983]/5 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="size-6 text-[#085983] bg-[#085983]/10 rounded-lg p-1" />
              <h3 className="font-medium text-[#085983] tracking-wider">
                Optimal Range
              </h3>
            </div>
            <div className="bg-[#085983] text-white rounded-lg p-4 font-mono text-xs mb-4 space-y-1">
              <div>if x ≤ L or x ≥ U: s = 0</div>
              <div>if L &lt; x &lt; A: s = 100 × (x - L) / (A - L)</div>
              <div>if A ≤ x ≤ B: s = 100</div>
              <div>if B &lt; x &lt; U: s = 100 × (U - x) / (U - B)</div>
            </div>
            <div className="text-sm text-[#085983]/60 space-y-2">
              <div>Examples: BMI, Sleep, Calories</div>
              <div>Range: L-A-B-U (triangular)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
