import { describe, expect, it } from 'vitest';
import { parseColor } from './parse-color.js';

describe('parseColor', () => {
  it('parses #rrggbb hex literals as opaque', () => {
    expect(parseColor('#0a0a0c')).toEqual({ r: 10, g: 10, b: 12, a: 1 });
    expect(parseColor('#ffffff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
  });

  it('parses rgba() literals, including alpha written without a leading zero', () => {
    expect(parseColor('rgba(52,209,127,0.14)')).toEqual({ r: 52, g: 209, b: 127, a: 0.14 });
    expect(parseColor('rgba(27,138,85,.12)')).toEqual({ r: 27, g: 138, b: 85, a: 0.12 });
  });

  it('parses a bare rgb() as fully opaque', () => {
    expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30, a: 1 });
  });

  it('tolerates surrounding whitespace', () => {
    expect(parseColor('  #0a0a0c  ')).toEqual({ r: 10, g: 10, b: 12, a: 1 });
  });

  it('returns undefined for non-color token values', () => {
    expect(parseColor('var(--bg-elevated)')).toBeUndefined();
    expect(parseColor('color-mix(in oklab, var(--ink) 12%, transparent)')).toBeUndefined();
    expect(parseColor('cubic-bezier(0.2, 0.7, 0.3, 1)')).toBeUndefined();
    expect(parseColor('120ms')).toBeUndefined();
    expect(parseColor('none')).toBeUndefined();
  });
});
