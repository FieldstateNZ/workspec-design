/**
 * Rounds a contrast ratio to 2 decimal places — the precision
 * `known-failures.ts` records ratios at and `docs/contrast-audit.md`
 * displays them at. Shared so the gate test, the allowlist, and the report
 * generator can never disagree about what "the ratio" is.
 */
export function roundRatio(ratio: number): number {
  return Math.round(ratio * 100) / 100;
}
