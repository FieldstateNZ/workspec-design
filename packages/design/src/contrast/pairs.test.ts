import { describe, expect, it } from 'vitest';
import { TOKEN_NAMES } from '../tokens/token-names.js';
import { CONTRAST_PAIRS, CONTRAST_CLASS_THRESHOLDS, pairLabel } from './pairs.js';

const DEFINED_TOKEN_NAMES = new Set<string>(TOKEN_NAMES);

describe('CONTRAST_PAIRS', () => {
  it('declares 59 pairs — the full role-pair table from workspec-design#3', () => {
    expect(CONTRAST_PAIRS).toHaveLength(59);
  });

  it('has no duplicate (textToken, bgToken) combinations', () => {
    const keys = CONTRAST_PAIRS.map((pair) => pairLabel(pair));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('references only tokens declared in TOKEN_NAMES', () => {
    for (const pair of CONTRAST_PAIRS) {
      expect(DEFINED_TOKEN_NAMES.has(pair.textToken), `unknown textToken ${pair.textToken}`).toBe(
        true,
      );
      expect(DEFINED_TOKEN_NAMES.has(pair.bgToken), `unknown bgToken ${pair.bgToken}`).toBe(true);
    }
  });

  it('every pair has a threshold defined for its class', () => {
    for (const pair of CONTRAST_PAIRS) {
      expect(CONTRAST_CLASS_THRESHOLDS[pair.class]).toBeGreaterThan(0);
    }
  });
});
