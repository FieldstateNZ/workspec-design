import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

/**
 * Card visual variants — semantic states the design system wants
 * available on any card surface, not just artifact cards.
 *
 *   ink     default solid bordered card (was the only flavour)
 *   draft   in-flight / pre-commit. Dashed accent border + 3% wash.
 *           Use for unconfirmed setting previews, draft invites, etc.
 *   focus   selected / primary CTA. Accent border + accent-soft
 *           glow ring. Use sparingly — at most one per page.
 *   ghost   borderless, transparent. Use for stacking sub-sections
 *           inside another card without nested borders.
 */
// Card borders pin to 1.5px (instead of Tailwind's default 1px from
// `border`) so the bordered surface reads consistently across both
// Console (low-contrast --line on dark bg) and Paper (high-contrast
// --ink on cream). Without the bump the same 1px border appeared
// visually thicker on Console because of accent-saturation contrast
// against the dark surface — feedback from the /preview review.
const cardVariants = cva('rounded-xl border-[1.5px] text-card-foreground transition-colors', {
  variants: {
    variant: {
      ink: 'bg-card shadow',
      draft: 'border-dashed border-primary/60 bg-primary/[0.03] shadow-none',
      focus: 'border-primary bg-card shadow-[0_0_0_3px_var(--accent-soft)]',
      ghost: 'border-transparent bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'ink',
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  ),
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  ),
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
