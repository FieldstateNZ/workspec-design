import type { SwatchProps } from './color-swatch';

/** One `--r-*` radius token, shown as a fixed-size tile cut with `var(token)`. */
export function RadiusSwatch({ token, value }: SwatchProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-2.5 text-xs">
      <div
        className="size-12 border-2 border-primary bg-secondary"
        style={{ borderRadius: `var(${token})` }}
      />
      <span className="truncate font-mono text-[11px] text-foreground" title={token}>
        {token}
      </span>
      <span className="truncate text-muted-foreground">{value}</span>
    </div>
  );
}
