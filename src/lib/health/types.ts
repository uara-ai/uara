// ---------- Types ----------
export type MarkerType = "higher" | "lower" | "optimal" | "ignore";

export type MarkerDef =
  | {
      id: string;
      label: string;
      type: "higher" | "lower";
      range: [number, number]; // [L, U]
    }
  | {
      id: string;
      label: string;
      type: "optimal";
      range: [number, number, number, number]; // [L, A, B, U]
    }
  | {
      id: string;
      label: string;
      type: "ignore";
      range: null;
    };

export type CategoryDef = {
  // e.g. "Nutrition", "SleepRecovery", ...
  name: string;
  markers: MarkerDef[];
};

export type MarkersConfig = Record<string, MarkerDef[]>; // key = category key (e.g. "Nutrition")

export type MarkerValues = Record<string, number | null | undefined>; // key = marker.id

export type PerMarkerScore = {
  id: string;
  label: string;
  category: string;
  value: number | null | undefined;
  score: number | null; // 0-100 or null if not scorable
};

export type CategoryScores = Record<string, number>; // category -> 0-100

export type ScoreOutput = {
  perMarker: PerMarkerScore[];
  category: CategoryScores;
  overall: number; // 0-100
};
