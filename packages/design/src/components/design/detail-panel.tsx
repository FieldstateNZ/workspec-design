/**
 * DetailPanel — the right-side artifact inspector that slides in
 * over the canvas when an artifact is selected. Also reused as a
 * generic "side sheet" surface for non-artifact details (audit log
 * row inspector, MCP-session details, etc.).
 *
 * Composition (shadcn-style root + slots):
 *
 *   <DetailPanel onClose={...}>
 *     <DetailPanel.Header
 *       kicker="ARTIFACT · FEATURE"
 *       title="Pluggable auth"
 *       subtitle="WSR-12 · revision 3"
 *     >
 *       <Button size="sm">Edit</Button>
 *     </DetailPanel.Header>
 *
 *     <DetailPanel.Section label="Description">
 *       Allow third-party identity providers …
 *     </DetailPanel.Section>
 *
 *     <DetailPanel.Section label="Linked artifacts">
 *       …
 *     </DetailPanel.Section>
 *
 *     <DetailPanel.Footer>
 *       <Button variant="outline">Archive</Button>
 *     </DetailPanel.Footer>
 *   </DetailPanel>
 *
 * Layout: fills its container vertically. The caller is responsible
 * for placing it (fixed right rail on canvas pages, inline column
 * on brief / recs). The component itself doesn't position.
 */
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Lbl } from './typography';
import { cn } from '../../lib/utils';

export function DetailPanel({
  children,
  onClose,
  className,
  width = 360,
}: {
  children: React.ReactNode;
  /** Render a close button in the top-right. Omit for non-dismissable panels. */
  onClose?: () => void;
  className?: string;
  /** Fixed width in px (the panel's natural width — caller can override). */
  width?: number | string;
}) {
  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-card border-l border-border shadow-lg overflow-hidden',
        className,
      )}
      style={{ width }}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
          className="absolute top-2.5 right-2.5 size-7 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors z-10"
        >
          <X className="size-4" />
        </button>
      )}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">{children}</div>
      </ScrollArea>
    </aside>
  );
}

DetailPanel.Header = DetailPanelHeader;
DetailPanel.Section = DetailPanelSection;
DetailPanel.Footer = DetailPanelFooter;

function DetailPanelHeader({
  kicker,
  title,
  subtitle,
  children,
  className,
}: {
  kicker?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-aligned action slot (Edit / Archive / etc.). */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-5 pt-5 pb-4 border-b border-border bg-muted/20', className)}>
      {kicker && <Lbl className="mb-1.5">{kicker}</Lbl>}
      <div className="flex items-start justify-between gap-3 pr-7">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight leading-tight">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {children && <div className="shrink-0 flex items-center gap-1.5">{children}</div>}
      </div>
    </div>
  );
}

function DetailPanelSection({
  label,
  children,
  className,
  /** Render the section label inline rather than above. */
  inline = false,
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  inline?: boolean;
}) {
  if (inline && label) {
    return (
      <div
        className={cn(
          'px-5 py-3 border-b border-border/60 flex items-baseline justify-between gap-4',
          className,
        )}
      >
        <Lbl>{label}</Lbl>
        <div className="text-sm text-foreground text-right min-w-0 flex-1">{children}</div>
      </div>
    );
  }
  return (
    <div className={cn('px-5 py-4 border-b border-border/60 last:border-b-0', className)}>
      {label && <Lbl className="mb-2">{label}</Lbl>}
      <div className="text-sm leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

function DetailPanelFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-5 py-3 border-t border-border bg-muted/20 flex items-center justify-between gap-2 shrink-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Re-export the close button as a primitive in case callers want
 *  to render it elsewhere (e.g. inline next to a kicker). */
export function DetailPanelCloseButton({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClose}
      aria-label="Close"
      className={className}
    >
      <X className="size-4" />
    </Button>
  );
}
