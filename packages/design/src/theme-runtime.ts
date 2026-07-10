/**
 * The single source of truth for reading/writing WorkSpec's theme signals in
 * a browser host — one storage key, one place that writes `data-aesthetic` +
 * `data-theme` + the `.dark` class together. Written to close the gap
 * `docs/theming.md` warns about (D22: a code path that wrote only one signal,
 * or a second storage key, let the two desync) and the one this package's own
 * consumers (workspec-studio's site shell, the Decisions/C4 embeds) were each
 * solving independently with their own `matchMedia` listener before this
 * existed. See `use-theme.ts` for the React-side reader.
 */

export type ThemeMode = 'dark' | 'light';

/** The one persisted-preference key every WorkSpec host should read/write — never a second one. */
export const THEME_STORAGE_KEY = 'workspec.theme';

/** Fired on `window` whenever `setTheme()`/`initTheme()` change the theme, for same-tab listeners. */
export const THEME_CHANGE_EVENT = 'workspec:theme-change';

interface StoredThemePayload {
  readonly theme?: unknown;
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'dark' || value === 'light';
}

function readStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw) as StoredThemePayload;
    return isThemeMode(parsed.theme) ? parsed.theme : null;
  } catch {
    return null;
  }
}

function systemTheme(): ThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDocument(theme: ThemeMode): void {
  // No-op off the DOM (SSR/non-browser): setTheme()/initTheme() call this
  // before their own window guards, so a library consumer importing and
  // calling them server-side must not hit a `document` ReferenceError.
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-aesthetic', 'console');
  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark', theme === 'dark');
}

/** The theme a page should render on first paint: the stored preference, else the OS setting. */
export function resolveInitialTheme(): ThemeMode {
  return readStoredTheme() ?? systemTheme();
}

/**
 * Sets WorkSpec's theme, everywhere, in one call: `data-aesthetic` +
 * `data-theme` + the `.dark` class on `<html>`, and the one persisted
 * preference key. Call this from a toggle; never set the attributes, the
 * class, or the storage key individually — that's exactly the split that let
 * D22 happen.
 */
export function setTheme(theme: ThemeMode): void {
  applyThemeToDocument(theme);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({ theme }));
    } catch {
      // localStorage unavailable (private mode, disabled storage) — the
      // in-page signals above are already applied; persistence is best-effort.
    }
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT));
  }
}

/**
 * Applies the initial theme immediately and, only while no preference is
 * stored, keeps the page's theme signals following `prefers-color-scheme`
 * live. This is the ONE place in a WorkSpec host that should call
 * `matchMedia` for theming — every other consumer (including embedded
 * modules) should read the current theme via {@link useTheme} instead of
 * running its own OS-preference listener. Once a preference is stored (the
 * user toggled via `setTheme()`), OS changes stop driving the page. Call
 * once, near app startup; returns a cleanup function.
 */
export function initTheme(): () => void {
  applyThemeToDocument(resolveInitialTheme());
  if (typeof window === 'undefined') {
    return () => {};
  }

  // Cross-tab sync: another tab's `setTheme()` writes THEME_STORAGE_KEY, which
  // fires a `storage` event here (never in the writing tab). Re-resolve and
  // re-apply so this tab's `data-theme`/`.dark` follow, and dispatch
  // THEME_CHANGE_EVENT so `useTheme()` readers update. Without this, the docs'
  // promised cross-tab preference sync never reached a receiving tab — nothing
  // updated `data-theme`, so `useTheme()` (which only reads it) stayed stale.
  const onStorage = (event: StorageEvent): void => {
    // `key` is null on localStorage.clear(); treat that as "re-resolve too".
    if (event.key !== null && event.key !== THEME_STORAGE_KEY) return;
    applyThemeToDocument(resolveInitialTheme());
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT));
  };
  window.addEventListener('storage', onStorage);

  if (typeof window.matchMedia !== 'function') {
    return () => window.removeEventListener('storage', onStorage);
  }
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = (event: MediaQueryListEvent): void => {
    if (readStoredTheme() !== null) return; // an explicit preference now exists — stop following the OS
    applyThemeToDocument(event.matches ? 'dark' : 'light');
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT));
  };
  mql.addEventListener('change', onChange);
  return () => {
    window.removeEventListener('storage', onStorage);
    mql.removeEventListener('change', onChange);
  };
}

/**
 * The no-flash inline-script contract from `docs/theming.md`, as a ready
 * string — for a host to drop into a synchronous `<script>` in `<head>`
 * before any stylesheet or app bundle loads, so it never has to hand-transcribe
 * (and risk drifting from) the storage key or the attribute/class pair.
 */
export const NO_FLASH_SCRIPT = `(function(){var r=document.documentElement,t='dark';function sys(){return (typeof window.matchMedia==='function'&&!window.matchMedia('(prefers-color-scheme: dark)').matches)?'light':'dark';}try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)}));t=(s&&(s.theme==='light'||s.theme==='dark'))?s.theme:sys();}catch(e){t=sys();}r.setAttribute('data-aesthetic','console');r.setAttribute('data-theme',t);r.classList.toggle('dark',t==='dark');})();`;
