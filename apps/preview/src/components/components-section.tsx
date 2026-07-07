import { COMPONENT_REGISTRY } from '../component-registry';
import { ComponentThemePanel } from './component-theme-panel';

/**
 * The migrated `ui/` + `design/` component library (S4, workspec-design#5),
 * rendered in both themes side by side — same dual-panel mechanism as the
 * token panels above it, reused rather than reinvented.
 */
export function ComponentsSection() {
  return (
    <section data-testid="components-section" className="flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold">Components</h2>
        <p className="text-sm text-muted-foreground">
          Every migrated component ({COMPONENT_REGISTRY.length} total — see docs/inventory.md),
          rendered live from <code className="font-mono text-xs">@workspec/design/components</code>.
        </p>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <ComponentThemePanel theme="console-dark" title="console-dark" />
        <ComponentThemePanel theme="console-light" title="console-light" />
      </div>
    </section>
  );
}
