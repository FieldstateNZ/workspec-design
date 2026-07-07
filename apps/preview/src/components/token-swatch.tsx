import type { TokenKind } from '../token-kind';
import { ColorSwatch } from './color-swatch';
import { ElevationSwatch } from './elevation-swatch';
import { MotionSwatch } from './motion-swatch';
import { RadiusSwatch } from './radius-swatch';
import { SpacingSwatch } from './spacing-swatch';
import { TypographySwatch } from './typography-swatch';

interface TokenSwatchProps {
  readonly token: string;
  readonly value: string;
  readonly kind: TokenKind;
}

const SWATCH_BY_KIND: Readonly<
  Record<TokenKind, (props: { readonly token: string; readonly value: string }) => JSX.Element>
> = {
  color: ColorSwatch,
  typography: TypographySwatch,
  spacing: SpacingSwatch,
  radius: RadiusSwatch,
  elevation: ElevationSwatch,
  motion: MotionSwatch,
};

/**
 * Renders exactly one visual unit per token, dispatched by {@link TokenKind}.
 * Every token in `tokens.json` produces exactly one `TokenSwatch` per theme
 * panel — see `App.test.tsx`, which asserts the rendered count against
 * `tokens.json`'s per-theme token count as proof this page is generated from
 * the data, not hand-authored.
 */
export function TokenSwatch({ token, value, kind }: TokenSwatchProps) {
  const Swatch = SWATCH_BY_KIND[kind];
  return (
    <div data-testid="token-swatch">
      <Swatch token={token} value={value} />
    </div>
  );
}
