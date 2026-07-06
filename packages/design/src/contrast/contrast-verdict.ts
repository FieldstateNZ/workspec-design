import { roundRatio } from './round-ratio.js';

/**
 * Single source of truth for "does this measured ratio pass its class
 * threshold?" Both operands are rounded to 2 decimal places (`roundRatio`)
 * before comparing, rather than compared raw.
 *
 * This matters because `known-failures.ts` records `measuredRatio` at
 * 2-decimal precision and `docs/contrast-audit.md` displays ratios at the
 * same precision — those are the numbers a human actually reads. A ratio
 * that sits within 0.005 of a threshold (e.g. a raw 4.4996 against the
 * 4.5:1 normal-text threshold) rounds up to the displayed "4.50:1", which
 * reads as a pass, but would fail an unrounded `4.4996 >= 4.5` comparison.
 * Rounding both sides keeps the pass/fail verdict consistent with what's
 * recorded in the allowlist and what's shown in the report — the gate test
 * and the report builder must never disagree about the same ratio.
 */
export function contrastVerdict(ratio: number, threshold: number): boolean {
  return roundRatio(ratio) >= roundRatio(threshold);
}
