import type { TailwindMappingEntry } from '../tokens/tailwind-mapping.js';
import { buildGeneratedFileBanner } from './generated-file-banner.js';
import { renderCssComment } from './render-css-comment.js';

const INDENT = '  ';

/**
 * Emits `tailwind.css` — the Tailwind v4 CSS-first preset consumers import
 * alongside their own `@import "tailwindcss"`. Deliberately does NOT import
 * `"tailwindcss"` itself (that stays in the consumer's entry CSS, same as
 * every other Tailwind v4 preset); `tw-animate-css` and
 * `@tailwindcss/typography` are dependencies of this package so the
 * consumer's Tailwind build resolves them without installing them itself.
 */
export function buildTailwindCss(mapping: readonly TailwindMappingEntry[]): string {
  const banner = buildGeneratedFileBanner([
    'Source of truth: packages/design/src/tokens/tailwind-mapping.ts',
    'Extracted from workspec/artifacts/workspec/src/index.css on 2026-07-06',
    '(the `@theme inline` block, `@custom-variant dark`, and the typography',
    'plugin import — the app-level palettes elsewhere in that file are NOT',
    'extracted; see docs/inventory.md "Not-extracted").',
    '',
    'Does NOT `@import "tailwindcss"` — add that in your own entry CSS first:',
    '  @import "tailwindcss";',
    '  @import "@workspec/design/tailwind";',
  ]);

  const themeLine = "@import './tokens.css';";
  const dependencyLines = ["@import 'tw-animate-css';", '@plugin "@tailwindcss/typography";'];
  const customVariant = '@custom-variant dark (&:is(.dark *));';

  const themeBlock = ['@theme inline {'];
  mapping.forEach((entry, index) => {
    if (index > 0 && entry.comment) themeBlock.push('');
    if (entry.comment) themeBlock.push(renderCssComment(entry.comment, INDENT));
    themeBlock.push(`${INDENT}${entry.name}: ${entry.value};`);
  });
  themeBlock.push('}');

  return [
    banner,
    '',
    themeLine,
    ...dependencyLines,
    customVariant,
    '',
    themeBlock.join('\n'),
    '',
  ].join('\n');
}
