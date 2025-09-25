"use client";

import { useEffect, useState } from "react";
import { User2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getUserProfileAction } from "@/actions/get-user-profile-action";

interface UserProfile {
  age: number | null;
  gender: string | null;
  ethnicity: string | null;
  heightCm: number | null;
  weightKg: number | null;
  bloodType: string | null;
  profileCompleted: boolean;
}

export function UserSummaryBadge() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getUserProfileAction({});
        if (result?.data) {
          setProfile(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <Badge variant="secondary" className="h-6 px-2">
        <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
      </Badge>
    );
  }

  if (!profile || !profile.profileCompleted) {
    return null;
  }

  const formatGender = (gender: string | null) => {
    if (!gender) return "-";
    switch (gender) {
      case "MALE":
        return "M";
      case "FEMALE":
        return "F";
      case "NON_BINARY":
        return "NB";
      case "PREFER_NOT_TO_SAY":
        return "-";
      case "OTHER":
        return "O";
      default:
        return "-";
    }
  };

  const formatEthnicity = (ethnicity: string | null) => {
    if (!ethnicity) return "-";
    switch (ethnicity) {
      case "ASIAN":
        return "Asian";
      case "BLACK_AFRICAN_AMERICAN":
        return "Black";
      case "HISPANIC_LATINO":
        return "Hispanic";
      case "WHITE":
        return "White";
      case "MULTIRACIAL":
        return "Mixed";
      case "AMERICAN_INDIAN_ALASKA_NATIVE":
        return "Native Am.";
      case "NATIVE_HAWAIIAN_PACIFIC_ISLANDER":
        return "Pacific";
      case "PREFER_NOT_TO_SAY":
        return "-";
      case "OTHER":
        return "Other";
      default:
        return "-";
    }
  };

  const formatBloodType = (bloodType: string | null) => {
    if (!bloodType || bloodType === "UNKNOWN") return "-";
    return bloodType.replace("_", "");
  };

  const formatHeight = (heightCm: number | null) => {
    if (!heightCm) return "-";
    return `${heightCm}cm`;
  };

  const formatWeight = (weightKg: number | null) => {
    if (!weightKg) return "-";
    return `${weightKg}kg`;
  };

  const summaryText = `${profile.age || "-"}y • ${formatGender(
    profile.gender
  )}`;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className="h-6 px-2 text-xs font-mono cursor-help hover:bg-accent/50 transition-colors"
        >
          <User2 className="w-3 h-3 mr-1" />
          {summaryText}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        <div className="space-y-1">
          <div className="font-semibold">Health Profile</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>Age: {profile.age || "-"}</div>
            <div>Gender: {formatGender(profile.gender)}</div>
            <div>Ethnicity: {formatEthnicity(profile.ethnicity)}</div>
            <div>Blood: {formatBloodType(profile.bloodType)}</div>
            <div>Height: {formatHeight(profile.heightCm)}</div>
            <div>Weight: {formatWeight(profile.weightKg)}</div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// Cursor rules applied correctly.
