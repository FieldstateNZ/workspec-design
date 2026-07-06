import { describe, expect, it } from 'vitest';
import { THEME_NAMES } from '../tokens/theme-name.js';
import { THEMES } from '../tokens/theme-registry.js';
import { themeToRecord } from '../tokens/theme-to-record.js';
import { CONTRAST_PAIRS } from './pairs.js';
import { CONTRAST_CLASS_THRESHOLDS } from './contrast-class-thresholds.js';
import { pairLabel } from './pair-label.js';
import { KNOWN_CONTRAST_FAILURES } from './known-failures.js';
import { measureContrast } from './measure-contrast.js';
import { roundRatio } from './round-ratio.js';
import { contrastVerdict } from './contrast-verdict.js';

/**
 * WCAG AA contrast gate (workspec-design#3, DELIVERY_PLAN.md decision 8).
 * Every documented pair is measured against both themes. A pair fails this
 * gate only if its ratio is below its class threshold AND it is not a
 * documented entry in `known-failures.ts` — new regressions break CI, and
 * existing failures only leave the allowlist when Brett adjudicates the
 * drift-log entry and either the value changes or the pair/class is
 * revised. An allowlisted pair that starts passing also breaks this gate:
 * the allowlist records reality, so it can only shrink, never grow stale.
 *
 * Pass/fail is decided by `contrastVerdict` (shared with
 * `build-audit-report.ts`), not a raw `ratio >= threshold` comparison here —
 * see that module's TSDoc for why the comparison rounds both operands.
 */
describe('WCAG AA contrast gate', () => {
  for (const themeName of THEME_NAMES) {
    describe(themeName, () => {
      it.each(CONTRAST_PAIRS)(
        '$textToken on $bgToken meets its class threshold, or is a documented known failure',
        (pair) => {
          const record = themeToRecord(THEMES[themeName]);
          const ratio = measureContrast(record, pair.textToken, pair.bgToken);
          const threshold = CONTRAST_CLASS_THRESHOLDS[pair.class];
          const allowlisted = KNOWN_CONTRAST_FAILURES.find(
            (entry) =>
              entry.textToken === pair.textToken &&
              entry.bgToken === pair.bgToken &&
              entry.theme === themeName,
          );

          if (!contrastVerdict(ratio, threshold)) {
            expect(
              allowlisted,
              `${pairLabel(pair)} in ${themeName} measures ${roundRatio(ratio)}:1, below the ` +
                `${pair.class} threshold of ${threshold}:1, and is not in known-failures.ts. ` +
                `Either this is a new regression (fix it) or a genuine spec weakness that needs ` +
                `a known-failures entry + a docs/drift-log.md entry for Brett.`,
            ).toBeDefined();
            if (allowlisted) {
              expect(
                roundRatio(ratio),
                `known-failures.ts records ${allowlisted.measuredRatio}:1 for ${pairLabel(pair)} ` +
                  `in ${themeName}, but it now measures ${roundRatio(ratio)}:1 — update the entry ` +
                  `(and the linked drift-log row) to match reality`,
              ).toBe(allowlisted.measuredRatio);
            }
          } else {
            expect(
              allowlisted,
              `${pairLabel(pair)} in ${themeName} now measures ${roundRatio(ratio)}:1, meeting its ` +
                `${threshold}:1 threshold — remove the stale known-failures.ts entry (and update ` +
                `the linked drift-log row)`,
            ).toBeUndefined();
          }
        },
      );
    });
  }
});

describe('known-failures allowlist hygiene', () => {
  it('every allowlist entry matches a pair actually declared in pairs.ts', () => {
    for (const failure of KNOWN_CONTRAST_FAILURES) {
      const declared = CONTRAST_PAIRS.some(
        (pair) => pair.textToken === failure.textToken && pair.bgToken === failure.bgToken,
      );
      expect(
        declared,
        `known-failures.ts references ${failure.textToken} on ${failure.bgToken}, which pairs.ts does not declare`,
      ).toBe(true);
    }
  });

  it('has no duplicate (pair, theme) entries', () => {
    const keys = KNOWN_CONTRAST_FAILURES.map((f) => `${f.textToken}|${f.bgToken}|${f.theme}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
