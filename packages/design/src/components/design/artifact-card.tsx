/**
 * ArtifactCard — the canonical surface for rendering a single artifact.
 *
 * Drives the canvas (React Flow custom-node body), the brief page,
 * the recs page, and the detail-panel header. One source of truth
 * for "this is how an artifact looks": type-tinted accent, drafted/
 * inked/superseded lifecycle styling, and focus/dimmed/highlighted
 * interaction overlays.
 *
 * Three orthogonal axes baked into cva:
 *
 *   type    persona | need | goal | pain-point | feature | behaviour |
 *           tool | user-requirement | system-requirement | decision |
 *           question | note  → drives the accent ribbon colour.
 *
 *   state   inked (default) | drafted | superseded → drives border
 *           style (solid/dashed), text colour (ink/ink-ghost), and
 *           the DRAFT / SUPERSEDED stamp visibility.
 *
 *   focus   none (default) | focused | dimmed | highlighted →
 *           overlay states. `focused` adds an accent ring; `dimmed`
 *           drops opacity; `highlighted` adds a blue ring + pulse.
 *
 * Composition idiom (shadcn-style — root + slots):
 *
 *   <ArtifactCard type="feature" state="drafted">
 *     <ArtifactCardHeader title="Pluggable auth" type="feature" state="drafted">
 *       <Chip>WSR-12</Chip>
 *     </ArtifactCardHeader>
 *     <ArtifactCardBody>
 *       Allow third-party identity providers …
 *     </ArtifactCardBody>
 *     <ArtifactCardFooter>
 *       <Chip>PRI 2</Chip>
 *       <Chip>WIP</Chip>
 *     </ArtifactCardFooter>
 *   </ArtifactCard>
 *
 * For the simplest case (just title + description + meta chips),
 * the high-level <ArtifactCard.Simple> below renders the slots
 * inline so callers don't have to compose them.
 */
import type * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Chip } from './chip';
import { cn } from '../../lib/utils';

/* ─── Type → colour token map ─── */

/**
 * Per-type accent colour. Matches the legacy --color-artifact-*
 * tokens in index.css plus the canvas-side types (goal, pain-point,
 * behaviour, tool) that don't yet have a token. Inline here so the
 * primitive is self-contained.
 *
 * `accent` → border + ribbon strip + type-chip text.
 * `wash`   → 6% tint behind the card body (subtle).
 *
 * The values flow through CSS color-mix so they stay readable on
 * both light and dark token sets — the artifact-* values are mid-
 * tones tuned for warm light backgrounds; on dark surfaces we
 * lighten them via color-mix in the className templates below.
 */
const TYPE_ACCENT: Record<string, string> = {
  persona: 'var(--color-artifact-persona, #b7794a)',
  domain: 'var(--color-artifact-persona, #b7794a)',

  need: 'var(--color-artifact-need, #8a6d3b)',
  goal: 'var(--color-artifact-need, #8a6d3b)',
  'pain-point': 'var(--color-artifact-need, #8a6d3b)',

  'user-requirement': 'var(--color-artifact-user-req, #6a6a3a)',

  feature: 'var(--color-artifact-feature, #3a6a58)',
  behaviour: 'var(--color-artifact-feature, #3a6a58)',
  tool: 'var(--color-artifact-feature, #3a6a58)',

  'system-requirement': 'var(--color-artifact-system-req, #3d5d7a)',

  decision: 'var(--color-artifact-decision, #8a4a2a)',
  'decision-driver': 'var(--color-artifact-decision, #8a4a2a)',

  note: 'var(--color-artifact-note, #7a7a6a)',
  question: 'var(--color-artifact-question, #6a4a7a)',
};

export type ArtifactType = keyof typeof TYPE_ACCENT;

/* ─── cva variants ─── */

const artifactCardVariants = cva(
  // Base: every artifact is a small bordered surface. 1.5px border
  // matches Card / Input for cross-aesthetic visual consistency.
  // Padding + type tuned to read well at canvas-node scale (~220px)
  // up to brief-page scale (~520px).
  'relative rounded-md border-[1.5px] bg-card text-card-foreground transition-all overflow-hidden',
  {
    variants: {
      state: {
        // Inked = the canonical, committed artifact. Solid border,
        // full opacity, ink text. Default.
        inked: 'border-[color:var(--art-accent,var(--border))]',
        // Drafted = pre-commit. Dashed accent border + ink-ghost
        // text + DRAFT stamp (rendered by ArtifactCardHeader).
        drafted:
          'border-dashed border-[color:var(--art-accent,var(--border))] bg-[color:var(--art-accent,transparent)]/[0.03] [&_.art-body]:italic [&_.art-body]:text-[color:var(--ink-ghost)]',
        // Superseded = replaced by a newer revision. Strikethrough
        // title, dim opacity, no stamp (header handles the strike).
        superseded:
          'border-[color:var(--border)] opacity-55 [&_.art-title]:line-through [&_.art-title]:text-[color:var(--ink-ghost)]',
      },
      focus: {
        none: '',
        focused: 'shadow-[0_0_0_2px_var(--accent-soft)] border-[color:var(--accent)]',
        dimmed: 'opacity-25 pointer-events-none',
        highlighted: 'ring-2 ring-blue-500/60 ring-offset-1 ring-offset-background animate-pulse',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-sm hover:border-[color:var(--art-accent,var(--border))]',
        false: '',
      },
      density: {
        // canvas — small node body. Tight padding, smaller text.
        canvas: 'p-2.5 text-xs',
        // panel — brief / recs / detail-panel. Roomier.
        panel: 'p-3.5 text-sm',
      },
    },
    defaultVariants: {
      state: 'inked',
      focus: 'none',
      interactive: false,
      density: 'panel',
    },
  },
);

