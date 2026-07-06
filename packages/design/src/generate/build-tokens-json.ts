import packageJson from '../../package.json';
import { THEME_NAMES } from '../tokens/theme-name.js';
import { THEMES } from '../tokens/theme-registry.js';
import { themeToRecord } from '../tokens/theme-to-record.js';
import { TOKEN_GROUP_IDS, TOKEN_GROUPS } from '../tokens/groups.js';
import { TAILWIND_MAPPING } from '../tokens/tailwind-mapping.js';
import type { FontManifestEntry } from '../fonts/font-manifest.types.js';
import { buildFontSummary } from './build-font-summary.js';
import type { TokensJson } from './tokens-json.types.js';

/**
 * Builds the machine-readable `tokens.json` — every value a consumer might
 * want without parsing CSS: the two themes' tokens, the semantic group
 * membership, the Tailwind mapping, and a font family summary. Key order
 * follows source declaration order throughout, so re-running this is
 * byte-stable (the drift test regenerates and diffs against the committed
 * file).
 */
export function buildTokensJson(fontManifest: readonly FontManifestEntry[]): TokensJson {
  const themes = Object.fromEntries(
    THEME_NAMES.map((name) => [
      name,
      { selector: THEMES[name].selector, tokens: themeToRecord(THEMES[name]) },
    ]),
  ) as TokensJson['themes'];

  const groups = Object.fromEntries(
    TOKEN_GROUP_IDS.map((id) => [id, TOKEN_GROUPS[id]]),
  ) as TokensJson['groups'];

  const tailwindMapping = Object.fromEntries(
    TAILWIND_MAPPING.map((entry) => [entry.name, entry.value]),
  );

  return {
    version: packageJson.version,
    themes,
    groups,
    tailwindMapping,
    fonts: buildFontSummary(fontManifest),
  };
}
