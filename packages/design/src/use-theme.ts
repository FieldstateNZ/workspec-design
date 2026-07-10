import { useEffect, useState } from 'react';
import { THEME_CHANGE_EVENT } from './theme-runtime.js';
import type { ThemeMode } from './theme-runtime.js';

function currentTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/**
 * The current theme, reactive to any change made via `setTheme()`/`initTheme()`
 * anywhere on the page — a shell's Dark/Light toggle, an OS preference change
 * `initTheme()` is following, a cross-tab preference change. Deliberately
 * does NOT call `matchMedia` itself: it only reads the `data-theme` attribute
 * that `initTheme()`/`setTheme()` keep in sync, so every consumer (including
 * an embedded module like `DecisionApp` or `C4Explorer`) agrees by
 * construction instead of running its own independent OS-preference
 * listener that could disagree with the shell around it.
 */
export function useTheme(): ThemeMode {
  const [theme, setThemeState] = useState<ThemeMode>(() => currentTheme());

  useEffect(() => {
    const sync = (): void => setThemeState(currentTheme());
    sync();
    // No `storage` listener here: this hook only reads `data-theme`, and a
    // cross-tab preference change reaches it through `initTheme()` (which
    // re-applies `data-theme` on `storage`) → the MutationObserver below.
    // Listening for `storage` directly did nothing (the attribute hadn't
    // changed yet) and risked double-firing once initTheme owns that path.
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => {
      observer.disconnect();
      window.removeEventListener(THEME_CHANGE_EVENT, sync);
    };
  }, []);

  return theme;
}
