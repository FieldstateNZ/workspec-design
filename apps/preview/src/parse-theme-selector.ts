/** The `[data-aesthetic]`/`[data-theme]` attribute pair a theme's selector activates on. */
export interface ThemeAttributes {
  readonly aesthetic: string;
  readonly theme: string;
}

const SELECTOR_PATTERN = /data-aesthetic="([^"]+)"\]\[data-theme="([^"]+)"/;

/**
 * Parses `@workspec/design`'s `THEME_SELECTORS[name]` (e.g.
 * `[data-aesthetic="console"][data-theme="dark"]`) into the attribute pair a
 * host sets to activate it. Reading the values out of the selector string —
 * rather than assuming a theme name always splits as `<aesthetic>-<mode>` —
 * keeps this panel correct if a future theme name doesn't follow that
 * convention.
 */
export function parseThemeSelector(selector: string): ThemeAttributes {
  const match = SELECTOR_PATTERN.exec(selector);
  if (!match) {
    throw new Error(`Theme selector "${selector}" did not match the expected attribute pattern`);
  }
  const [, aesthetic, theme] = match;
  if (!aesthetic || !theme) {
    throw new Error(`Theme selector "${selector}" produced empty attribute values`);
  }
  return { aesthetic, theme };
}
