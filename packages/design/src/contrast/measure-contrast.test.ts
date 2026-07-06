import { describe, expect, it } from 'vitest';
import type { TokenName } from '../tokens/token-names.js';
import { measureContrast } from './measure-contrast.js';
import { roundRatio } from './round-ratio.js';

const record = {
  '--bg': '#0a0a0c',
  '--ink': '#e8e8ea',
  '--translucent-fg': 'rgba(255,255,255,0.5)',
} as unknown as Readonly<Record<TokenName, string>>;

describe('measureContrast', () => {
  it('measures the ratio between two opaque tokens', () => {
    expect(measureContrast(record, '--ink' as TokenName, '--bg' as TokenName)).toBeCloseTo(
      16.17,
      1,
    );
  });

  it('composites a translucent foreground over the background before measuring', () => {
    // 50% white (255,255,255,0.5) over #0a0a0c (10,10,12) composites
    // per-channel as `255*0.5 + channel*0.5`: r=132.5, g=132.5, b=133.5 — a
    // mid-grey, not pure white. WCAG relative luminance of that mid-grey is
    // ~0.23292; the background's is ~0.00308. Contrast ratio is
    // (0.23292 + 0.05) / (0.00308 + 0.05) ~= 5.33 — well below white-on-
    // black's ~19.6:1, proving the composite step actually ran rather than
    // just asserting a loose bound.
    const ratio = measureContrast(record, '--translucent-fg' as TokenName, '--bg' as TokenName);
    expect(roundRatio(ratio)).toBe(5.33);
  });
});
