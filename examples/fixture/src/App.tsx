import { useEffect, useState } from 'react';
import { ComponentsPage } from './components-page';

type Theme = 'dark' | 'light';

/**
 * The S1 acceptance fixture page. Proves, in a real Tailwind v4 build:
 * Tailwind utilities generated from `@workspec/design`'s mapping
 * (`bg-background`, `font-sans`, `bg-primary`/`text-primary-foreground`),
 * tokens read directly as `var(--accent)`/`var(--ink)`, and the four
 * self-hosted font families — see tests/smoke.spec.ts for the assertions.
 * The toggle button flips both `data-theme` and `.dark` together, the same
 * dual-signal contract the enterprise app uses (docs/inventory.md).
 */
export function App() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = theme;
    html.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <main className="min-h-screen space-y-6 bg-background p-8 text-foreground">
      <h1 className="font-sans text-2xl font-semibold">@workspec/design fixture</h1>

      <button
        type="button"
        data-testid="theme-toggle"
        onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Toggle theme (currently {theme})
      </button>

      <div
        data-testid="primary-swatch"
        className="rounded-md bg-primary p-4 text-primary-foreground"
      >
        Tailwind utilities: bg-primary / text-primary-foreground
      </div>

      <p data-testid="raw-accent" style={{ color: 'var(--accent)' }}>
        Raw var(--accent) text.
      </p>
      <p style={{ color: 'var(--ink)' }}>Raw var(--ink) text.</p>

      <p className="font-mono">JetBrains Mono sample text (font-mono).</p>
      <p style={{ fontFamily: "'Caveat', cursive" }}>Caveat handwriting sample.</p>

      <ComponentsPage />
    </main>
  );
}
