import { PIPELINE_LIMIT_NOTE } from './shared-comments.js';
import type { ThemeDefinition } from './theme-definition.types.js';

/**
 * Transcribed verbatim from
 * `workspec/artifacts/workspec/src/styles/tokens/console-dark.css` (extracted
 * 2026-07-06). Values, names, order, and comments must match
 * `src/tokens/source-of-record/console-dark.css` exactly — the drift tests in
 * `src/tokens/source-of-record.test.ts` enforce this on every test run.
 *
 * The final block (`el-*` tokens) is the one documented EXCEPTION to that
 * extraction discipline: a workspec-studio addition with no WorkSpec
 * Enterprise source, added to unify C4's and Decisions' per-kind accents
 * behind one token vocabulary (see the Site Review UX pass, finding 01/02).
 * `source-of-record/console-dark.css` carries the identical block, flagged
 * the same way, purely so the fidelity tests stay meaningful for the other
 * 124 tokens.
 */
export const CONSOLE_DARK_THEME: ThemeDefinition = {
  name: 'console-dark',
  selector: '[data-aesthetic="console"][data-theme="dark"]',
  titleComment: 'WorkSpec · Console · Dark — brand guidelines v1',
  blocks: [
    {
      sections: [
        {
          comment:
            'surface ramp (guidelines v1 convention):\n--bg            shell / page bg    (DARKEST — recedes behind content)\n--bg-soft       mid surface        (between shell and cards)\n--bg-elevated   cards / panels     (LIGHTEST — floated above shell)\n--bg-elev aliases --bg-elevated for guideline SVG compatibility.',
          tokens: [
            { name: '--bg', value: '#0a0a0c' },
            { name: '--bg-soft', value: '#16161a' },
            { name: '--bg-elevated', value: '#1c1c22' },
            { name: '--bg-elev', value: 'var(--bg-elevated)' },
            { name: '--panel-dark', value: '#141419' },
            { name: '--line', value: '#26262c' },
            { name: '--line-2', value: '#34343d' },
          ],
        },
        {
          comment: 'ink',
          tokens: [
            { name: '--ink', value: '#e8e8ea' },
            { name: '--ink-soft', value: '#a4a4ac' },
            { name: '--ink-muted', value: '#72727a' },
            { name: '--ink-fade', value: '#62626a' },
            { name: '--ink-ghost', value: '#3a3a42' },
          ],
        },
        {
          comment: 'accent — brand green',
          tokens: [
            { name: '--accent', value: '#34d17f' },
            { name: '--accent-deep', value: '#1b8a55' },
            { name: '--accent-soft', value: 'rgba(52,209,127,0.14)' },
            { name: '--accent-mid', value: 'rgba(52,209,127,0.35)' },
          ],
        },
        {
          comment: 'agent — teal mint, distinct from brand green',
          tokens: [
            { name: '--agent', value: '#5cf2c0' },
            { name: '--agent-soft', value: 'rgba(92,242,192,0.10)' },
          ],
        },
        {
          comment: 'status',
          tokens: [
            { name: '--warn', value: '#f2c94c' },
            { name: '--danger', value: '#ff5a5a' },
            { name: '--danger-soft', value: 'rgba(255,90,90,0.10)' },
          ],
        },
        {
          comment: 'on-accent — dark ink on bright green fill',
          tokens: [{ name: '--on-accent', value: '#0a0a0c' }],
        },
        {
          comment: 'sticky note variants — luminous paper, dimmed for the dark canvas',
          tokens: [
            { name: '--sticky-yellow-bg', value: '#d4b94d' },
            { name: '--sticky-yellow-ink', value: '#1f1500' },
            { name: '--sticky-yellow-edge', value: '#b89e3a' },
            { name: '--sticky-pink-bg', value: '#d490a8' },
            { name: '--sticky-pink-ink', value: '#2e0e22' },
            { name: '--sticky-pink-edge', value: '#b87890' },
            { name: '--sticky-green-bg', value: '#8ec98e' },
            { name: '--sticky-green-ink', value: '#0d2a0d' },
            { name: '--sticky-green-edge', value: '#6fab6f' },
            { name: '--sticky-blue-bg', value: '#88b8d8' },
            { name: '--sticky-blue-ink', value: '#0a2244' },
            { name: '--sticky-blue-edge', value: '#6ea0c0' },
            { name: '--sticky-orange-bg', value: '#d99e64' },
            { name: '--sticky-orange-ink', value: '#2a1308' },
            { name: '--sticky-orange-edge', value: '#b78248' },
            { name: '--sticky-purple-bg', value: '#b89cd0' },
            { name: '--sticky-purple-ink', value: '#1f0d40' },
            { name: '--sticky-purple-edge', value: '#9a82b0' },
          ],
        },
        {
          comment:
            'sticky on-note content blocks (tags / reactions) — ink-derived, lifted a\ntouch vs light so the pills read on the dark elevated paper.',
          tokens: [
            {
              name: '--sticky-tag-fill',
              value: 'color-mix(in oklab, var(--ink) 12%, transparent)',
            },
            {
              name: '--sticky-tag-line',
              value: 'color-mix(in oklab, var(--ink) 22%, transparent)',
            },
            {
              name: '--sticky-reaction-fill',
              value: 'color-mix(in oklab, var(--ink) 9%, transparent)',
            },
          ],
        },
        {
          comment:
            "index-card note (#357) — kept as the same warm paper as light on purpose:\nit's an analog artefact and reads as its own light surface on the dark\ncanvas. Dark ink (#2a2a2a) on #fbfaf5 stays high-contrast, so no separate\ndark ramp is needed — only the surrounding shadow differs (via --sh-2).",
          tokens: [
            { name: '--index-paper', value: '#fbfaf5' },
            { name: '--index-edge', value: '#e6e0cf' },
            { name: '--index-ink', value: '#2a2a2a' },
            { name: '--index-rule', value: '#d9e3ec' },
            { name: '--index-margin', value: '#e3a9a0' },
          ],
        },
        {
          comment:
            'photo note (#358) — physical print, kept identical to light on purpose (the\nwhite mount + caption are the artefact, not theme chrome).',
          tokens: [
            { name: '--photo-mount', value: '#ffffff' },
            { name: '--photo-ink', value: '#222222' },
            { name: '--photo-caption', value: '#333333' },
            { name: '--photo-placeholder', value: '#cfd4da' },
            { name: '--photo-glyph', value: '#7d858f' },
          ],
        },
      ],
    },
    {
      precedingComment: PIPELINE_LIMIT_NOTE,
      sections: [
        {
          comment:
            "Prototype Builder component fidelity (#368) — kept identical to console-light\non purpose: prototype screens are intentionally light-surfaced in both app\nthemes, so the Sketch ⇄ Structured fidelity values don't change with the dark\ncanvas (same rationale as the index-card and photo-note tokens above).",
          tokens: [
            { name: '--wf-sketch-border', value: '#c4c7d0' },
            { name: '--wf-sketch-border-strong', value: '#abafb9' },
            { name: '--wf-sketch-fill', value: '#edeef1' },
            { name: '--wf-sketch-text', value: '#6b7280' },
            { name: '--wf-sketch-strong', value: '#4b5563' },
            { name: '--wf-sketch-placeholder', value: '#9aa0ad' },
            { name: '--wf-sketch-surface', value: '#ffffff' },
            { name: '--wf-sketch-primary', value: '#dcdfe5' },
            { name: '--wf-sketch-primary-text', value: '#4b5563' },
            { name: '--wf-sketch-primary-soft', value: '#e9ebef' },
            { name: '--wf-sketch-radius', value: '4px' },
            { name: '--wf-sketch-shadow', value: 'none' },
            { name: '--wf-hifi-border', value: '#e4e4e7' },
            { name: '--wf-hifi-border-strong', value: '#d4d4d8' },
            { name: '--wf-hifi-fill', value: '#f4f4f5' },
            { name: '--wf-hifi-text', value: '#3f3f46' },
            { name: '--wf-hifi-strong', value: '#18181b' },
            { name: '--wf-hifi-placeholder', value: '#a1a1aa' },
            { name: '--wf-hifi-surface', value: '#ffffff' },
            { name: '--wf-hifi-primary', value: '#1b8a55' },
            { name: '--wf-hifi-primary-text', value: '#ffffff' },
            { name: '--wf-hifi-primary-soft', value: 'rgba(27,138,85,.12)' },
            { name: '--wf-hifi-radius', value: '9px' },
            { name: '--wf-hifi-shadow', value: '0 1px 3px rgba(0,0,0,.09)' },
          ],
        },
      ],
    },
    {
      sections: [
        {
          comment: 'canvas — architectural blueprint surface',
          tokens: [
            { name: '--canvas-bg', value: '#0d0d10' },
            { name: '--canvas-grid-major', value: 'rgba(255,255,255,0.06)' },
            { name: '--canvas-grid-minor', value: 'rgba(255,255,255,0.025)' },
          ],
        },
        {
          comment: 'legacy gradient tokens — paper.css radial wash',
          tokens: [
            { name: '--canvas-from', value: '#16161a' },
            { name: '--canvas-to', value: '#1c1c22' },
            { name: '--canvas-grid', value: 'rgba(255,255,255,0.02)' },
          ],
        },
        {
          comment: 'artifact type colors',
          tokens: [
            { name: '--type-persona', value: '#9ec6ff' },
            { name: '--type-feature', value: '#5cf2c0' },
            { name: '--type-scenario', value: '#f2c94c' },
            { name: '--type-userreq', value: '#ff8e8e' },
          ],
        },
        {
          comment: 'Discovery note type colors — typed-artifact rail + eyebrow (#360)',
          tokens: [
            { name: '--type-need', value: '#9ec6ff' },
            { name: '--type-idea', value: '#f2c94c' },
            { name: '--type-pain', value: '#ff8e8e' },
            { name: '--type-q', value: '#c9a6ff' },
          ],
        },
        {
          comment: 'derived',
          tokens: [
            { name: '--accent-hover', value: '#52e891' },
            { name: '--accent-wash', value: 'rgba(52,209,127,0.06)' },
            { name: '--agent-mid', value: 'rgba(92,242,192,0.4)' },
          ],
        },
        {
          comment: 'type',
          tokens: [
            { name: '--sans', value: "'Inter Tight', system-ui, sans-serif" },
            { name: '--mono', value: "'JetBrains Mono', ui-monospace, monospace" },
            { name: '--font-body', value: 'var(--sans)' },
            { name: '--font-display', value: 'var(--sans)' },
          ],
        },
        {
          comment: 'space — 4px base',
          tokens: [
            { name: '--s-1', value: '4px' },
            { name: '--s-2', value: '8px' },
            { name: '--s-3', value: '12px' },
            { name: '--s-4', value: '16px' },
            { name: '--s-5', value: '20px' },
            { name: '--s-6', value: '24px' },
            { name: '--s-8', value: '32px' },
            { name: '--s-10', value: '40px' },
            { name: '--s-12', value: '48px' },
            { name: '--s-16', value: '64px' },
            { name: '--s-20', value: '80px' },
          ],
        },
        {
          comment: 'radius',
          tokens: [
            { name: '--r-1', value: '3px' },
            { name: '--r-2', value: '4px' },
            { name: '--r-3', value: '6px' },
            { name: '--r-4', value: '8px' },
            { name: '--r-5', value: '12px' },
            { name: '--r-pill', value: '99px' },
          ],
        },
        {
          comment: 'shadow',
          tokens: [
            { name: '--sh-1', value: '0 1px 0 rgba(0,0,0,0.4)' },
            { name: '--sh-2', value: '0 2px 8px rgba(0,0,0,0.45)' },
            { name: '--sh-3', value: '0 8px 24px rgba(0,0,0,0.5)' },
            { name: '--sh-glow', value: '0 0 0 1px var(--accent), 0 0 24px rgba(52,209,127,0.18)' },
          ],
        },
        {
          comment: 'motion',
          tokens: [
            { name: '--ease-out', value: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
            { name: '--ease-in-out', value: 'cubic-bezier(0.5, 0, 0.5, 1)' },
            { name: '--d-fast', value: '120ms' },
            { name: '--d-base', value: '180ms' },
            { name: '--d-slow', value: '280ms' },
          ],
        },
      ],
    },
    {
      precedingComment: PIPELINE_LIMIT_NOTE,
      sections: [
        {
          comment:
            'C4 element-kind colors (workspec-studio addition, NOT extracted from\nWorkSpec Enterprise — see the file header). One accent per C4 element kind,\nreplacing the hardcoded hues in @workspec/c4-ui\'s style/spec-defaults.ts so\nC4 and Decisions share one token vocabulary. A kind that already has a\nDecisions-side analog reuses that token instead of duplicating it here\n(a C4 "feature"/"component" node uses --type-feature, not a new token).',
          tokens: [
            { name: '--el-actor', value: '#4A90D9' },
            { name: '--el-system', value: '#1168BD' },
            { name: '--el-external-system', value: '#64748b' },
            { name: '--el-container', value: 'hsl(214 88% 51%)' },
            { name: '--el-database', value: 'hsl(186 79% 35%)' },
            { name: '--el-queue', value: 'hsl(280 50% 55%)' },
            { name: '--el-domain', value: 'hsl(150 35% 38%)' },
            { name: '--el-class', value: 'hsl(262 52% 58%)' },
            { name: '--el-interface', value: 'hsl(199 65% 48%)' },
            { name: '--el-function', value: 'hsl(150 45% 42%)' },
          ],
        },
        {
          comment:
            'C4 element-grammar derivation percentages (workspec-studio addition,\npromoted from @workspec/c4-ui\'s style/element-tints.ts so Decisions\' option\ncards can share the exact same accent -> tinted-surface / tinted-border /\neyebrow rule). Consumed via color-mix(in oklab, <accent> var(--el-tint-*), ...).\nDark values are already tuned for the dark canvas, so no separate\naccent-lift step is needed on top of these (c4-ui\'s old +22%-toward-white\nlift is retired now that --el-* itself resolves per theme).',
          tokens: [
            { name: '--el-tint-surface', value: '14%' },
            { name: '--el-tint-border', value: '34%' },
            { name: '--el-tint-eyebrow', value: '100%' },
            { name: '--el-tint-ink-dim', value: '62%' },
          ],
        },
      ],
    },
  ],
  trailingComment:
    "Three orphaned reset rules from the original design-handoff CSS\nwere here (`*{box-sizing:...}`, `body{...}`, `a{color:inherit}`).\nRemoved — they belong in `@layer base` not in a token file, and\ncrucially the unlayered `a{color:inherit}` was beating Tailwind's\n`.text-primary-foreground` utility in v4's layer cascade, causing\n<Button asChild><Link/></Button> to render white-on-coral instead\nof ink-on-coral. Tailwind's preflight + index.css's @layer base\nblock already cover the resets that actually matter.",
};
