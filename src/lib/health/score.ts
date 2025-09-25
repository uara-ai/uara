// ---------- Public API ----------

import {
  CategoryScores,
  MarkersConfig,
  MarkerValues,
  PerMarkerScore,
  ScoreOutput,
} from "./types";

// Import helper functions
const clip = (x: number, lo = 0, hi = 1) => (x < lo ? lo : x > hi ? hi : x);

const mean = (arr: number[]): number =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN;

const isFiniteNumber = (x: unknown): x is number =>
  typeof x === "number" && Number.isFinite(x);

// Import scoring kernels
function scoreHigher(value: number, L: number, U: number): number {
  if (U <= L) return NaN;
  return 100 * clip((value - L) / (U - L), 0, 1);
}

function scoreLower(value: number, L: number, U: number): number {
  if (U <= L) return NaN;
  return 100 * clip((U - value) / (U - L), 0, 1);
}

function scoreOptimal(
  value: number,
  L: number,
  A: number,
  B: number,
  U: number
): number {
  // Expect L < A <= B < U
  if (!(L < A && A <= B && B < U)) return NaN;
  if (value <= L || value >= U) return 0;
  if (value < A) return 100 * ((value - L) / (A - L));
  if (value <= B) return 100;
  // value in (B, U)
  return 100 * ((U - value) / (U - B));
}

/**
 * Compute per-marker, category, and overall scores.
 *
 * @param config  JSON config of categories -> markers (with id/type/range)
 * @param values  Record of markerId -> numeric value (missing/undefined is ignored)
 * @returns ScoreOutput
 */
export function computeHealthScores(
  config: MarkersConfig,
  values: MarkerValues
): ScoreOutput {
  const perMarker: PerMarkerScore[] = [];

  // 1) Per-marker scores
  for (const [categoryName, markers] of Object.entries(config)) {
    for (const m of markers) {
      const v = values[m.id];
      let s: number | null = null;

      if (m.type === "ignore") {
        s = null;
      } else if (!isFiniteNumber(v)) {
        s = null; // missing value -> ignored in averages
      } else if (m.type === "higher") {
        const [L, U] = m.range;
        const scored = scoreHigher(v, L, U);
        s = Number.isNaN(scored) ? null : Math.max(0, Math.min(100, scored));
      } else if (m.type === "lower") {
        const [L, U] = m.range;
        const scored = scoreLower(v, L, U);
        s = Number.isNaN(scored) ? null : Math.max(0, Math.min(100, scored));
      } else if (m.type === "optimal") {
        const [L, A, B, U] = m.range;
        const scored = scoreOptimal(v, L, A, B, U);
        s = Number.isNaN(scored) ? null : Math.max(0, Math.min(100, scored));
      } else {
        s = null;
      }

      perMarker.push({
        id: m.id,
        label: m.label,
        category: categoryName,
        value: isFiniteNumber(v) ? v : null,
        score: s,
      });
    }
  }

  // 2) Category subscores (mean of available marker scores)
  const category: CategoryScores = {};
  for (const [categoryName] of Object.entries(config)) {
    const scores = perMarker
      .filter((p) => p.category === categoryName && isFiniteNumber(p.score))
      .map((p) => p.score as number);
    category[categoryName] = Number.isFinite(mean(scores)) ? mean(scores) : NaN;
  }

  // 3) Overall score (mean of category subscores)
  const catVals = Object.values(category).filter((x) =>
    isFiniteNumber(x)
  ) as number[];
  const overall = Number.isFinite(mean(catVals)) ? mean(catVals) : NaN;

  return { perMarker, category, overall };
}
