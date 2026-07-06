import type { FontManifestEntry } from '../fonts/font-manifest.types.js';
import { buildGeneratedFileBanner } from './generated-file-banner.js';

function renderFontFace(entry: FontManifestEntry): string {
  return [
    '@font-face {',
    `  font-family: '${entry.family}';`,
    `  font-style: ${entry.style};`,
    `  font-weight: ${entry.weight};`,
    '  font-display: swap;',
    `  src: url('./fonts/${entry.file}') format('woff2');`,
    `  unicode-range: ${entry.unicodeRange};`,
    '}',
  ].join('\n');
}

/**
 * Emits `fonts.css` — one `@font-face` per {@link FontManifestEntry}, in
 * manifest order. Self-hosts the four families the enterprise app currently
 * double-loads from the Google Fonts CDN (`docs/drift-log.md` D23); `src`
 * paths are relative to this file, which ships at the package root
 * alongside the `fonts/` directory the woff2s live in.
 */
export function buildFontsCss(manifest: readonly FontManifestEntry[]): string {
  const banner = buildGeneratedFileBanner([
    'Source of truth: packages/design/fonts/manifest.json',
    'Self-hosted replacement for the Google Fonts CDN <link>/@import the',
    'enterprise app loads today (twice — see docs/drift-log.md D23).',
    'Licenses: fonts/licenses/*-OFL.txt (SIL Open Font License 1.1). See NOTICE.',
  ]);

  const rules = manifest.map(renderFontFace);
  return `${banner}\n\n${rules.join('\n\n')}\n`;
}
