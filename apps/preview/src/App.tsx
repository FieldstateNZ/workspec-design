import { ContrastSection } from './components/contrast-section';
import { LogoUsageSection } from './components/logo-usage-section';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';
import { ThemePanel } from './components/theme-panel';
import { useChromeTheme } from './use-chrome-theme';

/**
 * The `@workspec/design` token/theme preview — the system's visible home,
 * deployed to GitHub Pages. Every section is generated from
 * `@workspec/design/tokens.json` (see `src/tokens-data.ts` and
 * `components/token-section.tsx`); nothing here is a hand-written token list.
 */
export function App() {
  const [chromeTheme, toggleChromeTheme] = useChromeTheme();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 p-6">
      <SiteHeader chromeTheme={chromeTheme} onToggleChromeTheme={toggleChromeTheme} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <ThemePanel theme="console-dark" title="console-dark" />
        <ThemePanel theme="console-light" title="console-light" />
      </div>

      <ContrastSection />
      <LogoUsageSection />
      <SiteFooter />
    </main>
  );
}
