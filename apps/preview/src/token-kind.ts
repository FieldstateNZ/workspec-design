import type { TokenGroupId } from '@workspec/design';

/**
 * How a token group's members should be demonstrated. Every group in
 * `TOKEN_GROUP_IDS` is a color-swatch group (name + raw value + a resolved
 * chip) except the five structural groups, each of which needs its own
 * visual: a font-family face, a sized bar, a shaped tile, an elevated card,
 * or a hover transition demo.
 */
export type TokenKind = 'color' | 'typography' | 'spacing' | 'radius' | 'elevation' | 'motion';

const STRUCTURAL_GROUP_KINDS: Readonly<Partial<Record<TokenGroupId, TokenKind>>> = {
  typography: 'typography',
  spacing: 'spacing',
  radius: 'radius',
  elevation: 'elevation',
  motion: 'motion',
};

/** Resolves the {@link TokenKind} a group's tokens should render as. */
export function tokenKindForGroup(groupId: TokenGroupId): TokenKind {
  return STRUCTURAL_GROUP_KINDS[groupId] ?? 'color';
}
