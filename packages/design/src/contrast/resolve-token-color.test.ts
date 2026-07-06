import { describe, expect, it } from 'vitest';
import type { TokenName } from '../tokens/token-names.js';
import { resolveTokenColor } from './resolve-token-color.js';

// A minimal synthetic record — enough TokenNames to exercise alias chains
// and failure modes without depending on the real 124-entry theme tables.
const record = {
  '--bg': '#0a0a0c',
  '--bg-elevated': '#1c1c22',
  '--bg-elev': 'var(--bg-elevated)',
  '--double-alias': 'var(--bg-elev)',
  '--cycle-a': 'var(--cycle-b)',
  '--cycle-b': 'var(--cycle-a)',
  '--not-a-color': 'cubic-bezier(0.2, 0.7, 0.3, 1)',
} as unknown as Readonly<Record<TokenName, string>>;

describe('resolveTokenColor', () => {
  it('resolves a literal color directly', () => {
    expect(resolveTokenColor(record, '--bg' as TokenName)).toEqual({ r: 10, g: 10, b: 12, a: 1 });
  });

  it('follows a single-hop var() alias', () => {
    expect(resolveTokenColor(record, '--bg-elev' as TokenName)).toEqual({
      r: 28,
      g: 28,
      b: 34,
      a: 1,
    });
  });

  it('follows a multi-hop alias chain', () => {
    expect(resolveTokenColor(record, '--double-alias' as TokenName)).toEqual({
      r: 28,
      g: 28,
      b: 34,
      a: 1,
    });
  });

  it('throws on an undefined token', () => {
    expect(() => resolveTokenColor(record, '--missing' as TokenName)).toThrow(/not bound/);
  });

  it('throws on a circular alias chain', () => {
    expect(() => resolveTokenColor(record, '--cycle-a' as TokenName)).toThrow(/circular/);
  });

  it('throws when the resolved literal is not a color', () => {
    expect(() => resolveTokenColor(record, '--not-a-color' as TokenName)).toThrow(
      /not a color literal/,
    );
  });
});
