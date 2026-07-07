/**
 * The Tailwind v4 `@theme inline` utility-class mapping, transcribed verbatim
 * from `workspec/artifacts/workspec/src/index.css` (lines 17–81 as of
 * 2026-07-06) — 49 entries routing Tailwind's standard utility names
 * (`bg-background`, `text-primary`, `rounded-lg`, …) onto the console tokens
 * above. `src/generate/build-tailwind-css.ts` emits this as the package's
 * `tailwind.css` preset; `src/tokens/source-of-record/tailwind-mapping.test.ts`
 * checks it against the vendored segment.
 */
export interface TailwindMappingEntry {
  readonly name: string;
  readonly value: string;
  /** Comment appearing directly above this entry in the source, if any. */
  readonly comment?: string;
}

export const TAILWIND_MAPPING: readonly TailwindMappingEntry[] = [
  { name: '--color-background', value: 'var(--bg)' },
  { name: '--color-foreground', value: 'var(--ink)' },
  { name: '--color-border', value: 'var(--line)' },
  { name: '--color-input', value: 'var(--line)' },
  { name: '--color-ring', value: 'var(--accent)' },
  { name: '--color-card', value: 'var(--bg-elevated)' },
  { name: '--color-card-foreground', value: 'var(--ink)' },
  { name: '--color-card-border', value: 'var(--line)' },
  { name: '--color-panel-dark', value: 'var(--panel-dark)' },
  { name: '--color-popover', value: 'var(--bg-elevated)' },
  { name: '--color-popover-foreground', value: 'var(--ink)' },
  { name: '--color-popover-border', value: 'var(--line)' },
  {
    name: '--color-primary',
    value: 'var(--accent)',
    comment:
      'Primary = brand accent (green · #34d17f dark / #18804e light).\nbg-primary / text-primary are the brand-colored surfaces.\nForeground reads from --on-accent (#0a0a0c dark, #ffffff light).',
  },
  { name: '--color-primary-foreground', value: 'var(--on-accent)' },
  { name: '--color-primary-border', value: 'var(--accent)' },
  { name: '--color-secondary', value: 'var(--bg-soft)' },
  { name: '--color-secondary-foreground', value: 'var(--ink)' },
  { name: '--color-secondary-border', value: 'var(--line)' },
  { name: '--color-muted', value: 'var(--bg-soft)' },
  { name: '--color-muted-foreground', value: 'var(--ink-soft)' },
  { name: '--color-muted-border', value: 'var(--line)' },
  { name: '--color-accent', value: 'var(--accent)' },
  { name: '--color-accent-foreground', value: 'var(--on-accent)' },
  { name: '--color-accent-border', value: 'var(--accent)' },
  { name: '--color-destructive', value: 'var(--danger)' },
  { name: '--color-destructive-foreground', value: 'var(--on-accent)' },
  { name: '--color-destructive-border', value: 'var(--danger)' },
  { name: '--color-sidebar', value: 'var(--bg-soft)' },
  { name: '--color-sidebar-foreground', value: 'var(--ink)' },
  { name: '--color-sidebar-border', value: 'var(--line)' },
  { name: '--color-sidebar-primary', value: 'var(--accent)' },
  { name: '--color-sidebar-primary-foreground', value: 'var(--on-accent)' },
  { name: '--color-sidebar-primary-border', value: 'var(--accent)' },
  { name: '--color-sidebar-accent', value: 'var(--bg-elevated)' },
  { name: '--color-sidebar-accent-foreground', value: 'var(--ink)' },
  { name: '--color-sidebar-accent-border', value: 'var(--line)' },
  { name: '--color-sidebar-ring', value: 'var(--accent)' },
  { name: '--color-hot', value: 'var(--accent)' },
  { name: '--color-hot-foreground', value: 'var(--on-accent)' },
  { name: '--color-agent', value: 'var(--agent)' },
  { name: '--color-agent-foreground', value: 'var(--bg)' },
  { name: '--color-ink', value: 'var(--ink)' },
  { name: '--color-ink-muted', value: 'var(--ink-soft)' },
  { name: '--font-sans', value: "var(--sans, 'Inter Tight', system-ui, sans-serif)" },
  { name: '--font-mono', value: "var(--mono, 'JetBrains Mono', ui-monospace, monospace)" },
  { name: '--radius-sm', value: 'var(--r-2)' },
  { name: '--radius-md', value: 'var(--r-3)' },
  { name: '--radius-lg', value: 'var(--r-4)' },
  { name: '--radius-xl', value: 'var(--r-5)' },
];
