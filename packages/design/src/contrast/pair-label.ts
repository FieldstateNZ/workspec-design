import type { ContrastPair } from './pairs.types.js';

/** `"--ink-muted on --bg"` — the human-readable label used in test failures and the audit report. */
export function pairLabel(pair: ContrastPair): string {
  return `${pair.textToken} on ${pair.bgToken}`;
}
