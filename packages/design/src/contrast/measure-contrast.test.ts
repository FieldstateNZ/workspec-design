import { describe, expect, it } from 'vitest';
import type { TokenName } from '../tokens/token-names.js';
import { measureContrast } from './measure-contrast.js';

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
    // 50% white over #0a0a0c composites to a mid-grey, not pure white —
    // the ratio must be lower than white-on-black's ~19.6:1.
    const ratio = measureContrast(record, '--translucent-fg' as TokenName, '--bg' as TokenName);
    expect(ratio).toBeLessThan(19.6);
    expect(ratio).toBeGreaterThan(1);
  });
});
