// Regenerates every committed artifact this package ships from its TS/JSON
// sources of truth (src/tokens/, fonts/manifest.json). Run after editing a
// token table:
//
//   pnpm --filter @workspec/design gen:tokens   (or: pnpm gen:tokens)
//
// The drift tests in src/**/*.test.ts regenerate the same artifacts in
// memory and fail CI if they differ from what's committed here.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { THEME_NAMES } from '../src/tokens/theme-name.js';
import { THEMES } from '../src/tokens/theme-registry.js';
import { TAILWIND_MAPPING } from '../src/tokens/tailwind-mapping.js';
import { FONT_MANIFEST } from '../src/fonts/font-manifest.js';
import { buildThemeCss } from '../src/generate/build-theme-css.js';
import { buildTokensCss } from '../src/generate/build-tokens-css.js';
import { buildTailwindCss } from '../src/generate/build-tailwind-css.js';
import { buildTokensJson } from '../src/generate/build-tokens-json.js';
import { serializeTokensJson } from '../src/generate/serialize-tokens-json.js';
import { buildFontsCss } from '../src/generate/build-fonts-css.js';

// scripts/ -> package root
const root = fileURLToPath(new URL('..', import.meta.url));

function write(relativePath: string, contents: string): void {
  writeFileSync(join(root, relativePath), contents, 'utf8');
  console.log(`wrote ${relativePath}`);
}

mkdirSync(join(root, 'themes'), { recursive: true });

for (const name of THEME_NAMES) {
  write(`themes/${name}.css`, buildThemeCss(THEMES[name]));
}

write('tokens.css', buildTokensCss());
write('tailwind.css', buildTailwindCss(TAILWIND_MAPPING));
write('tokens.json', serializeTokensJson(buildTokensJson(FONT_MANIFEST)));
write('fonts.css', buildFontsCss(FONT_MANIFEST));
