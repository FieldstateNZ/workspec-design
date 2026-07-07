/**
 * LensToggle — segmented toggle for the canvas viewmode switcher.
 *
 * Three lenses today: logical (problem-side), deployment (solution-
 * side), both (combined). The toggle is a 2-3-segment pill where the
 * active segment fills with --accent + --on-accent and inactive
 * segments are mono-caps muted.
 *
 *   ┌───────────┬─────────────┬──────┐
 *   │  Logical  │  Deployment │ Both │
 *   └───────────┴─────────────┴──────┘
 *
 * Generic over the value type — this isn't lens-specific, it just
 * happens to be the most common consumer. Pass any string-literal
 * union and a matching `options` array.
 */
import { cn } from '../../lib/utils';

export interface LensOption<T extends string> {
  value: T;
  label: string;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
}

export function LensToggle<T extends string>({
  value,
  onChange,
  options,
  className,
  size = 'md',
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly LensOption<T>[];
  className?: string;
  size?: 'sm' | 'md';
}) {
  const segCls = size === 'sm' ? 'h-7 px-2.5 text-[10px]' : 'h-8 px-3 text-[11px]';
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-md border bg-muted/40 p-0.5 gap-0.5',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              'rounded-[4px] font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5',
              segCls,
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
