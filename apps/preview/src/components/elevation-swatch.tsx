import type { SwatchProps } from './color-swatch';

/**
 * One `--sh-*` elevation token, shown as an elevated card (`box-shadow:
 * var(token)` on a `bg-elevated` surface) so the shadow reads against the
 * theme's actual card background rather than the page background.
 */
export function ElevationSwatch({ token, value }: SwatchProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-2.5 text-xs">
      <div className="h-12 rounded-md bg-card" style={{ boxShadow: `var(${token})` }} aria-hidden />
      <span className="truncate font-mono text-[11px] text-foreground" title={token}>
        {token}
      </span>
      <span className="truncate text-muted-foreground" title={value}>
        {value}
      </span>
    </div>
  );
}
