import type { FontManifestEntry } from '../fonts/font-manifest.types.js';
import type { TokensJsonFontSummary } from './tokens-json.types.js';

/**
 * Collapses the font manifest (one entry per file/weight/subset) into one
 * summary per family — the `fonts` field of `tokens.json`. The full
 * per-file manifest (source URLs, unicode ranges) stays available as-is at
 * `fonts/manifest.json`; this is a smaller, human-skimmable summary of it.
 */
export function buildFontSummary(
  manifest: readonly FontManifestEntry[],
): Readonly<Record<string, TokensJsonFontSummary>> {
  const summary: Record<string, TokensJsonFontSummary> = {};
  for (const entry of manifest) {
    const existing = summary[entry.family];
    if (!existing) {
      summary[entry.family] = { weights: [entry.weight], fileCount: 1 };
      continue;
    }
    summary[entry.family] = {
      weights: existing.weights.includes(entry.weight)
        ? existing.weights
        : [...existing.weights, entry.weight].sort((a, b) => a - b),
      fileCount: existing.fileCount + 1,
    };
  }
  return summary;
}
