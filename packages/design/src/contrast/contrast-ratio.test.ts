import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast-ratio.js';

describe('contrastRatio', () => {
  it('is 21:1 for black on white, in either argument order', () => {
    const black = { r: 0, g: 0, b: 0 };
    const white = { r: 255, g: 255, b: 255 };
    expect(contrastRatio(black, white)).toBeCloseTo(21, 1);
    expect(contrastRatio(white, black)).toBeCloseTo(21, 1);
  });

  it('is 1:1 for identical colors', () => {
    const color = { r: 100, g: 150, b: 200 };
    expect(contrastRatio(color, color)).toBeCloseTo(1, 10);
  });

  it('matches the known console-dark --ink on --bg ratio', () => {
    // #e8e8ea on #0a0a0c — verified against a reference WCAG calculator.
    const ink = { r: 0xe8, g: 0xe8, b: 0xea };
    const bg = { r: 0x0a, g: 0x0a, b: 0x0c };
    expect(contrastRatio(ink, bg)).toBeCloseTo(16.17, 1);
  });
});
