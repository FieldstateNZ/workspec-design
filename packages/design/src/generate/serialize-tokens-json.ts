import type { TokensJson } from './tokens-json.types.js';

/** Serializes {@link TokensJson} the one way `scripts/generate.ts` and the drift test both use. */
export function serializeTokensJson(data: TokensJson): string {
  return `${JSON.stringify(data, null, 2)}\n`;
}
