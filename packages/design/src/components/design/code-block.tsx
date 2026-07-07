/**
 * CodeBlock — the design's syntax-highlighted JSON/config snippet.
 *
 * Two ways to use it:
 *
 *   1. Pass `tokens` for hand-rolled JSON-ish output where you want
 *      explicit `.k` (key/blue) and `.s` (string/green) colouring,
 *      matching the design's `.codeblk` markup. This is what
 *      workspace-create's MCP config block uses.
 *
 *   2. Pass `children` for plain text (commands, paths, error
 *      output). Same surface, no token colouring.
 *
 * Surface matches Surf: rounded-md, border, bg-muted/40, mono.
 */
import type * as React from 'react';
import { cn } from '../../lib/utils';

type Token =
  | string
  | { k: string } // key — blue
  | { s: string } // string — emerald
  | { p: string } // punctuation / plain — muted
  | { c: string }; // comment — ink-fade italic

export function CodeBlock({
  tokens,
  children,
  className,
}: {
  tokens?: Token[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <pre
      className={cn(
        'rounded-md border bg-muted/40 p-3 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre',
        className,
      )}
    >
      {tokens ? renderTokens(tokens) : children}
    </pre>
  );
}

function renderTokens(tokens: Token[]) {
  const k = 'text-blue-600 dark:text-blue-300';
  const s = 'text-emerald-600 dark:text-emerald-400';
  const c = 'text-muted-foreground/70 italic';
  return tokens.map((t, i) => {
    if (typeof t === 'string') return <span key={i}>{t}</span>;
    if ('k' in t)
      return (
        <span key={i} className={k}>
          {t.k}
        </span>
      );
    if ('s' in t)
      return (
        <span key={i} className={s}>
          {t.s}
        </span>
      );
    if ('c' in t)
      return (
        <span key={i} className={c}>
          {t.c}
        </span>
      );
    return (
      <span key={i} className="text-muted-foreground">
        {t.p}
      </span>
    );
  });
}

/* ─── Helpers for the most common shape: an MCP config blob ─── */

/**
 * Render an MCP-config-shaped JSON object as tokens. The shape is:
 *
 *   { "mcpServers": { "<serverName>": { "url": "<url>" } } }
 *
 * or, for `chatgpt`-shaped configs:
 *
 *   { "name": "<serverName>", "url": "<url>" }
 *
 * Returns a token array suitable for <CodeBlock tokens={...}>.
 */
export function mcpConfigTokens(
  shape: 'mcpServers' | 'chatgpt',
  serverName: string,
  url: string,
): Token[] {
  if (shape === 'chatgpt') {
    return [
      '{\n  ',
      { k: '"name"' },
      ': ',
      { s: `"${serverName}"` },
      ',\n  ',
      { k: '"url"' },
      ': ',
      { s: `"${url}"` },
      '\n}',
    ];
  }
  return [
    '{\n  ',
    { k: '"mcpServers"' },
    ': {\n    ',
    { k: `"${serverName}"` },
    ': {\n      ',
    { k: '"url"' },
    ': ',
    { s: `"${url}"` },
    '\n    }\n  }\n}',
  ];
}
