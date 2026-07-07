import * as React from 'react';

import { cn } from '../../lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Border pinned to 1.5px to match Card — same rationale, same
          // consistency win across Console / Paper.
          // Focus state matches the design handoff: the border flips to
          // --accent and a 3px --accent-soft glow appears (instead of the
          // default 1px ring). Same shape on every input across the app
          // — pages don't need per-callsite focus-visible: overrides.
          'flex h-9 w-full rounded-md border-[1.5px] border-input bg-transparent px-3 py-1 text-base shadow-sm transition-[color,box-shadow,border-color] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
