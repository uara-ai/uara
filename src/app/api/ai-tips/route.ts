import { withAuth } from "@workos-inc/authkit-nextjs";
import { ChatSDKError } from "@/lib/errors";
import { client } from "@/packages/redis/client";
import { generateObject } from "ai";
import { myProvider } from "@/lib/ai/providers";
import { z } from "zod";
import {
  getLatestHealthScore,
  getLatestMarkerScoresByCategory,
  getCategoryPerformanceSummary,
} from "@/lib/health/database";

// Cache for 8 hours
const CACHE_TTL = 8 * 60 * 60; // 8 hours in seconds

// Response schema matching our UI expectations
const aiTipsResponseSchema = z.object({
  overallHealthScore: z.number(),
  status: z.string(),
  primaryConcern: z.string(),
  strengths: z.array(z.string()),
  summary: z.string(),
  categoryInsights: z.object({
    nutrition: z.object({
      score: z.number().optional(),
      summary: z.string().optional(),
      topMarkers: z.array(z.string()).optional(),
    }),
    sleepRecovery: z.object({
      score: z.number().optional(),
      summary: z.string().optional(),
      topMarkers: z.array(z.string()).optional(),
    }),
    movementFitness: z.object({
      score: z.number().optional(),
      summary: z.string().optional(),
      topMarkers: z.array(z.string()).optional(),
    }),
    mindStress: z.object({
      score: z.number().optional(),
      summary: z.string().optional(),
      topMarkers: z.array(z.string()).optional(),
    }),
    healthChecks: z.object({
      score: z.number().optional(),
      summary: z.string().optional(),
      topMarkers: z.array(z.string()).optional(),
    }),
  }),
  tips: z.array(
    z.object({
      category: z.enum([
        "nutrition",
        "sleep-recovery",
        "movement-fitness",
        "mind-stress",
        "health-checks",
        "lifestyle",
      ]),
      title: z.string(),
      description: z.string(),
      action: z.string(),
      priority: z.enum(["low", "medium", "high"]),
      timeframe: z.enum(["immediate", "daily", "weekly", "monthly"]),
      impact: z.enum(["minor", "moderate", "significant"]),
      difficulty: z.enum(["easy", "moderate", "challenging"]),
      relatedMarkers: z.array(z.string()).optional(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const { user } = await withAuth();
    if (!user) {
      return new ChatSDKError("bad_request:auth").toResponse();
    }

    // Use simple, consistent cache key for user (not data-dependent)
    const cacheKey = `ai_tips:${user.id}`;
    console.log("Looking for cached AI tips with key:", cacheKey);

    // Try to get from cache first
    const cached = await client.get(cacheKey);
    console.log("Cache lookup result:", {
      found: !!cached,
      type: typeof cached,
    });

    if (cached) {
      console.log("Found cached AI tips, returning them");
      try {
        // Handle different cache formats
        let cachedData;
        if (typeof cached === "string") {
          console.log("Parsing cached string data");
          cachedData = JSON.parse(cached);
        } else {
          console.log("Using cached object data directly");
          cachedData = cached;
        }

        // Validate that cached data has expected structure
        if (
          cachedData &&
          typeof cachedData === "object" &&
          cachedData.tips &&
          Array.isArray(cachedData.tips)
        ) {
          console.log(
            "Valid cached data found with",
            cachedData.tips.length,
            "tips"
          );
          return Response.json(cachedData);
        } else {
          console.log("Cached data is invalid, regenerating");
          await client.del(cacheKey);
        }
      } catch (parseError) {
        console.error("Failed to parse cached data:", parseError);
        // If cache is corrupted, delete it and continue to regenerate
        await client.del(cacheKey);
      }
    } else {
      console.log("No cached AI tips found, generating new ones");
    }

    // Fetch real health data from database
    console.log("Fetching health marker data from database...");

    const [latestHealthScore, markerScoresByCategory, categoryPerformance] =
      await Promise.all([
        getLatestHealthScore(user.id),
        getLatestMarkerScoresByCategory(user.id),
        getCategoryPerformanceSummary(user.id, 30),
      ]);

    if (!latestHealthScore) {
      return Response.json(
        {
          error:
            "No health score found. Please ensure your health data is synced.",
        },
        { status: 404 }
      );
    }

    console.log("Retrieved health data:", {
      overallScore: latestHealthScore.overallScore,
      categoriesCount: markerScoresByCategory
        ? Object.keys(markerScoresByCategory.markerScores).length
        : 0,
      totalMarkers: markerScoresByCategory?.totalMarkers || 0,
    });

    // Prepare detailed health data for AI analysis
    const healthData = {
      overallScore: latestHealthScore.overallScore,
      categoryScores: {
        nutrition: latestHealthScore.nutritionScore,
        sleepRecovery: latestHealthScore.sleepRecoveryScore,
        movementFitness: latestHealthScore.movementFitnessScore,
        mindStress: latestHealthScore.mindStressScore,
        healthChecks: latestHealthScore.healthChecksScore,
      },
      markersByCategory: markerScoresByCategory?.markerScores || {},
      categoryPerformance: categoryPerformance?.categories || {},
      metadata: {
        calculatedAt: latestHealthScore.calculatedAt,
        totalMarkersUsed: latestHealthScore.totalMarkersUsed,
        dataQualityScore: latestHealthScore.dataQualityScore,
      },
    };

    // Build detailed prompt with marker data
    let detailedPrompt = `Analyze this comprehensive health profile and provide detailed, personalized insights:

## OVERALL HEALTH SCORE: ${healthData.overallScore}/100

## CATEGORY SCORES:
- Nutrition: ${healthData.categoryScores.nutrition || "Not calculated"}/100
- Sleep & Recovery: ${
      healthData.categoryScores.sleepRecovery || "Not calculated"
    }/100
- Movement & Fitness: ${
      healthData.categoryScores.movementFitness || "Not calculated"
    }/100
- Mind & Stress: ${healthData.categoryScores.mindStress || "Not calculated"}/100
- Health Checks: ${
      healthData.categoryScores.healthChecks || "Not calculated"
    }/100

## DETAILED MARKER ANALYSIS:`;

    // Add detailed marker information by category
    Object.entries(healthData.markersByCategory).forEach(
      ([categoryName, markers]) => {
        detailedPrompt += `\n\n### ${categoryName.toUpperCase()}:`;
        (markers as any[]).forEach((marker) => {
          detailedPrompt += `\n- ${marker.markerLabel}: ${
            marker.rawValue !== null ? marker.rawValue : "No data"
          } (Score: ${
            marker.score !== null ? Math.round(marker.score) : "N/A"
          }/100)`;
          if (marker.dataQuality) {
            detailedPrompt += ` [Quality: ${marker.dataQuality}]`;
          }
        });
      }
    );

    // Add performance trends if available
    if (Object.keys(healthData.categoryPerformance).length > 0) {
      detailedPrompt += `\n\n## 30-DAY PERFORMANCE TRENDS:`;
      Object.entries(healthData.categoryPerformance).forEach(
        ([categoryName, performance]: [string, any]) => {
          detailedPrompt += `\n- ${categoryName}: ${Math.round(
            performance.average
          )}/100 avg (${performance.trend}, ${
            performance.dataPoints
          } data points)`;
        }
      );
    }

    detailedPrompt += `\n\n## YOUR TASK:
Based on this comprehensive health data, provide:
1. A detailed summary of their health status
2. Category-specific insights for each area with data
3. 6-10 actionable, prioritized recommendations
4. Focus on the areas with the lowest scores or concerning trends
5. Include specific marker improvements where possible

Be specific, actionable, and evidence-based. Tailor advice to their actual data patterns.`;

    // Generate AI tips using generateObject for structured output
    const result = await generateObject({
      model: myProvider.languageModel("chat-model"),
      system: `You are a longevity and health optimization expert analyzing comprehensive health marker data. 

Your expertise covers:
- Biomarker interpretation and optimization
- Nutrition science and personalized dietary recommendations  
- Sleep science and recovery optimization
- Exercise physiology and movement patterns
- Stress management and mental health
- Preventive medicine and health screening
- Longevity research and anti-aging protocols

Provide detailed, science-backed recommendations based on the user's actual health marker scores and trends. Focus on actionable interventions that can measurably improve their specific biomarkers.`,
      prompt: detailedPrompt,
      schema: aiTipsResponseSchema,
      maxOutputTokens: 3000,
      temperature: 0.7,
    });

    console.log("Tool used correctly - AI tips generated successfully");

    // Cache the result for 8 hours
    try {
      await client.setex(cacheKey, CACHE_TTL, JSON.stringify(result.object));
      console.log("AI tips cached successfully");
    } catch (cacheError) {
      console.error("Failed to cache AI tips:", cacheError);
      // Continue even if caching fails
    }

    return Response.json(result.object);
  } catch (error) {
    console.error("Error generating AI tips:", error);
    return Response.json(
      { error: "Failed to generate AI tips" },
      { status: 500 }
    );
  }
}

// Cursor rules applied correctly.
