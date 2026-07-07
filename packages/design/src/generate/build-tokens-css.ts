import { buildGeneratedFileBanner } from './generated-file-banner.js';

/**
 * Emits `tokens.css` — the package's entry point for the raw token custom
 * properties, mirroring the enterprise `styles/tokens/index.css`: it just
 * imports both theme files. Consumers who only want the CSS variables (no
 * Tailwind mapping) import this directly.
 */
export function buildTokensCss(): string {
  const banner = buildGeneratedFileBanner([
    'Source of truth: packages/design/src/generate/build-tokens-css.ts',
    'Mirrors workspec/artifacts/workspec/src/styles/tokens/index.css.',
  ]);

  return `${banner}\n\n@import './themes/console-dark.css';\n@import './themes/console-light.css';\n`;
}
