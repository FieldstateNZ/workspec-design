/**
 * Renders a (possibly multi-line) comment body as a CSS `/* ... *\/` block at
 * the given indent. Source comments transcribed into the token tables keep
 * their original line breaks (`\n`-joined) but not their original interior
 * alignment whitespace — this re-indents every continuation line uniformly
 * under the opening `/*` instead of reproducing the source's ad-hoc column
 * alignment, which the byte-compare test does not require (see
 * `docs/inventory.md` — the guarantee is name/value/order fidelity, not
 * whitespace fidelity).
 */
export function renderCssComment(comment: string, indent: string): string {
  const bodyLines = comment.split('\n');
  if (bodyLines.length === 1) {
    return `${indent}/* ${bodyLines[0]} */`;
  }
  const [first, ...rest] = bodyLines;
  return [`${indent}/* ${first}`, ...rest.map((line) => `${indent}   ${line}`), `${indent}*/`].join(
    '\n',
  );
}
