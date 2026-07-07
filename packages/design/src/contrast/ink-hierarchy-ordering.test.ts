import { describe, expect, it } from 'vitest';
import { THEME_NAMES } from '../tokens/theme-name.js';
import { THEMES } from '../tokens/theme-registry.js';
import { themeToRecord } from '../tokens/theme-to-record.js';
import { measureContrast } from './measure-contrast.js';

/**
 * Guards the ink scale's visual hierarchy forever, independent of the WCAG
 * AA gate in `contrast-gate.test.ts`: each step must read as strictly less
 * prominent than the one before it against `--bg` — the one surface every
 * ink role is guaranteed to sit on. Brett's 2026-07-07 contrast-defect
 * correction (docs/drift-log.md D33–D40) compressed `--ink-muted` and
 * `--ink-fade` toward the same 4.5:1 floor in both themes; both clearing
 * AA is not enough on its own — this test is what stops a future value
 * tweak from silently collapsing or inverting the hierarchy while every
 * pair still passes its class threshold.
 */
describe('ink hierarchy contrast ordering', () => {
  for (const themeName of THEME_NAMES) {
    it(`${themeName}: contrast(--ink) > contrast(--ink-soft) > contrast(--ink-muted) > contrast(--ink-fade) > contrast(--ink-ghost) against --bg`, () => {
      const record = themeToRecord(THEMES[themeName]);
      const ink = measureContrast(record, '--ink', '--bg');
      const inkSoft = measureContrast(record, '--ink-soft', '--bg');
      const inkMuted = measureContrast(record, '--ink-muted', '--bg');
      const inkFade = measureContrast(record, '--ink-fade', '--bg');
      const inkGhost = measureContrast(record, '--ink-ghost', '--bg');

      expect(
        ink,
        `--ink (${ink.toFixed(4)}:1) must beat --ink-soft (${inkSoft.toFixed(4)}:1)`,
      ).toBeGreaterThan(inkSoft);
      expect(
        inkSoft,
        `--ink-soft (${inkSoft.toFixed(4)}:1) must beat --ink-muted (${inkMuted.toFixed(4)}:1)`,
      ).toBeGreaterThan(inkMuted);
      expect(
        inkMuted,
        `--ink-muted (${inkMuted.toFixed(4)}:1) must beat --ink-fade (${inkFade.toFixed(4)}:1)`,
      ).toBeGreaterThan(inkFade);
      expect(
        inkFade,
        `--ink-fade (${inkFade.toFixed(4)}:1) must beat --ink-ghost (${inkGhost.toFixed(4)}:1)`,
      ).toBeGreaterThan(inkGhost);
    });
  }
});
