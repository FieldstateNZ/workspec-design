/**
 * Surf / InfoBar — the soft-secondary surface that the design uses
 * for info bars, code wrappers, and locked panels.
 *
 *   <Surf>     Generic muted bordered panel.
 *   <InfoBar>  Surf preset for the bottom-of-step explanatory bar
 *              (mono caption font, can render in 1-col or 2-col grid).
 */
import { cn } from '../../lib/utils';

export function Surf({
  children,
  className,
  as: Component = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'aside';
}) {
  return (
    <Component className={cn('rounded-md border bg-muted/40 p-3.5', className)}>
      {children}
    </Component>
  );
}

export function InfoBar({
  children,
  className,
  cols = 1,
}: {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2;
}) {
  return (
    <div
      className={cn(
        'mt-5 px-3.5 py-3 rounded-md border bg-muted/40 text-xs font-mono text-muted-foreground',
        cols === 2 && 'grid grid-cols-2 gap-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
