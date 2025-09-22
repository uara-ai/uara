"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  bgColor: string;
  description: string;
  recommendations: string[];
}

const getBMICategory = (bmi: number): BMIResult => {
  if (bmi < 16.0) {
    return {
      bmi,
      category: "Severely Underweight",
      categoryColor: "text-purple-600",
      bgColor: "bg-purple-50",
      description:
        "Severely below normal weight range. Immediate medical consultation strongly recommended.",
      recommendations: [
        "Seek immediate medical evaluation and treatment",
        "Work with healthcare team including physician and dietitian",
        "May require supervised nutritional rehabilitation",
        "Monitor for underlying medical conditions",
      ],
    };
  } else if (bmi >= 16.0 && bmi < 18.5) {
    return {
      bmi,
      category: "Underweight",
      categoryColor: "text-blue-600",
      bgColor: "bg-blue-50",
      description:
        "Below normal weight range. Consider consulting a healthcare provider for nutritional guidance.",
      recommendations: [
        "Consult with a healthcare provider or registered dietitian",
        "Focus on nutrient-dense, calorie-rich foods",
        "Include healthy fats like nuts, avocados, and olive oil",
        "Consider strength training to build muscle mass",
      ],
    };
  } else if (bmi >= 18.5 && bmi < 25.0) {
    return {
      bmi,
      category: "Normal (Healthy) Weight",
      categoryColor: "text-green-600",
      bgColor: "bg-green-50",
      description:
        "Healthy weight range associated with lower risk of chronic diseases (WHO/CDC guidelines).",
      recommendations: [
        "Maintain current healthy lifestyle habits",
        "Continue balanced diet with variety of foods",
        "Keep up regular physical activity routine",
        "Monitor weight periodically to stay in range",
      ],
    };
  } else if (bmi >= 25.0 && bmi < 30.0) {
    return {
      bmi,
      category: "Overweight",
      categoryColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      description:
        "Above normal weight range. Focus on balanced diet and regular exercise.",
      recommendations: [
        "Create a moderate caloric deficit through diet and exercise",
        "Increase physical activity to 300+ minutes per week",
        "Focus on whole foods and reduce processed foods",
        "Consider consulting a healthcare provider for guidance",
      ],
    };
  } else if (bmi >= 30.0 && bmi < 35.0) {
    return {
      bmi,
      category: "Obesity, Class I",
      categoryColor: "text-orange-600",
      bgColor: "bg-orange-50",
      description:
        "Class I obesity. Increased risk for various health conditions. Professional medical guidance recommended.",
      recommendations: [
        "Consult with healthcare provider for comprehensive weight management plan",
        "Consider working with registered dietitian and exercise physiologist",
        "Focus on sustainable lifestyle changes over quick fixes",
        "Regular monitoring of blood pressure, cholesterol, and blood sugar",
      ],
    };
  } else if (bmi >= 35.0 && bmi < 40.0) {
    return {
      bmi,
      category: "Obesity, Class II",
      categoryColor: "text-red-600",
      bgColor: "bg-red-50",
      description:
        "Class II obesity. Significantly increased health risks. Medical supervision strongly recommended.",
      recommendations: [
        "Seek comprehensive medical evaluation and treatment plan",
        "Work with multidisciplinary healthcare team",
        "Consider medically supervised weight loss programs",
        "Regular monitoring and management of comorbid conditions",
      ],
    };
  } else {
    return {
      bmi,
      category: "Obesity, Class III (Severe)",
      categoryColor: "text-red-800",
      bgColor: "bg-red-100",
      description:
        "Class III (severe/morbid) obesity. Highest health risks. Immediate comprehensive medical care needed.",
      recommendations: [
        "Immediate comprehensive medical evaluation required",
        "Consider specialized obesity medicine consultation",
        "Evaluate for bariatric surgery candidacy if appropriate",
        "Intensive medical monitoring and intervention needed",
      ],
    };
  }
};

