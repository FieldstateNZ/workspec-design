/**
 * PageShell + PageHeader — the in-layout (AppLayout) page idiom.
 *
 * Every settings / users / preferences / dashboard page has the same
 * outer shape:
 *
 *   <AppLayout>
 *     <PageShell>
 *       <PageHeader
 *         back={{ href: "/users", label: "Back to users" }}
 *         title="Create user"
 *         lead="The user will receive..."
 *       />
 *
 *       <Card>...</Card>
 *       <Card>...</Card>
 *     </PageShell>
 *   </AppLayout>
 *
 * `width` lets each page pick its container size (default 3xl). The
 * shell handles consistent gutters, vertical rhythm, and stacking.
 *
 * INVERSION (docs/inventory.md, DELIVERY_PLAN.md decision 6): the enterprise
 * source imports wouter's `Link` directly for the `back` affordance,
 * coupling this package to a router it must not depend on. `PageHeader`
 * instead accepts the link component as a prop (`linkComponent`), defaulting
 * to a plain `<a>` — host apps pass their own router's link component (e.g.
 * `linkComponent={Link}` from wouter) to get client-side navigation back.
 * No `wouter` dependency anywhere in this package.
 */
import type { ComponentType, ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DisplayTitle, Lead } from './typography';
import { cn } from '../../lib/utils';

/** Minimal props shape any router's link component must accept to be passed as `linkComponent`. */
export interface PageHeaderLinkProps {
  href: string;
  className?: string;
  children?: ReactNode;
}

export type PageHeaderLinkComponent = ComponentType<PageHeaderLinkProps>;

function DefaultLink({ href, className, children }: PageHeaderLinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

const WIDTHS = {
  sm: 'max-w-xl',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  full: 'max-w-7xl',
  // edge-to-edge: fills the whole content area (dense management surfaces)
  bleed: 'max-w-none',
};

export function PageShell({
  children,
  width = 'lg',
  className,
}: {
  children: ReactNode;
  width?: keyof typeof WIDTHS;
  className?: string;
}) {
  return (
    <div className={cn('w-full mx-auto px-6 py-8 space-y-6', WIDTHS[width], className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  back,
  kicker,
  title,
  lead,
  actions,
  className,
  linkComponent: LinkComponent = DefaultLink,
}: {
  back?: { href: string; label: string };
  /** Mono-caps kicker above the title (the design's section tagline). */
  kicker?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** Right-aligned action buttons on the title row. */
  actions?: ReactNode;
  className?: string;
  /** Host app's router link component, e.g. `linkComponent={Link}` from wouter. Defaults to a plain `<a>`. */
  linkComponent?: PageHeaderLinkComponent;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {back && (
        <LinkComponent
          href={back.href}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> {back.label}
        </LinkComponent>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {kicker && (
            <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-muted-foreground mb-1.5">
              {kicker}
            </div>
          )}
          <DisplayTitle size="md" className="mb-0">
            {title}
          </DisplayTitle>
          {lead && <Lead className="mt-1.5">{lead}</Lead>}
        </div>
        {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
