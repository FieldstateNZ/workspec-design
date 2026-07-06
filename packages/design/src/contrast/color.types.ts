/** An opaque sRGB color, 8-bit channels (0–255). */
export interface RgbColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/** An sRGB color with an alpha channel (0 = fully transparent, 1 = opaque). */
export interface RgbaColor extends RgbColor {
  readonly a: number;
}
