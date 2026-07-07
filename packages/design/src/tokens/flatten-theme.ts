import type { TokenName } from './token-names.js';
import type { ThemeDefinition } from './theme-definition.types.js';

/**
 * Flattens a {@link ThemeDefinition}'s blocks/sections into the ordered
 * `{ name, value }` pairs consumers actually want — the block/section split
 * only matters for reproducing the source CSS's rule structure. Used to
 * build the per-theme `Record<TokenName, string>` maps in `src/index.ts` and
 * the `tokens.json` output, and by the source-of-record fidelity test.
 */
export function flattenTheme(
  theme: ThemeDefinition,
): ReadonlyArray<{ name: TokenName; value: string }> {
  const entries: Array<{ name: TokenName; value: string }> = [];
  for (const block of theme.blocks) {
    for (const section of block.sections) {
      entries.push(...section.tokens);
    }
  }
  return entries;
}
