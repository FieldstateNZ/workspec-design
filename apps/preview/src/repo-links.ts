const REPO_URL = 'https://github.com/FieldstateNZ/workspec-design';

/**
 * Links into the source repo. `docs/theming.md` and `docs/contrast-audit.md`
 * are owned by a different delivery slice and don't exist in this workspace
 * yet, so this page can't import from or relatively link to them the way it
 * can for files it ships alongside — it links to their eventual GitHub blob
 * path instead, which resolves once those docs land on `main`.
 */
export const REPO_LINKS = {
  repo: REPO_URL,
  theming: `${REPO_URL}/blob/main/docs/theming.md`,
  contrastAudit: `${REPO_URL}/blob/main/docs/contrast-audit.md`,
} as const;
