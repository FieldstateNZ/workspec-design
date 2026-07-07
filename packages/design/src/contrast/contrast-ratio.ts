import type { RgbColor } from './color.types.js';
import { relativeLuminance } from './relative-luminance.js';

/**
 * WCAG 2.x contrast ratio between two opaque colors: `1` (identical
 * luminance) to `21` (black on white). Argument order doesn't matter — the
 * lighter luminance always goes in the numerator, per the spec formula.
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function contrastRatio(a: RgbColor, b: RgbColor): number {
  const lighter = Math.max(relativeLuminance(a), relativeLuminance(b));
  const darker = Math.min(relativeLuminance(a), relativeLuminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}
