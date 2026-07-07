import type { RgbColor, RgbaColor } from './color.types.js';

/**
 * Alpha-composites `foreground` over an opaque `background` using the
 * standard "over" operator. Needed because WCAG contrast is only defined
 * between two opaque colors, and a handful of tokens in this system are
 * translucent (e.g. status washes). `background` is assumed fully opaque —
 * true of every background-role token this package documents contrast pairs
 * against (see `pairs.ts`).
 */
export function compositeOver(foreground: RgbaColor, background: RgbColor): RgbColor {
  const { r, g, b, a } = foreground;
  return {
    r: r * a + background.r * (1 - a),
    g: g * a + background.g * (1 - a),
    b: b * a + background.b * (1 - a),
  };
}
