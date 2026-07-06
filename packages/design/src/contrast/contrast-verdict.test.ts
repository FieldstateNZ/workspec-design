import { describe, expect, it } from 'vitest';
import { contrastVerdict } from './contrast-verdict.js';

describe('contrastVerdict', () => {
  it('passes when the ratio clears the threshold', () => {
    expect(contrastVerdict(5, 4.5)).toBe(true);
  });

  it('fails when the ratio falls short of the threshold', () => {
    expect(contrastVerdict(4, 4.5)).toBe(false);
  });

  it('passes when the ratio exactly equals the threshold', () => {
    expect(contrastVerdict(4.5, 4.5)).toBe(true);
  });

  it('rounds the ratio before comparing, so a value that rounds up to the threshold passes', () => {
    // 4.4996 displays as "4.50:1" (roundRatio) — it must read as a pass,
    // matching what the allowlist and the audit report would show, even
    // though the raw ratio is fractionally under 4.5.
    expect(contrastVerdict(4.4996, 4.5)).toBe(true);
  });

  it('rounds the ratio before comparing, so a value that rounds down stays a fail', () => {
    // 4.494 displays as "4.49:1" — below threshold both raw and rounded.
    expect(contrastVerdict(4.494, 4.5)).toBe(false);
  });
});
