import { createDocument } from "./create-document";
import { updateDocument } from "./update-document";
import { requestSuggestions } from "./request-suggestions";
import { getWeather } from "./get-weather";
import type { User } from "@/lib/user.type";
import type { UIMessageStreamWriter } from "ai";
import type { ChatMessage } from "@/lib/types";

interface ToolsProps {
  user: User;
  dataStream: UIMessageStreamWriter<ChatMessage>;
}

export function createTools({ user, dataStream }: ToolsProps) {
  return {
    getWeather,
    createDocument: createDocument({ user, dataStream }),
    updateDocument: updateDocument({ user, dataStream }),
    requestSuggestions: requestSuggestions({ user, dataStream }),
  };
}

export type ChatTools = ReturnType<typeof createTools>;

// Cursor rules applied correctly.
