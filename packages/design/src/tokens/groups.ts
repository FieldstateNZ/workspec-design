import type { TokenName } from './token-names.js';

/**
 * Semantic grouping for a design token, matching the group table in
 * `docs/inventory.md`. Independent of the physical 3-block CSS rule split
 * (`ThemeDefinition.blocks`) — a group like `accent` spans tokens declared in
 * more than one block (e.g. `--accent-hover` lives in the third rule as a
 * "derived" value, but is still part of the accent family).
 */
export type TokenGroupId =
  | 'surface'
  | 'ink'
  | 'accent'
  | 'agent'
  | 'status'
  | 'sticky'
  | 'index-card'
  | 'photo'
  | 'wireframe'
  | 'canvas'
  | 'type-colors'
  | 'el-colors'
  | 'el-tint'
  | 'typography'
  | 'spacing'
  | 'radius'
  | 'elevation'
  | 'motion';

/** Every group id, in the order they're presented in `docs/inventory.md`. */
export const TOKEN_GROUP_IDS: readonly TokenGroupId[] = [
  'surface',
  'ink',
  'accent',
  'agent',
  'status',
  'sticky',
  'index-card',
  'photo',
  'wireframe',
  'canvas',
  'type-colors',
  'el-colors',
  'el-tint',
  'typography',
  'spacing',
  'radius',
  'elevation',
  'motion',
];

/** The token names belonging to each semantic group, in source declaration order. */
export const TOKEN_GROUPS: Readonly<Record<TokenGroupId, readonly TokenName[]>> = {
  surface: [
    '--bg',
    '--bg-soft',
    '--bg-elevated',
    '--bg-elev',
    '--panel-dark',
    '--line',
    '--line-2',
  ],
  ink: ['--ink', '--ink-soft', '--ink-muted', '--ink-fade', '--ink-ghost'],
  accent: [
    '--accent',
    '--accent-deep',
    '--accent-soft',
    '--accent-mid',
    '--accent-hover',
    '--accent-wash',
  ],
  agent: ['--agent', '--agent-soft', '--agent-mid'],
  status: ['--warn', '--danger', '--danger-soft', '--on-accent'],
  sticky: [
    '--sticky-yellow-bg',
    '--sticky-yellow-ink',
    '--sticky-yellow-edge',
    '--sticky-pink-bg',
    '--sticky-pink-ink',
    '--sticky-pink-edge',
    '--sticky-green-bg',
    '--sticky-green-ink',
    '--sticky-green-edge',
    '--sticky-blue-bg',
    '--sticky-blue-ink',
    '--sticky-blue-edge',
    '--sticky-orange-bg',
    '--sticky-orange-ink',
    '--sticky-orange-edge',
    '--sticky-purple-bg',
    '--sticky-purple-ink',
    '--sticky-purple-edge',
    '--sticky-tag-fill',
    '--sticky-tag-line',
    '--sticky-reaction-fill',
  ],
  'index-card': ['--index-paper', '--index-edge', '--index-ink', '--index-rule', '--index-margin'],
  photo: [
    '--photo-mount',
    '--photo-ink',
    '--photo-caption',
    '--photo-placeholder',
    '--photo-glyph',
  ],
  wireframe: [
    '--wf-sketch-border',
    '--wf-sketch-border-strong',
    '--wf-sketch-fill',
    '--wf-sketch-text',
    '--wf-sketch-strong',
    '--wf-sketch-placeholder',
    '--wf-sketch-surface',
    '--wf-sketch-primary',
    '--wf-sketch-primary-text',
    '--wf-sketch-primary-soft',
    '--wf-sketch-radius',
    '--wf-sketch-shadow',
    '--wf-hifi-border',
    '--wf-hifi-border-strong',
    '--wf-hifi-fill',
    '--wf-hifi-text',
    '--wf-hifi-strong',
    '--wf-hifi-placeholder',
    '--wf-hifi-surface',
    '--wf-hifi-primary',
    '--wf-hifi-primary-text',
    '--wf-hifi-primary-soft',
    '--wf-hifi-radius',
    '--wf-hifi-shadow',
  ],
  canvas: [
    '--canvas-bg',
    '--canvas-grid-major',
    '--canvas-grid-minor',
    '--canvas-from',
    '--canvas-to',
    '--canvas-grid',
  ],
  'type-colors': [
    '--type-persona',
    '--type-feature',
    '--type-scenario',
    '--type-userreq',
    '--type-need',
    '--type-idea',
    '--type-pain',
    '--type-q',
  ],
  'el-colors': [
    '--el-actor',
    '--el-system',
    '--el-external-system',
    '--el-container',
    '--el-database',
    '--el-queue',
    '--el-domain',
    '--el-class',
    '--el-interface',
    '--el-function',
  ],
  'el-tint': ['--el-tint-surface', '--el-tint-border', '--el-tint-eyebrow', '--el-tint-ink-dim'],
  typography: ['--sans', '--mono', '--font-body', '--font-display'],
  spacing: [
    '--s-1',
    '--s-2',
    '--s-3',
    '--s-4',
    '--s-5',
    '--s-6',
    '--s-8',
    '--s-10',
    '--s-12',
    '--s-16',
    '--s-20',
  ],
  radius: ['--r-1', '--r-2', '--r-3', '--r-4', '--r-5', '--r-pill'],
  elevation: ['--sh-1', '--sh-2', '--sh-3', '--sh-glow'],
  motion: ['--ease-out', '--ease-in-out', '--d-fast', '--d-base', '--d-slow'],
};
