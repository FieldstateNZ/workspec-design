/** Props shared by every per-kind token swatch component. */
export interface SwatchProps {
  readonly token: string;
  readonly value: string;
}

/**
 * A color-group token: name, raw value (as committed in `tokens.json`), and
 * a "resolved" chip. The chip's `background-color` is `var(--token-name)`
 * looked up live in the browser inside the theme-scoped panel it's rendered
 * in — so a `color-mix()`/`var()`-chained value (e.g. `--sticky-tag-fill`,
 * `--bg-elev`) resolves to its real rendered color, not the raw expression
 * text next to it.
 */
export function ColorSwatch({ token, value }: SwatchProps) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-2.5 text-xs">
      <div
        className="h-10 rounded-sm border border-border"
        style={{ backgroundColor: `var(${token})` }}
      />
      <span className="truncate font-mono text-[11px] text-foreground" title={token}>
        {token}
      </span>
      <span className="truncate text-muted-foreground" title={value}>
        {value}
      </span>
    </div>
  );
}
