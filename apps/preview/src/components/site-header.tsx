import { REPO_LINKS } from '../repo-links';
import { WorkspecMarkIcon } from './workspec-mark-icon';

interface SiteHeaderProps {
  readonly chromeTheme: 'dark' | 'light';
  readonly onToggleChromeTheme: () => void;
}

/**
 * The page chrome header: the WorkSpec mark, title, a link to the source
 * repo, the dual-signal theming note (linking out to the theming contract
 * doc), and the chrome-only theme toggle. Never affects the two forced
 * theme panels below it.
 */
export function SiteHeader({ chromeTheme, onToggleChromeTheme }: SiteHeaderProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-border pb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <WorkspecMarkIcon className="text-accent" />
          <div>
            <h1 className="text-xl font-semibold">@workspec/design</h1>
            <p className="text-sm text-muted-foreground">Token &amp; theme preview</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={REPO_LINKS.repo}
            className="text-sm text-primary underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            Source on GitHub
          </a>
          <button
            type="button"
            onClick={onToggleChromeTheme}
            className="rounded-md bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
          >
            Chrome theme: {chromeTheme}
          </button>
        </div>
      </div>

      <p className="max-w-3xl text-sm text-muted-foreground">
        Every value below is read live from{' '}
        <code className="font-mono text-xs">@workspec/design/tokens.json</code>. The two panels are
        each force-scoped to their own theme via the{' '}
        <code className="font-mono text-xs">[data-aesthetic][data-theme]</code> selector — see the{' '}
        <a
          href={REPO_LINKS.theming}
          className="underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          theming contract
        </a>{' '}
        for the dual-signal rule (<code className="font-mono text-xs">data-theme</code> +{' '}
        <code className="font-mono text-xs">.dark</code>) this page's own chrome toggle above
        follows.
      </p>
    </header>
  );
}
