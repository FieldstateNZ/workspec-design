/**
 * SegChoice — the design's two-column segmented choice card
 * (single/multi, mcp/hosted, etc.). Top row = icon + title (left)
 * + price (right). Body = ink-soft description. Footer = mono-caps
 * feature chips.
 *
 * Active state matches the handoff: --accent border + --accent-mid
 * inset border + --accent-soft 4% wash, with the price text
 * flipping to --accent.
 *
 * Used by workspace-create steps 2 & 3, ModeSwitch, and any future
 * "pick one of two" surfaces.
 */
import type * as React from 'react';
import { Chip } from './chip';
import { cn } from '../../lib/utils';

export function SegChoice({
  active,
  onClick,
  icon,
  title,
  price,
  desc,
  features = [],
  disabled,
  className,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  title: string;
  price?: string;
  desc: string;
  features?: string[];
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        // 1.5px border matches Card / Input — cross-aesthetic parity.
        'text-left rounded-md border-[1.5px] px-3.5 py-3.5 transition-colors w-full disabled:cursor-default',
        active
          ? 'border-primary bg-primary/[0.04] shadow-[inset_0_0_0_1px_var(--accent-mid)]'
          : 'hover:border-primary/40 hover:bg-muted/40',
        disabled && !active && 'opacity-50',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {icon}
          <span className="text-sm font-semibold tracking-tight truncate">{title}</span>
        </div>
        {price && (
          <span
            className={cn(
              'text-[11px] font-mono shrink-0',
              active ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {price}
          </span>
        )}
      </div>
      <p className="text-[12.5px] text-muted-foreground leading-snug mt-1.5">{desc}</p>
      {features.length > 0 && (
        <div className="flex flex-wrap gap-[5px] mt-2.5">
          {features.map((f) => (
            <Chip key={f}>{f}</Chip>
          ))}
        </div>
      )}
    </button>
  );
}
