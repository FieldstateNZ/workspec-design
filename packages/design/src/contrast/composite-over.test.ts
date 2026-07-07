import { describe, expect, it } from 'vitest';
import { compositeOver } from './composite-over.js';

describe('compositeOver', () => {
  it('returns the background untouched when foreground alpha is 0', () => {
    const bg = { r: 10, g: 20, b: 30 };
    expect(compositeOver({ r: 255, g: 0, b: 0, a: 0 }, bg)).toEqual(bg);
  });

  it('returns the foreground color when alpha is 1', () => {
    const bg = { r: 10, g: 20, b: 30 };
    expect(compositeOver({ r: 200, g: 100, b: 50, a: 1 }, bg)).toEqual({ r: 200, g: 100, b: 50 });
  });

  it('blends proportionally to alpha', () => {
    const result = compositeOver({ r: 100, g: 100, b: 100, a: 0.5 }, { r: 0, g: 0, b: 0 });
    expect(result).toEqual({ r: 50, g: 50, b: 50 });
  });
});
