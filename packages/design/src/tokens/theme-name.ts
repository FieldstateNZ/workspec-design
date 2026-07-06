/** The two themes this package ships. */
export const THEME_NAMES = ['console-dark', 'console-light'] as const;

/** One of the theme names in {@link THEME_NAMES}. */
export type ThemeName = (typeof THEME_NAMES)[number];
