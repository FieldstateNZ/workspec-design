import type { ThemeName } from './tokens/theme-name.js';
import { THEMES } from './tokens/theme-registry.js';
import { themeToRecord } from './tokens/theme-to-record.js';

/**
 * A theme's tokens as a plain, mutable object suitable for a React inline
 * `style` prop, e.g. `<div style={themeStyle('console-dark') as
 * React.CSSProperties}>`. An alternative to the
 * `[data-aesthetic][data-theme]` attribute selectors for hosts that need to
 * scope a theme to a subtree rather than `<html>` — this is how Decision
 * Studio's migration (workspec-decision-studio#8) applies the theme without
 * depending on a global attribute.
 */
export function themeStyle(theme: ThemeName): Record<string, string> {
  return { ...themeToRecord(THEMES[theme]) };
}
