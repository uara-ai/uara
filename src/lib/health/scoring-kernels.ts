// ---------- Scoring kernels ----------
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
