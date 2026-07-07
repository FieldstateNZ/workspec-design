import type { KnownContrastFailure } from './known-failures.types.js';

/**
 * The committed known-failures allowlist (DELIVERY_PLAN.md decision 8): new
 * contrast failures break CI; an entry here that starts passing also
 * breaks CI ("stale allowlist — remove the entry"), so this list can only
 * shrink as Brett resolves each drift-log entry, never silently grow.
 */
export const KNOWN_CONTRAST_FAILURES: readonly KnownContrastFailure[] = [
  // --ink-muted on every core surface, console-dark (D33).
  {
    textToken: '--ink-muted',
    bgToken: '--bg',
    theme: 'console-dark',
    measuredRatio: 4.15,
    driftLogId: 'D33',
  },
  {
    textToken: '--ink-muted',
    bgToken: '--bg-soft',
    theme: 'console-dark',
    measuredRatio: 3.78,
    driftLogId: 'D33',
  },
  {
    textToken: '--ink-muted',
    bgToken: '--bg-elevated',
    theme: 'console-dark',
    measuredRatio: 3.56,
    driftLogId: 'D33',
  },
  {
    textToken: '--ink-muted',
    bgToken: '--panel-dark',
    theme: 'console-dark',
    measuredRatio: 3.85,
    driftLogId: 'D33',
  },

  // --ink-fade on every core surface, console-dark (D34).
  {
    textToken: '--ink-fade',
    bgToken: '--bg',
    theme: 'console-dark',
    measuredRatio: 3.27,
    driftLogId: 'D34',
  },
  {
    textToken: '--ink-fade',
    bgToken: '--bg-soft',
    theme: 'console-dark',
    measuredRatio: 2.99,
    driftLogId: 'D34',
  },
  {
    textToken: '--ink-fade',
    bgToken: '--bg-elevated',
    theme: 'console-dark',
    measuredRatio: 2.81,
    driftLogId: 'D34',
  },
  {
    textToken: '--ink-fade',
    bgToken: '--panel-dark',
    theme: 'console-dark',
    measuredRatio: 3.04,
    driftLogId: 'D34',
  },

  // --ink-ghost on every core surface, console-dark — fails even at its own 3:1 large-text-or-ui threshold (D35).
  {
    textToken: '--ink-ghost',
    bgToken: '--bg',
    theme: 'console-dark',
    measuredRatio: 1.76,
    driftLogId: 'D35',
  },
  {
    textToken: '--ink-ghost',
    bgToken: '--bg-soft',
    theme: 'console-dark',
    measuredRatio: 1.6,
    driftLogId: 'D35',
  },
  {
    textToken: '--ink-ghost',
    bgToken: '--bg-elevated',
    theme: 'console-dark',
    measuredRatio: 1.5,
    driftLogId: 'D35',
  },
  {
    textToken: '--ink-ghost',
    bgToken: '--panel-dark',
    theme: 'console-dark',
    measuredRatio: 1.63,
    driftLogId: 'D35',
  },

  // --ink-muted on 3 of 4 core surfaces, console-light — passes on --bg-elevated at 4.51 (D36).
  {
    textToken: '--ink-muted',
    bgToken: '--bg',
    theme: 'console-light',
    measuredRatio: 4.18,
    driftLogId: 'D36',
  },
  {
    textToken: '--ink-muted',
    bgToken: '--bg-soft',
    theme: 'console-light',
    measuredRatio: 4.33,
    driftLogId: 'D36',
  },
  {
    textToken: '--ink-muted',
    bgToken: '--panel-dark',
    theme: 'console-light',
    measuredRatio: 4.0,
    driftLogId: 'D36',
  },

  // --ink-fade on the same 3 surfaces, console-light — --ink-fade and --ink-muted share the
  // identical value (#76767c) in this theme, so the ratios match D36 exactly (D37).
  {
    textToken: '--ink-fade',
    bgToken: '--bg',
    theme: 'console-light',
    measuredRatio: 4.18,
    driftLogId: 'D37',
  },
  {
    textToken: '--ink-fade',
    bgToken: '--bg-soft',
    theme: 'console-light',
    measuredRatio: 4.33,
    driftLogId: 'D37',
  },
  {
    textToken: '--ink-fade',
    bgToken: '--panel-dark',
    theme: 'console-light',
    measuredRatio: 4.0,
    driftLogId: 'D37',
  },

  // --ink-ghost on every core surface, console-light — fails even at 3:1 (D38).
  {
    textToken: '--ink-ghost',
    bgToken: '--bg',
    theme: 'console-light',
    measuredRatio: 1.83,
    driftLogId: 'D38',
  },
  {
    textToken: '--ink-ghost',
    bgToken: '--bg-soft',
    theme: 'console-light',
    measuredRatio: 1.89,
    driftLogId: 'D38',
  },
  {
    textToken: '--ink-ghost',
    bgToken: '--bg-elevated',
    theme: 'console-light',
    measuredRatio: 1.97,
    driftLogId: 'D38',
  },
  {
    textToken: '--ink-ghost',
    bgToken: '--panel-dark',
    theme: 'console-light',
    measuredRatio: 1.75,
    driftLogId: 'D38',
  },

  // --warn as UI text/fill on every UI surface, console-light — fails its 3:1 large-text-or-ui threshold (D39).
  {
    textToken: '--warn',
    bgToken: '--bg',
    theme: 'console-light',
    measuredRatio: 2.57,
    driftLogId: 'D39',
  },
  {
    textToken: '--warn',
    bgToken: '--bg-soft',
    theme: 'console-light',
    measuredRatio: 2.66,
    driftLogId: 'D39',
  },
  {
    textToken: '--warn',
    bgToken: '--bg-elevated',
    theme: 'console-light',
    measuredRatio: 2.77,
    driftLogId: 'D39',
  },

  // --on-accent on --accent, console-light — 4.36 vs the 4.5 normal-text threshold; passes on --accent-hover (D40).
  {
    textToken: '--on-accent',
    bgToken: '--accent',
    theme: 'console-light',
    measuredRatio: 4.36,
    driftLogId: 'D40',
  },
];
