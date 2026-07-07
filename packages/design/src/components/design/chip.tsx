/**
 * Chip — mono uppercase pill at 9-10px, used for feature lists,
 * status pills, type tags. Wraps shadcn Badge to inherit its
 * focus/hover behaviour but enforces the design's typography.
 *
 * Variants:
 *   default   — neutral muted pill (the most common case)
 *   active    — accent border + accent text
 *   agent     — agent-green border (used for atlas/agent presence)
 *   ghost     — text-only, no border (for dense feature rows)
 */
import type * as React from 'react';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'active' | 'agent' | 'ghost';

export function Chip({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const base =
    'font-mono uppercase tracking-wider text-[9px] leading-none px-1.5 py-[3px] font-normal rounded-[3px]';

  if (variant === 'ghost') {
    return (
      <span className={cn(base, 'text-muted-foreground bg-transparent', className)}>
        {children}
      </span>
    );
  }

  const variantCls = {
    default: 'bg-transparent text-muted-foreground border-border',
    active: 'bg-transparent text-primary border-primary',
    agent: 'bg-transparent text-[color:var(--agent)] border-[color:var(--agent)]',
  }[variant];

  return (
    <Badge variant="outline" className={cn(base, variantCls, className)}>
      {children}
    </Badge>
  );
}
