import { tokensJson } from '../tokens-data';

/**
 * Reads the leading family out of a CSS font-stack token value, e.g.
 * `"'Inter Tight', system-ui, sans-serif"` -> `"Inter Tight"`. Assumes the
 * stack always leads with a single-quoted family name, which is how
 * packages/design/scripts/generate.ts emits every `--sans`/`--mono` value —
 * see packages/design/src/tokens/source-of-record.
 */
function firstFamily(fontStack: string): string {
  const family = /^'([^']+)'/.exec(fontStack)?.[1];
  if (family === undefined) {
    throw new Error(`expected a leading quoted font family in stack: "${fontStack}"`);
  }
  return family;
}

/**
 * Families already demoed via a typography token (`--sans`, `--mono`) —
 * derived from every theme's stacks in tokens.json rather than hand-listed,
 * so a token change can't silently double-list or drop a specimen below.
 */
const TOKEN_BOUND_FAMILIES = new Set(
  Object.values(tokensJson.themes).flatMap((theme) => [
    firstFamily(theme.tokens['--sans']),
    firstFamily(theme.tokens['--mono']),
  ]),
);

/**
 * The self-hosted font families that don't back a typography token (Caveat,
 * Lora) — read from `tokens.json`'s `fonts` summary, not hand-listed, so a
 * future font addition/removal shows up here automatically.
 */
export function FontSpecimens() {
  const extraFamilies = Object.keys(tokensJson.fonts).filter(
    (family) => !TOKEN_BOUND_FAMILIES.has(family),
  );

  return (
    <div className="mb-6 flex flex-col gap-2" data-testid="font-specimens">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Additional self-hosted faces
      </h3>
      <div className="token-swatch-grid">
        {extraFamilies.map((family) => (
          <div
            key={family}
            className="flex flex-col gap-1.5 rounded-md border border-border bg-card p-3 text-xs"
          >
            <p className="truncate text-2xl" style={{ fontFamily: `'${family}'` }}>
              Ag Workspec 123
            </p>
            <span className="truncate text-foreground">{family}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
