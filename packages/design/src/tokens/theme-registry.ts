import type { ThemeName } from './theme-name.js';
import type { ThemeDefinition } from './theme-definition.types.js';
import { CONSOLE_DARK_THEME } from './console-dark.js';
import { CONSOLE_LIGHT_THEME } from './console-light.js';

/** Every theme this package ships, keyed by {@link ThemeName}. */
export const THEMES: Readonly<Record<ThemeName, ThemeDefinition>> = {
  'console-dark': CONSOLE_DARK_THEME,
  'console-light': CONSOLE_LIGHT_THEME,
};
