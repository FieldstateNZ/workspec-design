import type { TokenName } from './token-names.js';
import type { ThemeName } from './theme-name.js';

/**
 * One token value this package's TS tables deliberately do **not** carry
 * verbatim from the vendored enterprise source — a WCAG AA contrast defect
 * Brett adjudicated as a spec defect rather than off-spec usage (2026-07-07):
 * the package is now the value canon for these tokens, and the enterprise
 * app inherits the correction when it migrates onto this package. Every
 * other token still must match the vendored source exactly — see
 * `source-of-record.test.ts`, which asserts this file is the *complete* and
 * *only* set of exceptions.
 */
export interface AdjudicatedDeviation {
  readonly token: TokenName;
  readonly theme: ThemeName;
  /** The value still present in the vendored enterprise CSS (`src/tokens/source-of-record/`) — kept so the registry itself proves honest history. */
  readonly enterpriseValue: string;
  /** The corrected value this package actually ships. */
  readonly canonValue: string;
  /** `docs/drift-log.md` entry ID this correction is recorded under. */
  readonly driftLogId: string;
  readonly adjudicated: string;
}

/**
 * The complete set of adjudicated value deviations from the vendored
 * enterprise source (DELIVERY_PLAN.md extraction discipline is overridden
 * for exactly these tokens, per Brett's 2026-07-07 ruling — see
 * `docs/drift-log.md` D33–D40). This list can only grow via a future,
 * explicit adjudication; it is not a place to silently paper over new
 * drift.
 */
export const ADJUDICATED_DEVIATIONS: readonly AdjudicatedDeviation[] = [
  // console-dark — D33/D34/D35: --ink-muted/--ink-fade/--ink-ghost failed
  // normal-text/large-text-or-ui against --bg-elevated (worst-case surface).
  {
    token: '--ink-muted',
    theme: 'console-dark',
    enterpriseValue: '#72727a',
    canonValue: '#8e8e96',
    driftLogId: 'D33',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },
  {
    token: '--ink-fade',
    theme: 'console-dark',
    enterpriseValue: '#62626a',
    canonValue: '#84848c',
    driftLogId: 'D34',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },
  {
    token: '--ink-ghost',
    theme: 'console-dark',
    enterpriseValue: '#3a3a42',
    canonValue: '#686870',
    driftLogId: 'D35',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },

  // console-light — D36/D37/D38: same three roles, worst-case surface
  // --panel-dark. --ink-muted and --ink-fade shared one value in the
  // enterprise source; they now diverge (muted comfortably clears, fade
  // just clears) to keep a real, strictly-ordered gap between them.
  {
    token: '--ink-muted',
    theme: 'console-light',
    enterpriseValue: '#76767c',
    canonValue: '#64646a',
    driftLogId: 'D36',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },
  {
    token: '--ink-fade',
    theme: 'console-light',
    enterpriseValue: '#76767c',
    canonValue: '#6d6d73',
    driftLogId: 'D37',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },
  {
    token: '--ink-ghost',
    theme: 'console-light',
    enterpriseValue: '#b8b8be',
    canonValue: '#89898f',
    driftLogId: 'D38',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },

  // console-light — D39: --warn failed large-text-or-ui (3:1) against every
  // UI background; darkened, ochre hue preserved.
  {
    token: '--warn',
    theme: 'console-light',
    enterpriseValue: '#c89216',
    canonValue: '#b08012',
    driftLogId: 'D39',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },

  // console-light — D40: --on-accent (white) on --accent failed normal-text
  // (4.5:1) at 4.36:1 — white is already maximal, so --accent itself
  // darkens slightly (brand green hue preserved).
  {
    token: '--accent',
    theme: 'console-light',
    enterpriseValue: '#1b8a55',
    canonValue: '#18804e',
    driftLogId: 'D40',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },

  // console-light — consequential to D40: these three translucent tokens
  // and the glow shadow embed --accent's literal rgb components, so they
  // move in lockstep with the D40 correction to stay consistent with the
  // new --accent value (none of these three are contrast-audited pairs
  // themselves).
  {
    token: '--accent-soft',
    theme: 'console-light',
    enterpriseValue: 'rgba(27,138,85,0.10)',
    canonValue: 'rgba(24,128,78,0.10)',
    driftLogId: 'D40',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },
  {
    token: '--accent-mid',
    theme: 'console-light',
    enterpriseValue: 'rgba(27,138,85,0.30)',
    canonValue: 'rgba(24,128,78,0.30)',
    driftLogId: 'D40',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },
  {
    token: '--accent-wash',
    theme: 'console-light',
    enterpriseValue: 'rgba(27,138,85,0.08)',
    canonValue: 'rgba(24,128,78,0.08)',
    driftLogId: 'D40',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },
  {
    token: '--sh-glow',
    theme: 'console-light',
    enterpriseValue: '0 0 0 1px var(--accent), 0 0 24px rgba(27,138,85,0.16)',
    canonValue: '0 0 0 1px var(--accent), 0 0 24px rgba(24,128,78,0.16)',
    driftLogId: 'D40',
    adjudicated: '2026-07-07 Brett: contrast defects',
  },
];
