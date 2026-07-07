import type { TokenName } from './token-names.js';
import type { ThemeName } from './theme-name.js';
import { THEMES } from './theme-registry.js';
import { themeToRecord } from './theme-to-record.js';

/**
 * Every theme's tokens as a frozen `TokenName -> value` lookup map, keyed by
 * {@link ThemeName} — e.g. `THEME_TOKENS['console-dark']['--accent']`.
 */
export const THEME_TOKENS: Readonly<Record<ThemeName, Readonly<Record<TokenName, string>>>> = {
  'console-dark': themeToRecord(THEMES['console-dark']),
  'console-light': themeToRecord(THEMES['console-light']),
};
