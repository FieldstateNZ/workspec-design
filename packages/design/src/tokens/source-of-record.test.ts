import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseCssCustomProperties } from '../parse/parse-css-custom-properties.js';
import type { ParsedCssCustomProperty } from '../parse/parse-css-custom-properties.js';
import { buildThemeCss } from '../generate/build-theme-css.js';
import { CONSOLE_DARK_THEME } from './console-dark.js';
import { CONSOLE_LIGHT_THEME } from './console-light.js';
import { flattenTheme } from './flatten-theme.js';
import type { ThemeDefinition } from './theme-definition.types.js';
import type { ThemeName } from './theme-name.js';
import { ADJUDICATED_DEVIATIONS } from './adjudicated-deviations.js';

const vendored = (file: string): string =>
  readFileSync(fileURLToPath(new URL(`./source-of-record/${file}`, import.meta.url)), 'utf8');

const CASES: ReadonlyArray<{
  readonly label: ThemeName;
  readonly theme: ThemeDefinition;
  readonly file: string;
}> = [
  { label: 'console-dark', theme: CONSOLE_DARK_THEME, file: 'console-dark.css' },
  { label: 'console-light', theme: CONSOLE_LIGHT_THEME, file: 'console-light.css' },
];

function deviationFor(theme: ThemeName, token: string) {
  return ADJUDICATED_DEVIATIONS.find((d) => d.theme === theme && d.token === token);
}

/**
 * What the TS table (or the CSS generated from it) *should* say at each
 * vendored declaration, given `adjudicated-deviations.ts`: the vendored
 * value everywhere, except a registered token/theme pair, which must equal
 * its `canonValue` — and whose vendored value must equal the registry's
 * `enterpriseValue`, proving the registry records honest history rather
 * than a fabricated one.
 */
function expectedGivenVendored(
  theme: ThemeName,
  vendoredEntries: readonly ParsedCssCustomProperty[],
): readonly ParsedCssCustomProperty[] {
  return vendoredEntries.map((entry) => {
    const deviation = deviationFor(theme, entry.name);
    if (!deviation) return entry;
    expect(
      entry.value,
      `adjudicated-deviations.ts's enterpriseValue for ${entry.name} (${theme}) must match ` +
        `the vendored source exactly — it is supposed to record honest history`,
    ).toBe(deviation.enterpriseValue);
    return { name: entry.name, value: deviation.canonValue };
  });
}

// The extraction guarantee: everything downstream (generated CSS, tokens.json,
// the public TS API) is a projection of the TS token tables, and this is the
// one place those tables are checked against the actual enterprise source —
// a byte-exact vendored copy, parsed with the same small parser used
// everywhere else in this package (see ../parse/parse-css-custom-properties.ts).
//
// Brett's 2026-07-07 WCAG AA contrast adjudication (docs/drift-log.md
// D33–D40) overrides this guarantee for exactly the tokens registered in
// `adjudicated-deviations.ts`: this package is now the value canon for
// those, and unadjudicated drift anywhere else still fails the gate below.
describe('source-of-record fidelity', () => {
  it.each(CASES)(
    '$label: TS token table matches the vendored source 1:1 (names, order, and every value not in adjudicated-deviations.ts)',
    ({ theme, file, label }) => {
      const parsedVendored = parseCssCustomProperties(vendored(file));
      const table = flattenTheme(theme);
      const expected = expectedGivenVendored(label, parsedVendored);

      expect(table.map((entry) => entry.name)).toEqual(expected.map((entry) => entry.name));
      expect(table.map((entry) => entry.value)).toEqual(expected.map((entry) => entry.value));
    },
  );

  it.each(CASES)(
    '$label: generated theme CSS contains exactly the vendored declarations, except adjudicated deviations',
    ({ theme, file, label }) => {
      const parsedVendored = parseCssCustomProperties(vendored(file));
      const parsedGenerated = parseCssCustomProperties(buildThemeCss(theme));
      const expected = expectedGivenVendored(label, parsedVendored);

      expect(parsedGenerated).toEqual(expected);
    },
  );

  it('both themes declare the same 124 names, in the same order', () => {
    const darkNames = flattenTheme(CONSOLE_DARK_THEME).map((entry) => entry.name);
    const lightNames = flattenTheme(CONSOLE_LIGHT_THEME).map((entry) => entry.name);

    expect(darkNames).toHaveLength(124);
    expect(darkNames).toEqual(lightNames);
  });

  it('every adjudicated-deviations.ts entry corresponds to a real token declared in both themes', () => {
    const darkNames = new Set(flattenTheme(CONSOLE_DARK_THEME).map((entry) => entry.name));
    const lightNames = new Set(flattenTheme(CONSOLE_LIGHT_THEME).map((entry) => entry.name));

    for (const deviation of ADJUDICATED_DEVIATIONS) {
      const names = deviation.theme === 'console-dark' ? darkNames : lightNames;
      expect(
        names.has(deviation.token),
        `adjudicated-deviations.ts references ${deviation.token} in ${deviation.theme}, which that theme does not declare`,
      ).toBe(true);
    }
  });
});
