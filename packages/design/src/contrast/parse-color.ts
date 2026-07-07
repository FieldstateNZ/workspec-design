import type { RgbaColor } from './color.types.js';

const HEX_COLOR = /^#([0-9a-fA-F]{6})$/;

/** `#rrggbb` — the only hex form used anywhere in `console-{dark,light}.ts` (verified against every value in both tables). */
function parseHexLiteral(value: string): RgbaColor | undefined {
  const match = HEX_COLOR.exec(value);
  const hex = match?.[1];
  if (hex === undefined) return undefined;
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
    a: 1,
  };
}

const RGB_OR_RGBA_COLOR =
  /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)$/;

/**
 * `rgb(r,g,b)` / `rgba(r,g,b,a)` — the other color literal format present in
 * the token tables (e.g. `--accent-soft: rgba(52,209,127,0.14)`). Alpha
 * defaults to 1 when the value is a bare `rgb()`; an alpha written without a
 * leading zero (`.12`, as in `--wf-hifi-primary-soft`) is valid CSS and
 * `Number()` parses it correctly.
 */
function parseRgbaLiteral(value: string): RgbaColor | undefined {
  const match = RGB_OR_RGBA_COLOR.exec(value);
  if (!match) return undefined;
  const [, r, g, b, a] = match;
  if (r === undefined || g === undefined || b === undefined) return undefined;
  return { r: Number(r), g: Number(g), b: Number(b), a: a === undefined ? 1 : Number(a) };
}

/**
 * Parses a token value into an `RgbaColor` if it is one of the two color
 * literal formats this package's token tables use (`#rrggbb` or
 * `rgb()`/`rgba()`; opaque hex colors get `a: 1`). Returns `undefined` for
 * anything else — a `var()` reference, `color-mix()`, or a non-color value
 * (a length, an easing curve, a font stack) — so callers can distinguish
 * "not a color" from "malformed color" and react accordingly (see
 * `resolveTokenColor`, which follows `var()` chains before calling this).
 */
export function parseColor(value: string): RgbaColor | undefined {
  const trimmed = value.trim();
  return parseHexLiteral(trimmed) ?? parseRgbaLiteral(trimmed);
}
