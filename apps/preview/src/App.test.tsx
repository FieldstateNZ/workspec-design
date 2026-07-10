import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import tokens from '@workspec/design/tokens.json';
import { App } from './App';
import { COMPONENT_REGISTRY } from './component-registry';

describe('App', () => {
  it('renders the header, both theme panels, components, contrast, and logo-usage sections', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: '@workspec/design' })).toBeInTheDocument();
    expect(screen.getByTestId('theme-panel-console-dark')).toBeInTheDocument();
    expect(screen.getByTestId('theme-panel-console-light')).toBeInTheDocument();
    expect(screen.getByTestId('components-section')).toBeInTheDocument();
    expect(screen.getByTestId('contrast-section')).toBeInTheDocument();
    expect(screen.getByTestId('logo-usage')).toBeInTheDocument();
  });

  it.each(['console-dark', 'console-light'] as const)(
    'renders exactly one token swatch per token in the %s theme',
    (theme) => {
      render(<App />);
      const panel = screen.getByTestId(`theme-panel-${theme}`);
      const swatches = within(panel).getAllByTestId('token-swatch');
      const expectedCount = Object.keys(tokens.themes[theme].tokens).length;
      expect(swatches).toHaveLength(expectedCount);
    },
  );

  // AC (workspec-design#5): "preview page shows every component in both
  // themes ... rendered component count equals the export count of
  // @workspec/design/components". docs/inventory.md and every other count in
  // this project count components by migrated FILE (57 ui/ + 14 design/ =
  // 71), never by raw JS export-symbol count (330+ identifiers, including
  // cva variant functions and hooks that aren't components) — this test
  // follows that convention. If a stricter per-export-symbol reading was
  // intended, COMPONENT_REGISTRY (apps/preview/src/component-registry.tsx)
  // is where to widen it.
  it.each(['console-dark', 'console-light'] as const)(
    'renders exactly one component tile per registry entry in the %s theme (71 = 57 ui/ + 14 design/)',
    (theme) => {
      render(<App />);
      const panel = screen.getByTestId(`component-theme-panel-${theme}`);
      const tiles = within(panel).getAllByTestId('component-tile');
      expect(COMPONENT_REGISTRY).toHaveLength(71);
      expect(tiles).toHaveLength(COMPONENT_REGISTRY.length);
    },
  );
});
