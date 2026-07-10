import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { parseCssCustomProperties } from '../parse/parse-css-custom-properties.js';
import { buildThemeCss } from '../generate/build-theme-css.js';
import { CONSOLE_DARK_THEME } from './console-dark.js';
import { CONSOLE_LIGHT_THEME } from './console-light.js';
import { flattenTheme } from './flatten-theme.js';
import type { ThemeDefinition } from './theme-definition.types.js';

const vendored = (file: string): string =>
  readFileSync(fileURLToPath(new URL(`./source-of-record/${file}`, import.meta.url)), 'utf8');

const CASES: ReadonlyArray<{
  readonly label: string;
  readonly theme: ThemeDefinition;
  readonly file: string;
}> = [
  { label: 'console-dark', theme: CONSOLE_DARK_THEME, file: 'console-dark.css' },
  { label: 'console-light', theme: CONSOLE_LIGHT_THEME, file: 'console-light.css' },
];

// The extraction guarantee: everything downstream (generated CSS, tokens.json,
// the public TS API) is a projection of the TS token tables, and this is the
// one place those tables are checked against the actual enterprise source —
// a byte-exact vendored copy, parsed with the same small parser used
// everywhere else in this package (see ../parse/parse-css-custom-properties.ts).
describe('source-of-record fidelity', () => {
  it.each(CASES)(
    '$label: TS token table matches the vendored source 1:1 (names, values, order)',
    ({ theme, file }) => {
      const parsed = parseCssCustomProperties(vendored(file));
      const table = flattenTheme(theme);

      expect(table.map((entry) => entry.name)).toEqual(parsed.map((entry) => entry.name));
      expect(table.map((entry) => entry.value)).toEqual(parsed.map((entry) => entry.value));
    },
  );

  it.each(CASES)(
    '$label: generated theme CSS contains exactly the same declarations as the vendored source',
    ({ theme, file }) => {
      const parsedVendored = parseCssCustomProperties(vendored(file));
      const parsedGenerated = parseCssCustomProperties(buildThemeCss(theme));

      expect(parsedGenerated).toEqual(parsedVendored);
    },
  );

  it('both themes declare the same 138 names, in the same order', () => {
    const darkNames = flattenTheme(CONSOLE_DARK_THEME).map((entry) => entry.name);
    const lightNames = flattenTheme(CONSOLE_LIGHT_THEME).map((entry) => entry.name);

    expect(darkNames).toHaveLength(138);
    expect(darkNames).toEqual(lightNames);
  });
});
