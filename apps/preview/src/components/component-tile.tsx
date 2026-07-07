import type { ComponentRegistryEntry } from '../component-registry';

interface ComponentTileProps {
  readonly entry: ComponentRegistryEntry;
}

/** One registry entry's live instance, boxed so overflowing content (open menus, portals) doesn't collide with neighbours. */
export function ComponentTile({ entry }: ComponentTileProps) {
  return (
    <div
      data-testid="component-tile"
      data-component-name={entry.name}
      className="min-w-0 rounded-md border border-border bg-card p-4"
    >
      <p className="mb-3 font-mono text-xs text-muted-foreground">{entry.name}</p>
      <div className="flex flex-wrap items-start gap-3">{entry.render()}</div>
    </div>
  );
}
