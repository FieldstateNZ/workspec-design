import type { SwatchProps } from './color-swatch';

/** One `--s-*` spacing token, sized as a bar whose width is `var(token)`. */
export function SpacingSwatch({ token, value }: SwatchProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-2.5 text-xs">
      <div className="h-3 rounded-sm bg-primary" style={{ width: `var(${token})` }} />
      <span className="truncate font-mono text-[11px] text-foreground" title={token}>
        {token}
      </span>
      <span className="truncate text-muted-foreground">{value}</span>
    </div>
  );
}
