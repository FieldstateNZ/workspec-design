import { REPO_LINKS } from '../repo-links';

/** License split note — Apache-2.0 for code/tokens, trademarked brand assets. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border pt-4 text-xs text-muted-foreground">
      <p>
        Code, tokens, and theme definitions are licensed Apache-2.0. The WorkSpec name, logo, and
        wordmark are trademarks and are not — see{' '}
        <a
          href={REPO_LINKS.repo}
          className="underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          NOTICE
        </a>{' '}
        in the source repo.
      </p>
    </footer>
  );
}
