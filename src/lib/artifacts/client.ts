import type { Dispatch, SetStateAction } from "react";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { ChatMessage } from "@/lib/types";

export interface ArtifactAction {
  icon: React.ReactNode;
  label?: string;
  description: string;
  onClick: (context: ArtifactActionContext) => void | Promise<void>;
  isDisabled?: (context: ArtifactActionContext) => boolean;
}

export interface ArtifactToolbarItem {
  icon: React.ReactNode;
  description: string;
  onClick: (context: {
    sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  }) => void;
}

export interface ArtifactActionContext {
  content: string;
  handleVersionChange: (type: "next" | "prev" | "toggle" | "latest") => void;
  currentVersionIndex: number;
  isCurrentVersion: boolean;
  mode: "edit" | "diff";
  metadata: any;
  setMetadata: Dispatch<SetStateAction<any>>;
  sendMessage?: UseChatHelpers<ChatMessage>["sendMessage"];
}

export interface ArtifactConfig<T = any> {
  kind: string;
  description: string;
  initialize?: (params: {
    documentId: string;
    setMetadata: Dispatch<SetStateAction<T>>;
  }) => void | Promise<void>;
  onStreamPart?: (params: {
    streamPart: any;
    setArtifact: Dispatch<SetStateAction<any>>;
    setMetadata: Dispatch<SetStateAction<T>>;
  }) => void;
  content: React.ComponentType<any>;
  actions: ArtifactAction[];
  toolbar: ArtifactToolbarItem[];
}

export class Artifact<K extends string = string, T = any> {
  public kind: K;
  public description: string;
  public initialize?: (params: {
    documentId: string;
    setMetadata: Dispatch<SetStateAction<T>>;
  }) => void | Promise<void>;
  public onStreamPart?: (params: {
    streamPart: any;
    setArtifact: Dispatch<SetStateAction<any>>;
    setMetadata: Dispatch<SetStateAction<T>>;
  }) => void;
  public content: React.ComponentType<any>;
  public actions: ArtifactAction[];
  public toolbar: ArtifactToolbarItem[];

  constructor(config: ArtifactConfig<T> & { kind: K }) {
    this.kind = config.kind;
    this.description = config.description;
    this.initialize = config.initialize;
    this.onStreamPart = config.onStreamPart;
    this.content = config.content;
    this.actions = config.actions;
    this.toolbar = config.toolbar;
  }
}

// Cursor rules applied correctly.
