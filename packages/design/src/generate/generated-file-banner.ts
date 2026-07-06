/**
 * Builds the "generated file" banner comment every committed CSS artifact
 * opens with. `bodyLines` documents what's specific to that artifact (its
 * source-of-truth module, any format notes); pass `''` for a blank line.
 */
export function buildGeneratedFileBanner(bodyLines: readonly string[]): string {
  const lines = [
    '/*',
    ' * GENERATED FILE — do not edit by hand.',
    ' * Regenerate with: pnpm --filter @workspec/design gen:tokens',
    ' *',
  ];
  for (const line of bodyLines) {
    lines.push(line === '' ? ' *' : ` * ${line}`);
  }
  lines.push(' */');
  return lines.join('\n');
}
