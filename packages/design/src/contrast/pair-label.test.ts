import { describe, expect, it } from 'vitest';
import type { TokenName } from '../tokens/token-names.js';
import { pairLabel } from './pair-label.js';
import type { ContrastPair } from './pairs.types.js';

describe('pairLabel', () => {
  it('formats "textToken on bgToken"', () => {
    const pair: ContrastPair = {
      textToken: '--ink-muted' as TokenName,
      bgToken: '--bg' as TokenName,
      class: 'normal-text',
    };
    expect(pairLabel(pair)).toBe('--ink-muted on --bg');
  });
});
