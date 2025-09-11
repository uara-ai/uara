export const DEFAULT_CHAT_MODEL: string = "chat-model";

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: "chat-model",
    name: "GPT-5-mini",
    description: "Advanced multimodal model with vision and text capabilities",
  },
  {
    id: "chat-model-reasoning",
    name: "GPT-5",
    description:
      "Uses advanced chain-of-thought reasoning for complex problems",
  },
];

// Cursor rules applied correctly.
