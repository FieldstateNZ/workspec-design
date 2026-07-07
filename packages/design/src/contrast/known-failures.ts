import type { KnownContrastFailure } from './known-failures.types.js';

/**
 * The committed known-failures allowlist (DELIVERY_PLAN.md decision 8): new
 * contrast failures break CI; an entry here that starts passing also
 * breaks CI ("stale allowlist — remove the entry"), so this list can only
 * shrink as Brett resolves each drift-log entry, never silently grow.
 *
 * Emptied per Brett's adjudication 2026-07-07 (docs/drift-log.md D33–D40):
 * every prior entry was a contrast defect, not an accepted spec weakness —
 * the token values were corrected instead (see
 * `src/tokens/adjudicated-deviations.ts`). The stale-allowlist rule above
 * means this stays empty unless a future failure is explicitly adjudicated
 * back in.
 */
export const KNOWN_CONTRAST_FAILURES: readonly KnownContrastFailure[] = [];
