/**
 * Status — a small dot + label pill for a typed element's lifecycle state:
 * a decision's Exploring / Decided / Superseded, a module card's Live / In
 * progress. Promoted from decision-ui's inline status-pill markup (five
 * duplicated call sites) so every WorkSpec surface reads status the same
 * way — one shape, one set of tones, reused instead of re-inlined.
 *
 * `tone` is deliberately generic (not "decided"/"exploring" literals): the
 * component doesn't know what a caller's domain states mean, only how each
 * should read — settled (accent), needs attention (warn), or quietly
 * informational (muted). Callers map their own state to a tone.
 */
import { cn } from '../../lib/utils';

export type StatusTone = 'accent' | 'warn' | 'muted';

const PILL_TONE_CLS: Record<StatusTone, string> = {
  accent: 'text-primary border-primary',
  warn: 'text-[color:var(--warn)] border-[color:var(--warn)]',
  muted: 'text-muted-foreground border-border',
};

const DOT_TONE_CLS: Record<StatusTone, string> = {
  accent: 'bg-primary shadow-[0_0_0_3px_var(--accent-soft)]',
  warn: 'bg-[color:var(--warn)] shadow-[0_0_0_3px_color-mix(in_oklab,var(--warn)_22%,transparent)]',
  muted: 'bg-muted-foreground',
};

export function Status({
  tone = 'muted',
  children,
  className,
}: {
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[7px] rounded-full border px-2.5 py-1',
        'font-mono text-[10px] uppercase leading-none tracking-wider',
        PILL_TONE_CLS[tone],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('size-[7px] shrink-0 rounded-full', DOT_TONE_CLS[tone])}
      />
      {children}
    </span>
  );
}
