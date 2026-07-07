import { THEME_SELECTORS } from '@workspec/design';
import type { ThemeName } from '@workspec/design';
import { COMPONENT_REGISTRY } from '../component-registry';
import { parseThemeSelector } from '../parse-theme-selector';
import { ComponentTile } from './component-tile';

interface ComponentThemePanelProps {
  readonly theme: ThemeName;
  readonly title: string;
}

/**
 * One theme's Components gallery — force-scoped to itself exactly like
 * ThemePanel (the token panel), so both themes render side by side
 * regardless of the page chrome's own toggle. Radix portal content (Dialog
 * overlays, Select viewports, ...) renders into `document.body`, outside
 * this scoped subtree — see design-shell.css / tokens.css's selectors,
 * which match on `[data-aesthetic][data-theme]` anywhere in the document,
 * not just this panel, so portaled content still resolves to the theme its
 * trigger panel activated last.
 */
export function ComponentThemePanel({ theme, title }: ComponentThemePanelProps) {
  const { aesthetic, theme: mode } = parseThemeSelector(THEME_SELECTORS[theme]);
  const groups = ['ui', 'design'] as const;

  return (
    <section
      data-aesthetic={aesthetic}
      data-theme={mode}
      data-testid={`component-theme-panel-${theme}`}
      className="min-w-0 flex-1 rounded-lg border border-border bg-background p-4 text-foreground"
    >
      <h3 className="mb-4 font-mono text-sm font-semibold tracking-wide">{title}</h3>
      {groups.map((group) => (
        <div key={group} className="mb-6">
          <h4 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {group === 'ui' ? 'ui/' : 'design/'}
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {COMPONENT_REGISTRY.filter((entry) => entry.group === group).map((entry) => (
              <ComponentTile key={entry.name} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
