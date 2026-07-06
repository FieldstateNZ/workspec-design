import type { TokenName } from '../tokens/token-names.js';
import type { ThemeName } from '../tokens/theme-name.js';
import type { TokenGroupId } from '../tokens/groups.js';

/** One theme's entry inside `tokens.json`. */
export interface TokensJsonTheme {
  readonly selector: string;
  readonly tokens: Readonly<Record<TokenName, string>>;
}

/** One family's entry inside `tokens.json`'s `fonts` summary. */
export interface TokensJsonFontSummary {
  readonly weights: readonly number[];
  readonly fileCount: number;
}

/** The full shape of the committed `tokens.json` artifact. */
export interface TokensJson {
  readonly version: string;
  readonly themes: Readonly<Record<ThemeName, TokensJsonTheme>>;
  readonly groups: Readonly<Record<TokenGroupId, readonly TokenName[]>>;
  readonly tailwindMapping: Readonly<Record<string, string>>;
  readonly fonts: Readonly<Record<string, TokensJsonFontSummary>>;
}
