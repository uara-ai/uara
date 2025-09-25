// Example usage of the health score database functions
import {
  calculateAndSaveHealthScore,
  getLatestHealthScore,
  getHealthScoreHistory,
  getAverageHealthScores,
} from "./database";

/**
 * Example: Calculate and save a health score for a user
 */
async function exampleSaveHealthScore() {
  const userId = "user_123"; // WorkOS user ID

  // Example health data with only available data (this would typically come from WHOOP, manual input, etc.)
  // Only include markers where you have actual data - missing data will be handled by the scoring algorithm
  const todaysHealthData = {
    // Sleep & Recovery (from WHOOP - if available)
    totalInBedTime: 27360000, // 7.6 hours in milliseconds
    sleepEfficiencyPercentage: 90,
    totalAwakeTime: 1200000, // 20 minutes
    totalRemSleepTime: 6120000, // 1.7 hours
    totalSlowWaveSleepTime: 3960000, // 1.1 hours
    restingHeartRate: 58,
    hrvRmssd: 55,
    recoveryScore: 74,
    sleepPerformancePercentage: 88,
    respiratoryRate: 16,

    // Movement & Fitness (from WHOOP - if available)
    strain: 14.2,
    averageHeartRate: 145,
    maxHeartRate: 175,
    kilojoule: 2600,
    percentRecorded: 95,

    // Health Checks (from user profile or lab results - if available)
    bmi: 23.4,

    // Note: Missing categories like Nutrition and Mind & Stress will not contribute to the score
    // until the user provides that data. The algorithm handles missing data gracefully.
  };

  try {
    const result = await calculateAndSaveHealthScore(
      userId,
      todaysHealthData,
      "v1.0.0" // Version of the scoring algorithm
    );

    console.log("Health score saved successfully!");
    console.log("Overall Score:", result.healthScore.overallScore.toFixed(1));
    console.log("Category Scores:", {
      nutrition: result.healthScore.nutritionScore?.toFixed(1),
      sleepRecovery: result.healthScore.sleepRecoveryScore?.toFixed(1),
      movementFitness: result.healthScore.movementFitnessScore?.toFixed(1),
      mindStress: result.healthScore.mindStressScore?.toFixed(1),
      healthChecks: result.healthScore.healthChecksScore?.toFixed(1),
    });
    console.log(
      "Data Quality:",
      result.healthScore.dataQualityScore?.toFixed(1) + "%"
    );

    return result.healthScore;
  } catch (error) {
    console.error("Error saving health score:", error);
    throw error;
  }
}

/**
 * Example: Get the latest health score for a user
 */
async function exampleGetLatestScore() {
  const userId = "user_123";

  try {
    const latestScore = await getLatestHealthScore(userId);

    if (latestScore) {
      console.log("Latest health score found:");
      console.log("Overall:", latestScore.overallScore);
      console.log("Calculated at:", latestScore.calculatedAt);
    } else {
      console.log("No health scores found for this user");
    }

    return latestScore;
  } catch (error) {
    console.error("Error fetching latest health score:", error);
    throw error;
  }
}

/**
 * Example: Get health score history for the last 30 days
 */
async function exampleGetScoreHistory() {
  const userId = "user_123";
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const history = await getHealthScoreHistory(userId, thirtyDaysAgo);

    console.log(`Found ${history.length} health scores in the last 30 days`);

    // Show the trend
    if (history.length >= 2) {
      const latest = history[0];
      const oldest = history[history.length - 1];
      const trend = latest.overallScore - oldest.overallScore;

      console.log(
        `Score trend: ${trend > 0 ? "+" : ""}${trend.toFixed(1)} points`
      );
    }

    return history;
  } catch (error) {
    console.error("Error fetching score history:", error);
    throw error;
  }
}

/**
 * Example: Get average scores over the last 30 days
 */
async function exampleGetAverageScores() {
  const userId = "user_123";

  try {
    const averages = await getAverageHealthScores(userId, 30);

    if (averages) {
      console.log("30-day averages:");
      console.log("Overall:", averages.averages.overall.toFixed(1));
      console.log("Nutrition:", averages.averages.nutrition?.toFixed(1) || "-");
      console.log(
        "Sleep & Recovery:",
        averages.averages.sleepRecovery?.toFixed(1) || "-"
      );
      console.log(
        "Movement & Fitness:",
        averages.averages.movementFitness?.toFixed(1) || "-"
      );
      console.log(
        "Mind & Stress:",
        averages.averages.mindStress?.toFixed(1) || "-"
      );
      console.log(
        "Health Checks:",
        averages.averages.healthChecks?.toFixed(1) || "-"
      );
      console.log(`Based on ${averages.sampleSize} data points`);
    } else {
      console.log("No scores found for average calculation");
    }

    return averages;
  } catch (error) {
    console.error("Error calculating average scores:", error);
    throw error;
  }
}

/**
 * Run all examples (for testing purposes)
 */
export async function runHealthScoreExamples() {
  console.log("=== Health Score Database Examples ===\n");

  try {
    console.log("1. Saving a new health score...");
    await exampleSaveHealthScore();
    console.log("✓ Complete\n");

    console.log("2. Getting latest health score...");
    await exampleGetLatestScore();
    console.log("✓ Complete\n");

    console.log("3. Getting score history...");
    await exampleGetScoreHistory();
    console.log("✓ Complete\n");

    console.log("4. Getting average scores...");
    await exampleGetAverageScores();
    console.log("✓ Complete\n");

    console.log("All examples completed successfully!");
  } catch (error) {
    console.error("Example failed:", error);
  }
}

// Cursor rules applied correctly.