type ArtifactCardVariants = VariantProps<typeof artifactCardVariants>;

interface ArtifactCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'type'>, ArtifactCardVariants {
  /** Artifact type — drives the accent colour. */
  type: ArtifactType | string;
}

/* ─── Root ─── */

export function ArtifactCard({
  type,
  state,
  focus,
  interactive,
  density,
  className,
  style,
  children,
  ...rest
}: ArtifactCardProps) {
  const accent = TYPE_ACCENT[type] ?? 'var(--border)';
  return (
    <div
      data-artifact-type={type}
      data-artifact-state={state ?? 'inked'}
      className={cn(artifactCardVariants({ state, focus, interactive, density }), className)}
      style={{ ...style, '--art-accent': accent } as React.CSSProperties}
      {...rest}
    >
      {/* Left ribbon strip — 3px of accent colour the full height. The
          ribbon is the "this is a <type>" hint that doesn't need a
          dedicated badge for canvas-density rendering. */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px] bg-[color:var(--art-accent)]"
      />
      <div className="pl-2.5">{children}</div>
    </div>
  );
}

/* ─── Slots ─── */

export function ArtifactCardHeader({
  title,
  type,
  state,
  children,
  className,
}: {
  /** Title text. Also rendered with .art-title so the cva strikethrough hits. */
  title: React.ReactNode;
  /** Repeating `type` here lets the header render the type chip / stamp without
   *  reaching back to the parent. */
  type: ArtifactType | string;
  state?: ArtifactCardVariants['state'];
  /** Slot for trailing content (chips, action buttons). */
  children?: React.ReactNode;
  className?: string;
}) {
  const accent = TYPE_ACCENT[type] ?? 'var(--border)';
  return (
    <div className={cn('flex items-start justify-between gap-2 mb-1', className)}>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          {/* Type chip — mono caps, accent-tinted */}
          <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: accent }}>
            {String(type).replace(/-/g, ' ')}
          </span>
          {state === 'drafted' && <Chip variant="active">DRAFT</Chip>}
          {state === 'superseded' && <Chip>SUPERSEDED</Chip>}
        </div>
        <div className="art-title font-semibold leading-tight tracking-tight truncate">{title}</div>
      </div>
      {children && <div className="shrink-0 flex items-center gap-1.5">{children}</div>}
    </div>
  );
}

export function ArtifactCardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('art-body text-muted-foreground leading-snug', className)}>{children}</div>
  );
}

export function ArtifactCardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center flex-wrap gap-1.5 mt-2 pt-2 border-t border-border/60',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── Convenience high-level shape ─── */

/**
 * SimpleArtifactCard — high-level shape for the most common case
 * (title + body + meta chips). Avoids slot composition for callers
 * that don't need custom layout.
 */
export function SimpleArtifactCard({
  type,
  state,
  focus,
  density,
  interactive,
  title,
  body,
  meta,
  trailing,
  onClick,
  className,
}: {
  type: ArtifactType | string;
  state?: ArtifactCardVariants['state'];
  focus?: ArtifactCardVariants['focus'];
  density?: ArtifactCardVariants['density'];
  interactive?: boolean;
  title: React.ReactNode;
  body?: React.ReactNode;
  meta?: string[];
  trailing?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <ArtifactCard
      type={type}
      state={state}
      focus={focus}
      density={density}
      interactive={interactive ?? !!onClick}
      onClick={onClick}
      className={className}
    >
      <ArtifactCardHeader title={title} type={type} state={state}>
        {trailing}
      </ArtifactCardHeader>
      {body && <ArtifactCardBody>{body}</ArtifactCardBody>}
      {meta && meta.length > 0 && (
        <ArtifactCardFooter>
          {meta.map((m) => (
            <Chip key={m}>{m}</Chip>
          ))}
        </ArtifactCardFooter>
      )}
    </ArtifactCard>
  );
}
