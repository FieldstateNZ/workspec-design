import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { THEME_NAMES } from '../tokens/theme-name.js';
import { THEMES } from '../tokens/theme-registry.js';
import { TAILWIND_MAPPING } from '../tokens/tailwind-mapping.js';
import { FONT_MANIFEST } from '../fonts/font-manifest.js';
import { buildThemeCss } from './build-theme-css.js';
import { buildTokensCss } from './build-tokens-css.js';
import { buildTailwindCss } from './build-tailwind-css.js';
import { buildTokensJson } from './build-tokens-json.js';
import { serializeTokensJson } from './serialize-tokens-json.js';
import { buildFontsCss } from './build-fonts-css.js';

// src/generate/ -> src/ -> <package root>/
const committed = (relativePath: string): string =>
  readFileSync(fileURLToPath(new URL(`../../${relativePath}`, import.meta.url)), 'utf8');

const FAILURE_HINT = 'run `pnpm gen:tokens` to regenerate committed artifacts';

describe('generated artifacts are up to date', () => {
  it.each(THEME_NAMES)('themes/%s.css matches its source of truth', (name) => {
    expect(buildThemeCss(THEMES[name]), FAILURE_HINT).toBe(committed(`themes/${name}.css`));
  });

  it('tokens.css matches its source of truth', () => {
    expect(buildTokensCss(), FAILURE_HINT).toBe(committed('tokens.css'));
  });

  it('tailwind.css matches its source of truth', () => {
    expect(buildTailwindCss(TAILWIND_MAPPING), FAILURE_HINT).toBe(committed('tailwind.css'));
  });

  it('tokens.json matches its source of truth', () => {
    const rebuilt = serializeTokensJson(buildTokensJson(FONT_MANIFEST));
    expect(rebuilt, FAILURE_HINT).toBe(committed('tokens.json'));
  });

  it('fonts.css matches its source of truth', () => {
    expect(buildFontsCss(FONT_MANIFEST), FAILURE_HINT).toBe(committed('fonts.css'));
  });
});
