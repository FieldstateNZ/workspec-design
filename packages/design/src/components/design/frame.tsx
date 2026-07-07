/**
 * DesignFrame — the page-level Card with the design's mono-caps header
 * strip (the `.fhdr` pattern). Every multi-step / hero page in the
 * handoff uses this exact shape:
 *
 *   ┌──────────────────────────────────────────────┐
 *   │ STEP 02 · SEAT MODE      pukekos · single    │  ← header strip
 *   ├──────────────────────────────────────────────┤
 *   │                                              │
 *   │   <DisplayTitle>...</DisplayTitle>           │
 *   │   <Lead>...</Lead>                           │
 *   │                                              │
 *   │   ...content...                              │
 *   │                                              │
 *   └──────────────────────────────────────────────┘
 *
 * Composes shadcn `<Card>` so Paper-aesthetic flips and dark/light
 * theme propagate without per-callsite work.
 */
import { Card } from '../ui/card';
import { Lbl } from './typography';
import { cn } from '../../lib/utils';

export function DesignFrame({
  kicker,
  context,
  children,
  className,
  contentClassName,
  /** Max width of the frame. Default 720px matches the handoff. */
  maxWidth = 720,
  /** Centred page wrapper around the frame (true) vs inline (false). */
  centered = true,
}: {
  kicker: React.ReactNode;
  context?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: number | string;
  centered?: boolean;
}) {
  const card = (
    <Card className={cn('w-full overflow-hidden', className)} style={{ maxWidth }}>
      <CardHeaderStrip kicker={kicker} context={context} />
      <div className={cn('p-10 md:p-14', contentClassName)}>{children}</div>
    </Card>
  );

  if (!centered) return card;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background text-foreground">
      {card}
    </div>
  );
}

/**
 * Standalone header strip — when a page wants the design's kicker bar
 * but isn't a centred Card hero (e.g. settings sub-cards).
 */
export function CardHeaderStrip({
  kicker,
  context,
  className,
}: {
  kicker: React.ReactNode;
  context?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-5 py-2.5 border-b bg-muted/40',
        className,
      )}
    >
      <Lbl>{kicker}</Lbl>
      {context !== undefined && <Lbl>{context}</Lbl>}
    </div>
  );
}
