/** One `--name: value;` custom-property declaration found in a CSS source. */
export interface ParsedCssCustomProperty {
  readonly name: string;
  readonly value: string;
}

const CUSTOM_PROPERTY_PATTERN = /(--[a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;

/**
 * Extracts every custom-property declaration from a CSS source, in document
 * order, wherever it appears (this repo's token files only ever declare
 * custom properties inside rule bodies, so scanning the whole text is
 * safe). Comments are stripped first so a commented-out declaration is never
 * mistaken for a live one. Used to check the vendored
 * `src/tokens/source-of-record/*.css` files against the TS token tables,
 * and the generated artifacts against both.
 */
export function parseCssCustomProperties(cssText: string): readonly ParsedCssCustomProperty[] {
  const withoutComments = cssText.replace(/\/\*[\s\S]*?\*\//g, '');
  const results: ParsedCssCustomProperty[] = [];
  for (const match of withoutComments.matchAll(CUSTOM_PROPERTY_PATTERN)) {
    const [, name, rawValue] = match;
    if (!name || rawValue === undefined) continue;
    results.push({ name, value: rawValue.trim() });
  }
  return results;
}
