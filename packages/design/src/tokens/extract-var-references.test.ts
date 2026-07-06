import { describe, expect, it } from 'vitest';
import { extractVarReferences } from './extract-var-references.js';

describe('extractVarReferences', () => {
  it('returns an empty array for a value with no var() reference', () => {
    expect(extractVarReferences('#0a0a0c')).toEqual([]);
    expect(extractVarReferences('120ms')).toEqual([]);
  });

  it('extracts a single whole-value reference', () => {
    expect(extractVarReferences('var(--bg-elevated)')).toEqual(['--bg-elevated']);
  });

  it('extracts a reference embedded inside a larger value', () => {
    expect(extractVarReferences('color-mix(in oklab, var(--ink) 12%, transparent)')).toEqual([
      '--ink',
    ]);
  });

  it('extracts every reference when a value has more than one', () => {
    expect(extractVarReferences('0 0 0 1px var(--accent), 0 0 24px rgba(52,209,127,0.18)')).toEqual(
      ['--accent'],
    );
    expect(extractVarReferences('var(--a) var(--b), var(--c)')).toEqual(['--a', '--b', '--c']);
  });

  it('tolerates whitespace inside the parens', () => {
    expect(extractVarReferences('var(  --sans  )')).toEqual(['--sans']);
  });
});
