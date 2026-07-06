import type { SwatchProps } from './color-swatch';

/**
 * One motion token (`--ease-*` or `--d-*`), demoed as a hover-triggered
 * transition. The `.motion-demo:hover` transform lives in `styles.css`
 * (inline `style` can't express `:hover`); this component supplies the
 * per-token half of the transition — the timing function for an `--ease-*`
 * token, the duration for a `--d-*` token — pairing it with a fixed partner
 * value so the difference between tokens of the same axis is visible on hover.
 */
export function MotionSwatch({ token, value }: SwatchProps) {
  const isEase = token.startsWith('--ease');
  const style = isEase
    ? { transitionTimingFunction: `var(${token})`, transitionDuration: '400ms' }
    : { transitionDuration: `var(${token})`, transitionTimingFunction: 'ease' };

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-2.5 text-xs">
      <div
        className="motion-demo h-6 w-10 rounded-sm bg-primary"
        style={style}
        aria-hidden
        title="Hover to see the transition"
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
