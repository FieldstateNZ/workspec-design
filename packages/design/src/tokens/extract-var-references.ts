const VAR_REFERENCE_PATTERN = /var\(\s*(--[a-zA-Z0-9-]+)/g;

/**
 * Every `var(--x)` custom-property reference embedded anywhere in a token
 * value, in appearance order. A value can reference more than one other
 * token — e.g. `--sh-glow: 0 0 0 1px var(--accent), 0 0 24px
 * rgba(52,209,127,0.18)` references `--accent` once inside a larger,
 * non-color string. This is a plain text scan, not a color parse: it's what
 * the theme-completeness gate (`theme-completeness.test.ts`) uses to prove
 * every reference resolves to a token defined in the same theme, regardless
 * of what kind of value the reference lives inside.
 */
export function extractVarReferences(value: string): string[] {
  const references: string[] = [];
  for (const match of value.matchAll(VAR_REFERENCE_PATTERN)) {
    const name = match[1];
    if (name !== undefined) references.push(name);
  }
  return references;
}
