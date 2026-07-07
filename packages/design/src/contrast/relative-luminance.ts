import type { RgbColor } from './color.types.js';

/** Converts one 8-bit sRGB channel to its linear-light value, per the WCAG relative-luminance formula. */
function linearizeChannel(channel8Bit: number): number {
  const c = channel8Bit / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/**
 * WCAG 2.x relative luminance of an opaque color: 0 for black, 1 for white.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance — the basis for the
 * contrast-ratio formula in `contrast-ratio.ts`.
 */
export function relativeLuminance(color: RgbColor): number {
  return (
    0.2126 * linearizeChannel(color.r) +
    0.7152 * linearizeChannel(color.g) +
    0.0722 * linearizeChannel(color.b)
  );
}