export function BMICalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [result, setResult] = useState<BMIResult | null>(null);
  const [errors, setErrors] = useState<{ height?: string; weight?: string }>(
    {}
  );

  const validateInputs = useCallback(() => {
    const newErrors: { height?: string; weight?: string } = {};

    if (unit === "metric") {
      const heightNum = parseFloat(height);
      const weightNum = parseFloat(weight);

      if (!height || isNaN(heightNum) || heightNum <= 0 || heightNum > 300) {
        newErrors.height = "Please enter a valid height between 1-300 cm";
      }

      if (!weight || isNaN(weightNum) || weightNum <= 0 || weightNum > 1000) {
        newErrors.weight = "Please enter a valid weight between 1-1000 kg";
      }
    } else {
      const feetNum = parseFloat(feet);
      const inchesNum = parseFloat(inches);
      const weightNum = parseFloat(weight);

      if (!feet || isNaN(feetNum) || feetNum < 1 || feetNum > 10) {
        newErrors.height = "Please enter valid feet (1-10)";
      }

      if (inches && (isNaN(inchesNum) || inchesNum < 0 || inchesNum >= 12)) {
        newErrors.height = "Please enter valid inches (0-11)";
      }

      if (!weight || isNaN(weightNum) || weightNum <= 0 || weightNum > 2000) {
        newErrors.weight = "Please enter a valid weight between 1-2000 lbs";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [unit, height, weight, feet, inches]);

  const calculateBMI = useCallback(() => {
    if (!validateInputs()) return;

    let bmi: number;

    if (unit === "metric") {
      // BMI = weight (kg) / height (m)²
      const heightInMeters = parseFloat(height) / 100; // Convert cm to meters
      const weightInKg = parseFloat(weight);
      bmi = weightInKg / (heightInMeters * heightInMeters);
    } else {
      // BMI = (weight (lbs) / height (inches)²) × 703
      const totalInches = parseFloat(feet) * 12 + (parseFloat(inches) || 0);
      const weightInLbs = parseFloat(weight);
      bmi = (weightInLbs / (totalInches * totalInches)) * 703;
    }
    const bmiResult = getBMICategory(bmi);
    setResult(bmiResult);
  }, [unit, height, weight, feet, inches, validateInputs]);

  const resetForm = () => {
    setHeight("");
    setWeight("");
    setFeet("");
    setInches("");
    setResult(null);
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Calculator Card - Following early-adopters gradient card pattern */}
      <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/50 to-white"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#085983]/5 via-transparent to-[#085983]/5"></div>

        <div className="relative z-10 bg-gradient-to-br from-white/90 via-white/95 to-white/90 backdrop-blur-sm border-2 border-[#085983]/10 rounded-2xl lg:rounded-3xl">
          <div className="text-center p-8 sm:p-12 lg:p-16">
            <div className="space-y-6 mb-8">
              <h2 className="font-[family-name:var(--font-instrument-serif)] text-4xl sm:text-5xl lg:text-6xl font-normal text-[#085983] leading-tight">
                Calculate{" "}
              </h2>
              <p className="font-[family-name:var(--font-geist-sans)] text-base sm:text-lg lg:text-xl text-[#085983]/80 max-w-2xl mx-auto leading-relaxed">
                Enter your measurements to get your Body Mass Index and
                personalized health insights
              </p>
            </div>

            <div className="space-y-8">
              {/* Unit Selection */}
              <Tabs
                value={unit}
                onValueChange={(value) =>
                  setUnit(value as "metric" | "imperial")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="metric">Metric (cm/kg)</TabsTrigger>
                  <TabsTrigger value="imperial">Imperial (ft/lbs)</TabsTrigger>
                </TabsList>

                <TabsContent value="metric" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="height-cm"
                        className="font-[family-name:var(--font-geist-sans)] text-[#085983] font-medium"
                      >
                        Height (cm)
                      </Label>
                      <Input
                        id="height-cm"
                        type="number"
                        placeholder="170"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className={cn(
                          "text-lg",
                          errors.height
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        )}
                        min="1"
                        max="300"
                      />
                      {errors.height && (
                        <p className="text-sm text-red-600">{errors.height}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="weight-kg"
                        className="font-[family-name:var(--font-geist-sans)] text-[#085983] font-medium"
                      >
                        Weight (kg)
                      </Label>
                      <Input
                        id="weight-kg"
                        type="number"
                        placeholder="70"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className={cn(
                          "text-lg",
                          errors.weight
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        )}
                        min="1"
                        max="1000"
                      />
                      {errors.weight && (
                        <p className="text-sm text-red-600">{errors.weight}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="imperial" className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-[family-name:var(--font-geist-sans)] text-[#085983] font-medium">
                        Height
                      </Label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="5"
                            value={feet}
                            onChange={(e) => setFeet(e.target.value)}
                            className={cn(
                              "text-lg",
                              errors.height
                                ? "border-red-500 focus:border-red-500"
                                : ""
                            )}
                            min="1"
                            max="10"
                          />
                          <Label className="text-xs text-[#085983]/60 mt-1 block">
                            feet
                          </Label>
                        </div>
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="8"
                            value={inches}
                            onChange={(e) => setInches(e.target.value)}
                            className={cn(
                              "text-lg",
                              errors.height
                                ? "border-red-500 focus:border-red-500"
                                : ""
                            )}
                            min="0"
                            max="11"
                          />
                          <Label className="text-xs text-[#085983]/60 mt-1 block">
                            inches
                          </Label>
                        </div>
                      </div>
                      {errors.height && (
                        <p className="text-sm text-red-600">{errors.height}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="weight-lbs"
                        className="font-[family-name:var(--font-geist-sans)] text-[#085983] font-medium"
                      >
                        Weight (lbs)
                      </Label>
                      <Input
                        id="weight-lbs"
                        type="number"
                        placeholder="154"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className={cn(
                          "text-lg",
                          errors.weight
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        )}
                        min="1"
                        max="2000"
                      />
                      {errors.weight && (
                        <p className="text-sm text-red-600">{errors.weight}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons - Following early-adopters button style */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  onClick={calculateBMI}
                  size="lg"
                  className="flex-1 bg-gradient-to-b from-[#085983] via-[#0a6b99] to-[#085983] hover:from-[#074a6b] hover:via-[#085983] hover:to-[#074a6b] text-white font-[family-name:var(--font-geist-sans)] text-lg font-bold py-4 px-6 rounded-full shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-105 tracking-wider border-2 border-[#085983]/50"
                  style={{
                    boxShadow:
                      "0 8px 20px rgba(8, 89, 131, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  CALCULATE BMI
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2 border-[#085983]/30 text-[#085983] hover:bg-[#085983]/5 font-[family-name:var(--font-geist-sans)] text-lg font-bold py-4 px-6 rounded-full transition-all duration-300 hover:scale-105 tracking-wider"
                >
                  RESET
                </Button>
              </div>

              {/* Results */}
              {result && (
                <div className="mt-12 space-y-8">
                  <div
                    className={cn(
                      "p-6 rounded-xl border-2 transition-all duration-300",
                      result.bgColor,
                      `border-${result.categoryColor.split("-")[1]}-200`
                    )}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-white rounded-full p-4 shadow-lg">
                          <div
                            className={cn(
                              "text-4xl font-bold",
                              result.categoryColor
                            )}
                          >
                            {result.bmi.toFixed(1)}
                          </div>
                        </div>
                      </div>

                      <h3
                        className={cn(
                          "font-[family-name:var(--font-geist-sans)] text-2xl font-semibold mb-2",
                          result.categoryColor
                        )}
                      >
                        {result.category}
                      </h3>

                      <p className="font-[family-name:var(--font-geist-sans)] text-[#085983]/70 leading-relaxed">
                        {result.description}
                      </p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <Card className="border-gray-200">
                    <CardHeader>
                      <CardTitle className="font-[family-name:var(--font-geist-sans)] text-xl text-[#085983]">
                        Personalized Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#085983] rounded-full mt-2 flex-shrink-0"></div>
                            <span className="font-[family-name:var(--font-geist-sans)] text-[#085983]/80 leading-relaxed">
                              {rec}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Disclaimer */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="font-[family-name:var(--font-geist-sans)] text-sm text-[#085983]/60 text-center leading-relaxed">
                      <strong>Medical Disclaimer:</strong> BMI is a screening
                      tool using WHO/CDC standards and may not reflect body fat
                      distribution or muscle mass. Categories may vary by
                      ethnicity and age. This calculator is for informational
                      purposes only and should not replace professional medical
                      advice. Always consult with healthcare professionals for
                      personalized health guidance.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cursor rules applied correctly.
