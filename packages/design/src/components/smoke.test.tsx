import { readdirSync } from 'node:fs';
import { join } from 'node:path';
// Named import, not the global `URL` — jsdom (this suite's environment)
// shadows `globalThis.URL` with its own implementation, which silently
// resolves relative bases against `window.location` (http://localhost:3000/)
// instead of the `file:` base passed as the second argument.
import { fileURLToPath, URL as NodeURL } from 'node:url';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SMOKE_REGISTRY } from './smoke-registry.js';

function componentFiles(dir: string): string[] {
  const componentsRoot = fileURLToPath(new NodeURL('.', import.meta.url));
  return readdirSync(join(componentsRoot, dir))
    .filter((name) => name.endsWith('.tsx'))
    .map((name) => `${dir}/${name.replace(/\.tsx$/, '')}`);
}

describe('component smoke registry coverage', () => {
  // Guards the registry itself against drifting from the migrated file set —
  // catches a future component file added to ui/ or design/ without a
  // matching registry entry (registry entries are file names; design/index.ts
  // is the barrel, not a component, and is excluded).
  it('has exactly one entry per migrated ui/*.tsx and design/*.tsx file', () => {
    const uiFiles = componentFiles('ui');
    const designFiles = componentFiles('design').filter((name) => name !== 'design/index');
    const expected = [...uiFiles, ...designFiles].sort();
    expect(Object.keys(SMOKE_REGISTRY).sort()).toEqual(expected);
  });

  it('covers all 57 ui/ files and 13 design/ files (70 total)', () => {
    expect(componentFiles('ui')).toHaveLength(57);
    expect(componentFiles('design').filter((name) => name !== 'design/index')).toHaveLength(13);
    expect(Object.keys(SMOKE_REGISTRY)).toHaveLength(70);
  });
});

describe('component smoke render', () => {
  it.each(Object.entries(SMOKE_REGISTRY))('%s renders without throwing', (_name, factory) => {
    const { container } = render(factory());
    expect(container).toBeTruthy();
  });
});
