/**
 * Design typography primitives.
 *
 * The handoff frames use three recurring text shapes:
 *
 *   <Lbl>           10px mono-caps section kicker (the `.lbl` class)
 *   <DisplayTitle>  32-36px page hero title (serif under Paper aesthetic)
 *   <Lead>          14px ink-soft lead paragraph, max-w-xl
 *
 * Plus a tiny <Kicker> for the corner mono-caps rows on the frame
 * header strip and meta lines.
 */
import type * as React from 'react';
import { cn } from '../../lib/utils';

export function Lbl({
  htmlFor,
  children,
  className,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const cls = cn(
    'text-[10px] font-mono uppercase tracking-[0.1em] text-muted-foreground',
    className,
  );
  return htmlFor ? (
    <label htmlFor={htmlFor} className={cls}>
      {children}
    </label>
  ) : (
    <div className={cls}>{children}</div>
  );
}

export function DisplayTitle({
  children,
  className,
  size = 'lg',
}: {
  children: React.ReactNode;
  className?: string;
  /** lg = 36px hero (default), md = 28px (sub-page heros) */
  size?: 'lg' | 'md';
}) {
  return (
    <h2
      className={cn(
        'font-bold tracking-tight leading-[1.1] mb-1.5',
        size === 'lg' ? 'text-[36px]' : 'text-[28px]',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-muted-foreground max-w-xl', className)}>{children}</p>;
}

/** Kicker — alias of Lbl for header-strip / meta rows where the
 *  semantics are "context line" rather than "form-field label". */
export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <Lbl className={className}>{children}</Lbl>;
}
