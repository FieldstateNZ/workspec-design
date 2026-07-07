import manifest from '../../fonts/manifest.json';
import type { FontManifestEntry } from './font-manifest.types.js';

/**
 * The self-hosted font manifest vendored at `fonts/manifest.json` — 22 woff2
 * files across Inter Tight, JetBrains Mono, Caveat, and Lora (latin +
 * latin-ext only; see `docs/inventory.md`). `build-fonts-css.ts` is the only
 * other module that reads this; tests read it to assert `fonts.css` and the
 * `fonts/licenses/*-OFL.txt` files stay in sync with it.
 */
export const FONT_MANIFEST: readonly FontManifestEntry[] = manifest;
