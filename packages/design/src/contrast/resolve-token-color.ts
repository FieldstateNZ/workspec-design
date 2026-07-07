import type { TokenName } from '../tokens/token-names.js';
import type { RgbaColor } from './color.types.js';
import { parseColor } from './parse-color.js';

const WHOLE_VALUE_VAR_REFERENCE = /^var\(\s*(--[a-zA-Z0-9-]+)\s*\)$/;

/**
 * Resolves a token to a concrete `RgbaColor`, following `var(--x)` alias
 * chains within the *same* theme (e.g. `--bg-elev: var(--bg-elevated)`)
 * until it hits a literal color. Only handles the "whole value is one
 * var() reference" alias shape — the one used by every alias in the token
 * tables — not a value that merely *contains* a reference alongside other
 * text (that's `extractVarReferences`'s job, for the completeness gate).
 *
 * Throws if the token is undefined, the alias chain cycles, or the final
 * literal isn't a color this package can parse. All three indicate a bad
 * contrast-pair definition (a pair pointed at a non-color token) rather
 * than something a consumer can hit at runtime — every token this
 * function is actually called with is chosen from `pairs.ts`.
 */
export function resolveTokenColor(
  themeRecord: Readonly<Record<TokenName, string>>,
  name: TokenName,
): RgbaColor {
  const visited = new Set<TokenName>();
  let current = name;

  for (;;) {
    if (visited.has(current)) {
      throw new Error(
        `circular var() reference resolving ${name}: ${[...visited, current].join(' -> ')}`,
      );
    }
    visited.add(current);

    const value = themeRecord[current];
    if (value === undefined) {
      throw new Error(`token ${current} is not bound (resolving ${name})`);
    }

    const alias = WHOLE_VALUE_VAR_REFERENCE.exec(value.trim());
    if (!alias) {
      const color = parseColor(value);
      if (!color) {
        throw new Error(`token ${current} (resolving ${name}) is not a color literal: "${value}"`);
      }
      return color;
    }

    const target = alias[1];
    if (target === undefined) {
      throw new Error(`token ${current} (resolving ${name}) has an unparseable var() reference`);
    }
    current = target as TokenName;
  }
}
