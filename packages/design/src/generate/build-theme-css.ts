import type { TokenBlock, ThemeDefinition } from '../tokens/theme-definition.types.js';
import { buildGeneratedFileBanner } from './generated-file-banner.js';
import { renderCssComment } from './render-css-comment.js';

const TOKEN_INDENT = '  ';

function renderBlock(block: TokenBlock, selector: string): string {
  const lines = [`${selector} {`];
  block.sections.forEach((section, index) => {
    if (index > 0) lines.push('');
    if (section.comment) lines.push(renderCssComment(section.comment, TOKEN_INDENT));
    for (const token of section.tokens) {
      lines.push(`${TOKEN_INDENT}${token.name}: ${token.value};`);
    }
  });
  lines.push('}');
  return lines.join('\n');
}

/**
 * Emits one theme's `themes/console-{dark,light}.css` — the same selector,
 * the same three-rule split, the same section comments and declaration
 * order as the enterprise source, reproduced from {@link ThemeDefinition}
 * rather than hand-copied. See `docs/inventory.md` for why the split exists.
 */
export function buildThemeCss(theme: ThemeDefinition): string {
  const banner = buildGeneratedFileBanner([
    `Source of truth: packages/design/src/tokens/${theme.name}.ts`,
    'Extracted from workspec/artifacts/workspec/src/styles/tokens/' +
      `${theme.name}.css on 2026-07-06.`,
  ]);

  const parts = [
    banner,
    '',
    `/* ${theme.titleComment} */`,
    renderBlock(theme.blocks[0], theme.selector),
  ];

  theme.blocks.slice(1).forEach((block) => {
    parts.push('');
    if (block.precedingComment) parts.push(renderCssComment(block.precedingComment, ''));
    parts.push(renderBlock(block, theme.selector));
  });

  if (theme.trailingComment) {
    parts.push('');
    parts.push(renderCssComment(theme.trailingComment, ''));
  }

  return `${parts.join('\n')}\n`;
}
