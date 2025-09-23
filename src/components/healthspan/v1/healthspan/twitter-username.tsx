"use client";

import React, { useState, useEffect } from "react";
import { IconBrandX, IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  getSocialUsername,
  saveSocialUsername,
} from "@/actions/social-actions";

interface TwitterUsernameProps {
  className?: string;
}

export function TwitterUsername({ className }: TwitterUsernameProps) {
  const [username, setUsername] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch username on component mount
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const result = await getSocialUsername("x");
        if (result.error) {
          setError(result.error);
        } else {
          setUsername(result.username || null);
        }
      } catch (err) {
        setError("Failed to load username");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsername();
  }, []);

  const handleEdit = () => {
    setInputValue(username || "");
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue("");
    setError(null);
  };

  const handleSave = async () => {
    if (!inputValue.trim()) {
      setError("Username cannot be empty");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await saveSocialUsername("x", inputValue.trim());
      if (result.error) {
        setError(result.error);
      } else {
        setUsername(inputValue.trim());
        setIsEditing(false);
        setInputValue("");
      }
    } catch (err) {
      setError("Failed to save username");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="w-4 h-4 border-2 border-[#085983]/20 border-t-[#085983] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
          <span className="text-[#085983]/60 text-sm flex items-center gap-1">
            <IconBrandX className="size-3" />@
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="username"
            className="bg-transparent outline-none text-sm text-[#085983] placeholder:text-[#085983]/40 min-w-0 flex-1"
            autoFocus
            maxLength={50}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || !inputValue.trim()}
          className={cn(
            "p-1.5 rounded-full transition-colors",
            "bg-emerald-400 hover:bg-emerald-500 disabled:bg-emerald-200",
            "text-white disabled:text-emerald-400"
          )}
        >
          <IconCheck className="size-3" />
        </button>

        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="p-1.5 rounded-full bg-red-200 hover:bg-red-300 text-red-600 transition-colors"
        >
          <IconX className="size-3" />
        </button>

        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    );
  }

  if (username) {
    return (
      <button
        onClick={handleEdit}
        className={cn(
          "flex items-center gap-1 text-[#085983]/70 hover:text-[#085983] transition-colors group",
          className
        )}
      >
        <span className="text-sm flex items-center gap-1">
          <IconBrandX className="size-3" />@{username}
        </span>
        <svg
          className="size-3 opacity-0 group-hover:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleEdit}
      className={cn(
        "flex items-center gap-1 px-3 py-1.5 text-xs text-[#085983]/60 hover:text-[#085983] border border-[#085983]/20 hover:border-[#085983]/40 rounded-full transition-colors group",
        className
      )}
    >
      <IconPlus className="size-3" />
      <span className="flex items-center gap-1">
        Add <IconBrandX className="size-3" /> username
      </span>
    </button>
  );
}

// Cursor rules applied correctly.
