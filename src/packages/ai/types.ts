// Types for AI chat functionality

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
  toolInvocations?: ToolInvocation[];
}

export interface Chat {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

export interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  args: Record<string, any>;
  result?: any;
  state: "partial-call" | "call" | "result";
}

export interface StreamingChatResponse {
  content: string;
  isLoading: boolean;
  error?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
  currentChatId?: string;
}

// Tool definitions for future use
export interface HealthTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: Record<string, any>) => Promise<any>;
}

// Available tool types for health and longevity
export type HealthToolType =
  | "biomarker_analysis"
  | "sleep_analysis"
  | "exercise_planning"
  | "nutrition_tracking"
  | "supplement_research"
  | "lab_interpretation"
  | "recovery_optimization"
  | "stress_assessment";

// Cursor rules applied correctly.
