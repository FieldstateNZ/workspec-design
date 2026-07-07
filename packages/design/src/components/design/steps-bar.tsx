/**
 * StepsBar — numbered pip row used by the multi-step flows
 * (workspace-create, setup). Pip styling matches the design:
 *
 *   ●  done       18px circle, foreground bg + check icon
 *   ◌  current    18px circle, primary border + primary number
 *   ○  pending    18px circle, muted-foreground/40 border + number
 *
 * Connectors are 18px-wide hairlines between pips.
 */
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export function StepsBar({
  step,
  labels,
  className,
}: {
  /** 0-indexed current step. */
  step: number;
  /** Step label list. Length = total step count. */
  labels: readonly string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2.5 gap-y-2 mb-6 text-[10px] font-mono uppercase tracking-[0.1em] text-muted-foreground',
        className,
      )}
    >
      {labels.map((label, i) => {
        const done = i < step;
        const cur = i === step;
        return (
          <div key={label} className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'size-[18px] shrink-0 rounded-full border flex items-center justify-center text-[9px]',
                  done && 'bg-foreground text-background border-foreground',
                  cur && !done && 'border-primary text-primary',
                  !done && !cur && 'border-muted-foreground/40',
                )}
              >
                {done ? <Check className="size-2.5" /> : i + 1}
              </span>
              <span className={cur ? 'text-foreground' : ''}>{label}</span>
            </div>
            {i < labels.length - 1 && <div className="w-[18px] h-px bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
