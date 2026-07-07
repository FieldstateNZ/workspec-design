import type { SwatchProps } from './color-swatch';

/**
 * One of the four typography tokens (`--sans`, `--mono`, `--font-body`,
 * `--font-display`), rendered in its own face via `font-family: var(token)`
 * so the actual self-hosted font renders, not just the stack's name as text.
 */
export function TypographySwatch({ token, value }: SwatchProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-3 text-xs">
      <p className="truncate text-2xl" style={{ fontFamily: `var(${token})` }}>
        Ag Workspec 123
      </p>
      <span className="truncate font-mono text-[11px] text-foreground" title={token}>
        {token}
      </span>
      <span className="truncate text-muted-foreground" title={value}>
        {value}
      </span>
    </div>
  );
}
