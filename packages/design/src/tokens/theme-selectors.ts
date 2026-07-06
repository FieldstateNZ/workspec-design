import type { ThemeName } from './theme-name.js';
import { THEMES } from './theme-registry.js';

/**
 * The `[data-aesthetic="console"][data-theme="dark|light"]` attribute
 * selector that activates each theme, keyed by {@link ThemeName}. A host
 * activates a theme by setting both attributes on `<html>` — see
 * `docs/inventory.md` "Themes" for the dual `data-theme` / `.dark` class
 * signal Tailwind's `dark:` variant also depends on.
 */
export const THEME_SELECTORS: Readonly<Record<ThemeName, string>> = {
  'console-dark': THEMES['console-dark'].selector,
  'console-light': THEMES['console-light'].selector,
};
