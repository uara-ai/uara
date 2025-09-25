// ---------- Helpers ----------
const clip = (x: number, lo = 0, hi = 1) => (x < lo ? lo : x > hi ? hi : x);

const mean = (arr: number[]): number =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN;

const isFiniteNumber = (x: unknown): x is number =>
  typeof x === "number" && Number.isFinite(x);
