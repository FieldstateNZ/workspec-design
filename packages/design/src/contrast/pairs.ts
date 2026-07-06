import type { TokenName } from '../tokens/token-names.js';
import type { ContrastClass, ContrastPair } from './pairs.types.js';

const CORE_BACKGROUNDS: readonly TokenName[] = [
  '--bg',
  '--bg-soft',
  '--bg-elevated',
  '--panel-dark',
];
const UI_BACKGROUNDS: readonly TokenName[] = ['--bg', '--bg-soft', '--bg-elevated'];
const INK_TEXT_ROLES: readonly TokenName[] = ['--ink', '--ink-soft', '--ink-muted', '--ink-fade'];
const UI_ROLES: readonly TokenName[] = ['--accent', '--agent', '--warn', '--danger'];
const STICKY_COLORS = ['yellow', 'pink', 'green', 'blue', 'orange', 'purple'] as const;
const TYPE_COLORS: readonly TokenName[] = [
  '--type-persona',
  '--type-feature',
  '--type-scenario',
  '--type-userreq',
  '--type-need',
  '--type-idea',
  '--type-pain',
  '--type-q',
];

function crossProduct(
  textTokens: readonly TokenName[],
  bgTokens: readonly TokenName[],
  contrastClass: ContrastClass,
  rationale?: string,
): ContrastPair[] {
  return textTokens.flatMap((textToken) =>
    bgTokens.map((bgToken) => ({ textToken, bgToken, class: contrastClass, rationale })),
  );
}

/**
 * THE documented role-pair table: every plausible text-or-UI-role-on-
 * background combination the token system's components can produce,
 * covering every ink, accent/status, sticky-note, index-card, photo-note,
 * and artifact-type-color role against every surface it can legitimately
 * sit on. This is the contrast gate's input — `contrast-gate.test.ts`
 * measures every entry against both themes.
 */
export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  // Primary text hierarchy (--ink..--ink-fade) on every documented surface —
  // this is what the "is the spec sound" verdict in the audit report is
  // measured against, since it's the pairing most body/heading copy uses.
  ...crossProduct(INK_TEXT_ROLES, CORE_BACKGROUNDS, 'normal-text'),

  // --ink-ghost is the disabled/placeholder-text role (see its token
  // comment: "ink-ghost" sits below --ink-fade on the fade scale). It is
  // never used for text meant to be read as content — only for hint text,
  // disabled labels, and empty-state glyphs, i.e. large-text-or-ui's
  // "non-text or decorative" carve-out, not running-text SC 1.4.3.
  ...crossProduct(
    ['--ink-ghost'],
    CORE_BACKGROUNDS,
    'large-text-or-ui',
    'placeholder/disabled role — never running text, so the 3:1 non-text threshold applies, not 4.5:1',
  ),

  // Accent/agent/status colors used as short UI text (button labels,
  // badges, icon-adjacent labels) or bare UI elements (icon fills, focus
  // rings) — large-text-or-ui by convention for this token family.
  ...crossProduct(UI_ROLES, UI_BACKGROUNDS, 'large-text-or-ui'),

  // --on-accent is always paired with a solid accent fill behind it
  // (buttons, badges) — running text on a filled surface, so normal-text.
  { textToken: '--on-accent', bgToken: '--accent', class: 'normal-text' },
  { textToken: '--on-accent', bgToken: '--accent-hover', class: 'normal-text' },

  // Sticky-note ink-on-paper — each note's own bg/ink pair is fixed by the
  // component (a yellow note is always --sticky-yellow-ink on
  // --sticky-yellow-bg), so there's exactly one background per ink role.
  ...STICKY_COLORS.map((color): ContrastPair => ({
    textToken: `--sticky-${color}-ink` as TokenName,
    bgToken: `--sticky-${color}-bg` as TokenName,
    class: 'normal-text',
  })),

  // Index-card and photo-note components: theme-independent analog
  // surfaces (see the token comments in console-{dark,light}.ts) — each
  // ink/caption role always sits on its own fixed paper/mount color.
  { textToken: '--index-ink', bgToken: '--index-paper', class: 'normal-text' },
  { textToken: '--photo-ink', bgToken: '--photo-mount', class: 'normal-text' },
  { textToken: '--photo-caption', bgToken: '--photo-mount', class: 'normal-text' },

  // Artifact/discovery-note type-color eyebrows and rail labels — short,
  // uppercase, badge-like UI text, so large-text-or-ui. --bg-soft and
  // --panel-dark aren't documented surfaces for these (the typed-artifact
  // rail and eyebrow only ever render on the page shell or a card).
  ...crossProduct(TYPE_COLORS, ['--bg', '--bg-elevated'], 'large-text-or-ui'),
];
