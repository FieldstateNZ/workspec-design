/**
 * Banner comment `components.css` opens with. Mirrors the convention in
 * generated-file-banner.ts (used by the deterministic token/theme artifacts)
 * but points at this artifact's own regenerate command and states the
 * consumer contract explicitly: a real Tailwind v4 build should use the
 * preset instead of importing this file.
 */
export function buildComponentsCssBanner(): string {
  return [
    '/*',
    ' * GENERATED FILE — do not edit by hand.',
    ' * Regenerate with: pnpm --filter @workspec/design run build:components-css',
    ' *',
    ' * Compiled via @tailwindcss/cli from src/generate/components-entry.css:',
    ' * the Tailwind v4 theme + utilities layers (no preflight) plus this',
    " * package's own tailwind.css preset (the `@theme inline` token mapping),",
    ' * scanned with `@source` against src/components for the utility classes',
    ' * the migrated ui/ + design/ components actually use.',
    ' *',
    ' * FOR CONSUMERS RUNNING THEIR OWN TAILWIND v4 BUILD: do not import this',
    ' * file. Use the preset instead —',
    ' *   @import "tailwindcss";',
    ' *   @import "@workspec/design/tailwind";',
    ' * — and point your own `@source` at this package so your build scans',
    ' * it too (Tailwind v4 does not scan node_modules by default):',
    ' *   @source "../node_modules/@workspec/design";',
    ' * Importing components.css as well would ship a second, separately',
    ' * scanned copy of the same utilities under a different cascade layer.',
    ' *',
    ' * FOR CONSUMERS WITHOUT A TAILWIND BUILD: this file is a self-contained',
    ' * drop-in for styling the migrated components — pair it with',
    ' * tokens.css (or themes/*.css) for the `var(--*)` values these',
    ' * utilities read, and design-shell.css for the design/* stylesheet,',
    ' * which this does not include.',
    ' */',
  ].join('\n');
}
