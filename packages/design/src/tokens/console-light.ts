import { PIPELINE_LIMIT_NOTE } from './shared-comments.js';
import type { ThemeDefinition } from './theme-definition.types.js';

/**
 * Transcribed verbatim from
 * `workspec/artifacts/workspec/src/styles/tokens/console-light.css` (extracted
 * 2026-07-06). Values, names, order, and comments must match
 * `src/tokens/source-of-record/console-light.css` exactly — the drift tests in
 * `src/tokens/source-of-record.test.ts` enforce this on every test run.
 */
export const CONSOLE_LIGHT_THEME: ThemeDefinition = {
  name: 'console-light',
  selector: '[data-aesthetic="console"][data-theme="light"]',
  titleComment: 'WorkSpec · Console · Light — brand guidelines v1',
  blocks: [
    {
      sections: [
        {
          comment:
            'surface ramp — neutral gray-white (guidelines v1: cool, not cream)\n--bg            page/shell bg      (softest light)\n--bg-soft       mid surface        (recessed wells / secondary panels)\n--bg-elevated   cards / popovers   (white — most elevated)\n--bg-elev aliases --bg-elevated for guideline SVG compatibility.',
          tokens: [
            { name: '--bg', value: '#f6f6f7' },
            { name: '--bg-soft', value: '#fafafb' },
            { name: '--bg-elevated', value: '#ffffff' },
            { name: '--bg-elev', value: 'var(--bg-elevated)' },
            { name: '--panel-dark', value: '#f1f1f4' },
            { name: '--line', value: '#e4e4e7' },
            { name: '--line-2', value: '#d1d1d6' },
          ],
        },
        {
          comment: 'ink',
          tokens: [
            { name: '--ink', value: '#0a0a0c' },
            { name: '--ink-soft', value: '#4a4a52' },
            { name: '--ink-muted', value: '#76767c' },
            { name: '--ink-fade', value: '#76767c' },
            { name: '--ink-ghost', value: '#b8b8be' },
          ],
        },
        {
          comment: 'accent — green, deepened for contrast on light',
          tokens: [
            { name: '--accent', value: '#1b8a55' },
            { name: '--accent-deep', value: '#0e3b2a' },
            { name: '--accent-soft', value: 'rgba(27,138,85,0.10)' },
            { name: '--accent-mid', value: 'rgba(27,138,85,0.30)' },
          ],
        },
        {
          comment: 'agent — teal, distinct from green accent',
          tokens: [
            { name: '--agent', value: '#0d8a72' },
            { name: '--agent-soft', value: 'rgba(13,138,114,0.08)' },
          ],
        },
        {
          comment: 'status',
          tokens: [
            { name: '--warn', value: '#c89216' },
            { name: '--danger', value: '#c43a3a' },
            { name: '--danger-soft', value: 'rgba(196,58,58,0.08)' },
          ],
        },
        {
          comment: 'on-accent — white on dark green (#1b8a55) for WCAG contrast',
          tokens: [{ name: '--on-accent', value: '#ffffff' }],
        },
        {
          comment: 'sticky note variants — vibrant paper, like fresh Post-Its on a whiteboard',
          tokens: [
            { name: '--sticky-yellow-bg', value: '#ffe566' },
            { name: '--sticky-yellow-ink', value: '#5a3d00' },
            { name: '--sticky-yellow-edge', value: '#d9c238' },
            { name: '--sticky-pink-bg', value: '#ffa8c4' },
            { name: '--sticky-pink-ink', value: '#6e1a3e' },
            { name: '--sticky-pink-edge', value: '#e07b9d' },
            { name: '--sticky-green-bg', value: '#a5e8a8' },
            { name: '--sticky-green-ink', value: '#1a4a1a' },
            { name: '--sticky-green-edge', value: '#76c878' },
            { name: '--sticky-blue-bg', value: '#a0d2f0' },
            { name: '--sticky-blue-ink', value: '#0e3a6b' },
            { name: '--sticky-blue-edge', value: '#6fb0dc' },
            { name: '--sticky-orange-bg', value: '#ffba7a' },
            { name: '--sticky-orange-ink', value: '#6b3208' },
            { name: '--sticky-orange-edge', value: '#e69140' },
            { name: '--sticky-purple-bg', value: '#d4b8eb' },
            { name: '--sticky-purple-ink', value: '#3d1c6b' },
            { name: '--sticky-purple-edge', value: '#ad8ad0' },
          ],
        },
        {
          comment:
            'sticky on-note content blocks (tags / reactions) — ink-derived so they stay\nlegible on the elevated paper surface in both themes.',
          tokens: [
            { name: '--sticky-tag-fill', value: 'color-mix(in oklab, var(--ink) 8%, transparent)' },
            {
              name: '--sticky-tag-line',
              value: 'color-mix(in oklab, var(--ink) 16%, transparent)',
            },
            {
              name: '--sticky-reaction-fill',
              value: 'color-mix(in oklab, var(--ink) 6%, transparent)',
            },
          ],
        },
        {
          comment:
            'index-card note (#357) — intentional warm analog paper, theme-independent.\nHeld as tokens so the component stays hex-free; the same values repeat in\ndark because an index card is its own light surface (dark ink on warm paper\nstays high-contrast on either canvas).',
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
            'photo note (#358) — a physical print: white mount, neutral placeholder fill,\nand a cool-grey camera glyph. Theme-independent like the index card.',
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
            'Prototype Builder component fidelity (#368) — the two columns the Sketch ⇄\nStructured lens flips between. Sketch is a flat grayscale wireframe (hard\nradius, no colour); Structured is a real component (Console-green primary,\nrounded, soft shadow). Prototype screens stay light-surfaced in BOTH app\nthemes, so these are defined identically in console-dark.css (same pattern\nas the index-card and photo-note tokens above).',
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
          comment: 'canvas',
          tokens: [
            { name: '--canvas-bg', value: '#fafafb' },
            { name: '--canvas-grid-major', value: 'rgba(0,0,0,0.07)' },
            { name: '--canvas-grid-minor', value: 'rgba(0,0,0,0.030)' },
          ],
        },
        {
          comment: 'legacy gradient tokens',
          tokens: [
            { name: '--canvas-from', value: '#f6f6f7' },
            { name: '--canvas-to', value: '#ffffff' },
            { name: '--canvas-grid', value: 'rgba(0,0,0,0.04)' },
          ],
        },
        {
          comment: 'artifact type colors — deepened for legibility on light',
          tokens: [
            { name: '--type-persona', value: '#3a6ea5' },
            { name: '--type-feature', value: '#1f8a6a' },
            { name: '--type-scenario', value: '#a07a14' },
            { name: '--type-userreq', value: '#b04848' },
          ],
        },
        {
          comment: 'Discovery note type colors — typed-artifact rail + eyebrow (#360)',
          tokens: [
            { name: '--type-need', value: '#3a6ea5' },
            { name: '--type-idea', value: '#a07a14' },
            { name: '--type-pain', value: '#b04848' },
            { name: '--type-q', value: '#7a4fa6' },
          ],
        },
        {
          comment: 'derived',
          tokens: [
            { name: '--accent-hover', value: '#157849' },
            { name: '--accent-wash', value: 'rgba(27,138,85,0.08)' },
            { name: '--agent-mid', value: 'rgba(13,138,114,0.4)' },
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
            { name: '--sh-1', value: '0 1px 0 rgba(0,0,0,0.06)' },
            { name: '--sh-2', value: '0 2px 8px rgba(0,0,0,0.08)' },
            { name: '--sh-3', value: '0 8px 24px rgba(0,0,0,0.10)' },
            { name: '--sh-glow', value: '0 0 0 1px var(--accent), 0 0 24px rgba(27,138,85,0.16)' },
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
  ],
};
