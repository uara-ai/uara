import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import { LONGEVITY_SYSTEM_PROMPT } from "./system-prompt";

// Default model configuration
export const DEFAULT_MODEL = "gpt-4o-mini";
export const TITLE_MODEL = "gpt-5-nano";

// Provider configuration for compatibility
export const myProvider = {
  languageModel: (modelId: string) => {
    switch (modelId) {
      case "chat-model":
      case "artifact-model":
        return openai(DEFAULT_MODEL);
      case "title-model":
        return openai(TITLE_MODEL);
      case "chat-model-reasoning":
        return openai(DEFAULT_MODEL);
      default:
        return openai(DEFAULT_MODEL);
    }
  },
};

// Generate chat title based on first message
export async function generateChatTitle(firstMessage: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai(TITLE_MODEL),
      prompt: `Generate a concise, descriptive title (maximum 6 words) for a chat that starts with this message: "${firstMessage}". The title should capture the main topic or intent. Examples: "Sleep Optimization Questions", "Lab Results Analysis", "Exercise Routine Planning". Only return the title, nothing else.`,
      maxOutputTokens: 50,
    });

    return text.trim();
  } catch (error) {
    console.error("Error generating chat title:", error);
    return "New Health Chat";
  }
}

// Stream chat response
export async function streamChatResponse(
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>,
  tools?: any[]
) {
  return streamText({
    model: openai(DEFAULT_MODEL),
    messages: [
      { role: "system", content: LONGEVITY_SYSTEM_PROMPT },
      ...messages,
    ],
    maxOutputTokens: 500,
    tools: tools || {},
    temperature: 0.7,
  });
}

// Cursor rules applied correctly.
