import { describe, expect, it } from 'vitest';
import { parseCssCustomProperties } from './parse-css-custom-properties.js';

describe('parseCssCustomProperties', () => {
  it('extracts name/value pairs in document order', () => {
    const css = `
      [data-theme="dark"] {
        --bg: #0a0a0c;
        --line: #26262c;
      }
    `;
    expect(parseCssCustomProperties(css)).toEqual([
      { name: '--bg', value: '#0a0a0c' },
      { name: '--line', value: '#26262c' },
    ]);
  });

  it('ignores declarations inside comments', () => {
    const css = `
      [data-theme="dark"] {
        /* --commented-out: #000000; */
        --bg: #0a0a0c;
      }
    `;
    expect(parseCssCustomProperties(css)).toEqual([{ name: '--bg', value: '#0a0a0c' }]);
  });

  it('handles multiple declarations on one line', () => {
    const css = '--s-1:4px; --s-2:8px; --s-3:12px;';
    expect(parseCssCustomProperties(css)).toEqual([
      { name: '--s-1', value: '4px' },
      { name: '--s-2', value: '8px' },
      { name: '--s-3', value: '12px' },
    ]);
  });

  it('handles values with nested parens and commas', () => {
    const css =
      '--sticky-tag-fill: color-mix(in oklab, var(--ink) 12%, transparent); --sh-glow:0 0 0 1px var(--accent), 0 0 24px rgba(52,209,127,0.18);';
    expect(parseCssCustomProperties(css)).toEqual([
      { name: '--sticky-tag-fill', value: 'color-mix(in oklab, var(--ink) 12%, transparent)' },
      { name: '--sh-glow', value: '0 0 0 1px var(--accent), 0 0 24px rgba(52,209,127,0.18)' },
    ]);
  });

  it('returns an empty array when there are no declarations', () => {
    expect(parseCssCustomProperties('body { color: red; }')).toEqual([]);
  });
});
