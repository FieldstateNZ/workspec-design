import { THEME_SELECTORS, TOKEN_GROUP_IDS } from '@workspec/design';
import type { ThemeName } from '@workspec/design';
import { parseThemeSelector } from '../parse-theme-selector';
import { FontSpecimens } from './font-specimens';
import { TokenSection } from './token-section';

interface ThemePanelProps {
  readonly theme: ThemeName;
  readonly title: string;
}

/**
 * One theme, force-scoped to itself regardless of the page chrome's own
 * `data-theme`/`.dark` toggle — the panel sets `[data-aesthetic]`/
 * `[data-theme]` directly on its own root, which is exactly the selector
 * `@workspec/design/tokens.css` matches on (it isn't `<html>`-only), so both
 * themes render simultaneously side by side. The attribute values come from
 * `THEME_SELECTORS`, not a hand-picked guess at the theme's naming scheme.
 */
export function ThemePanel({ theme, title }: ThemePanelProps) {
  const { aesthetic, theme: mode } = parseThemeSelector(THEME_SELECTORS[theme]);

  return (
    <section
      data-aesthetic={aesthetic}
      data-theme={mode}
      data-testid={`theme-panel-${theme}`}
      className="min-w-0 flex-1 rounded-lg border border-border bg-background p-4 text-foreground"
    >
      <h2 className="mb-4 font-mono text-sm font-semibold tracking-wide">{title}</h2>
      {TOKEN_GROUP_IDS.map((groupId) => (
        <div key={groupId}>
          <TokenSection theme={theme} groupId={groupId} />
          {groupId === 'typography' && <FontSpecimens />}
        </div>
      ))}
    </section>
  );
}
