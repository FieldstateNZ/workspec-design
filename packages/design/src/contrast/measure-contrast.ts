import type { TokenName } from '../tokens/token-names.js';
import { compositeOver } from './composite-over.js';
import { contrastRatio } from './contrast-ratio.js';
import { resolveTokenColor } from './resolve-token-color.js';

/**
 * Measures the WCAG contrast ratio between a text/UI role token and a
 * background role token within one theme. If the foreground token has
 * alpha (none of the tokens `pairs.ts` currently documents do, but the
 * token system has plenty of translucent tokens elsewhere — e.g.
 * `--accent-soft`), it is first composited over the resolved background
 * color, per WCAG guidance that contrast is only defined between opaque
 * colors.
 */
export function measureContrast(
  themeRecord: Readonly<Record<TokenName, string>>,
  textToken: TokenName,
  bgToken: TokenName,
): number {
  const background = resolveTokenColor(themeRecord, bgToken);
  const rawForeground = resolveTokenColor(themeRecord, textToken);
  const foreground =
    rawForeground.a === 1 ? rawForeground : compositeOver(rawForeground, background);

  return contrastRatio(foreground, background);
}
