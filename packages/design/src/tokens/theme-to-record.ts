import type { TokenName } from './token-names.js';
import type { ThemeDefinition } from './theme-definition.types.js';
import { flattenTheme } from './flatten-theme.js';

/** A {@link ThemeDefinition} as a frozen `TokenName -> value` lookup map. */
export function themeToRecord(theme: ThemeDefinition): Readonly<Record<TokenName, string>> {
  const record = {} as Record<TokenName, string>;
  for (const { name, value } of flattenTheme(theme)) {
    record[name] = value;
  }
  return Object.freeze(record);
}
