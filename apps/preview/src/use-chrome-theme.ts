import { useEffect, useState } from 'react';

type ChromeTheme = 'dark' | 'light';

/**
 * Controls the page **chrome's** theme only (header, section titles, footer)
 * — the two token panels are independently force-scoped (see `ThemePanel`)
 * and never move when this toggles. Sets both signals Tailwind's `dark:`
 * variant and this package's tokens both depend on: `data-theme` and the
 * `.dark` class (see the "dual-signal" rule in the theming contract).
 */
export function useChromeTheme(): readonly [ChromeTheme, () => void] {
  const [theme, setTheme] = useState<ChromeTheme>('dark');

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = theme;
    html.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggle = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  return [theme, toggle] as const;
}
