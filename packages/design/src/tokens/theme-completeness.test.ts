import { describe, expect, it } from 'vitest';
import { THEME_NAMES } from './theme-name.js';
import { THEMES } from './theme-registry.js';
import { TOKEN_NAMES } from './token-names.js';
import { flattenTheme } from './flatten-theme.js';
import { extractVarReferences } from './extract-var-references.js';

/**
 * The unbound-variable gate (workspec-design#3): a consumer who only ever
 * reads documented `TokenName`s must never be able to hit an unbound CSS
 * custom property, in either theme. Three properties together are the
 * proof: every token is declared with a non-empty value, every `var(--x)`
 * reference inside a value resolves inside the *same* theme (no
 * cross-theme or dangling references), and both themes declare the
 * identical name set (no theme-only token a consumer could accidentally
 * depend on).
 */
describe('theme completeness (unbound-variable gate)', () => {
  it.each(THEME_NAMES)('%s binds every documented TokenName to a non-empty value', (name) => {
    const record = new Map(flattenTheme(THEMES[name]).map((entry) => [entry.name, entry.value]));

    for (const tokenName of TOKEN_NAMES) {
      expect(record.has(tokenName), `${tokenName} is not declared in ${name}`).toBe(true);
      const value = record.get(tokenName);
      expect(
        value?.trim().length ?? 0,
        `${tokenName} in ${name} is bound to an empty value`,
      ).toBeGreaterThan(0);
    }
  });

  it.each(THEME_NAMES)(
    '%s: every var() reference resolves to a token in the same theme',
    (name) => {
      const entries = flattenTheme(THEMES[name]);
      const definedNames = new Set<string>(entries.map((entry) => entry.name));

      for (const entry of entries) {
        for (const reference of extractVarReferences(entry.value)) {
          expect(
            definedNames.has(reference),
            `${name}'s ${entry.name} references var(${reference}), which ${name} does not define`,
          ).toBe(true);
        }
      }
    },
  );

  it('both themes bind the identical TokenName set — no theme-only tokens', () => {
    const darkNames = flattenTheme(THEMES['console-dark']).map((entry) => entry.name);
    const lightNames = flattenTheme(THEMES['console-light']).map((entry) => entry.name);

    expect(new Set(darkNames)).toEqual(new Set(TOKEN_NAMES));
    expect(new Set(lightNames)).toEqual(new Set(TOKEN_NAMES));
    expect([...darkNames].sort()).toEqual([...lightNames].sort());
  });
});
