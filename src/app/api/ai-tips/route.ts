import { withAuth } from "@workos-inc/authkit-nextjs";
import { ChatSDKError } from "@/lib/errors";
import { client } from "@/packages/redis/client";
import { generateObject } from "ai";
import { myProvider } from "@/lib/ai/providers";
import { z } from "zod";

// Cache for 8 hours
const CACHE_TTL = 8 * 60 * 60; // 8 hours in seconds

// Response schema matching our UI expectations
const aiTipsResponseSchema = z.object({
  overallHealthScore: z.number(),
  status: z.string(),
  primaryConcern: z.string(),
  strengths: z.array(z.string()),
  summary: z.string(),
  tips: z.array(
    z.object({
      category: z.enum([
        "sleep",
        "recovery",
        "strain",
        "nutrition",
        "exercise",
        "lifestyle",
      ]),
      title: z.string(),
      description: z.string(),
      action: z.string(),
      priority: z.enum(["low", "medium", "high"]),
      timeframe: z.enum(["immediate", "daily", "weekly", "monthly"]),
      impact: z.enum(["minor", "moderate", "significant"]),
      difficulty: z.enum(["easy", "moderate", "challenging"]),
      statImpact: z.object({
        sleep: z.number().optional(),
        recovery: z.number().optional(),
        strain: z.number().optional(),
      }),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const { user } = await withAuth();
    if (!user) {
      return new ChatSDKError("bad_request:auth").toResponse();
    }

    const { healthStats } = await req.json();

    if (!healthStats) {
      return Response.json({ error: "Health stats required" }, { status: 400 });
    }

    // Use simple, consistent cache key for user (not data-dependent)
    const cacheKey = `ai_tips:${user.id}`;
    console.log("Looking for cached AI tips with key:", cacheKey);

    // Debug: Check what AI tips keys exist in Redis
    try {
      const allKeys = await client.keys(`ai_tips:${user.id}*`);
      console.log("Existing AI tips keys for user:", allKeys);
    } catch (debugError) {
      console.log(
        "Could not check existing keys:",
        debugError instanceof Error ? debugError.message : "Unknown error"
      );
    }

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

    // Generate AI tips using generateObject for structured output
    const result = await generateObject({
      model: myProvider.languageModel("chat-model"),
      system: `You are a longevity and health optimization expert. Analyze the provided health data and generate personalized tips to improve health metrics.

Focus on:
- Sleep quality and consistency
- Recovery optimization
- Strain balance and training
- Nutrition and lifestyle factors
- Evidence-based recommendations

Provide actionable, specific advice that users can implement immediately.`,
      prompt: `Analyze these health stats and provide personalized tips:

Sleep Performance: ${healthStats.sleep?.performance || 0}%
Sleep Efficiency: ${healthStats.sleep?.efficiency || 0}%
Sleep Duration: ${healthStats.sleep?.duration || 0} hours
Sleep Consistency: ${healthStats.sleep?.consistency || 0}%

Recovery Score: ${healthStats.recovery?.score || 0}%
HRV: ${healthStats.recovery?.hrv || 0}ms
Resting HR: ${healthStats.recovery?.restingHR || 0} bpm

Daily Strain: ${healthStats.strain?.daily || 0}
Weekly Strain: ${healthStats.strain?.weekly || 0}
Strain Balance: ${healthStats.strain?.balance || "unknown"}
Workout Frequency: ${healthStats.strain?.workoutFrequency || 0}/week

Overall Health Score: ${healthStats.overall?.healthScore || 0}%

Generate an overall health assessment and 5-8 specific, actionable tips to improve these metrics.`,
      schema: aiTipsResponseSchema,
      maxOutputTokens: 2000,
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
