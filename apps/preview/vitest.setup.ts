import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// This config does not set `test.globals: true` (matching the rest of the
// workspace's explicit-import style), so React Testing Library's built-in
// auto-cleanup — which relies on a *global* `afterEach` — never registers.
// Without this, DOM trees from earlier tests in the same file stay mounted
// and multi-render queries (e.g. `getByTestId` in App.test.tsx) find
// duplicates across tests.
afterEach(() => {
  cleanup();
});

// The Components section (S4, workspec-design#5) renders every migrated
// component live, in jsdom, same as packages/design's own component smoke
// suite — see that package's vitest.components.setup.ts for the identical
// set of stubs and why each is needed (jsdom implements neither
// ResizeObserver/IntersectionObserver, window.matchMedia, the Pointer
// Capture API, nor Element.scrollIntoView; recharts' <ResponsiveContainer>
// additionally needs non-zero layout measurements to render its children).
// Duplicated rather than shared, per this app's registry also being
// deliberately independent of the package's test-only registry.
class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ObserverStub);
vi.stubGlobal('IntersectionObserver', ObserverStub);

vi.stubGlobal(
  'matchMedia',
  vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
);

Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};
Element.prototype.scrollIntoView = () => {};

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 500,
});
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 500,
});
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
Element.prototype.getBoundingClientRect = function stubbedGetBoundingClientRect() {
  const rect = originalGetBoundingClientRect.call(this);
  if (rect.width > 0 && rect.height > 0) return rect;
  return { ...rect, width: 500, height: 500, right: 500, bottom: 500 };
};
