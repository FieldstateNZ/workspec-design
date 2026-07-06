import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import tokens from '@workspec/design/tokens.json';
import { App } from './App';

describe('App', () => {
  it('renders the header, both theme panels, contrast, and logo-usage sections', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: '@workspec/design' })).toBeInTheDocument();
    expect(screen.getByTestId('theme-panel-console-dark')).toBeInTheDocument();
    expect(screen.getByTestId('theme-panel-console-light')).toBeInTheDocument();
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
});
