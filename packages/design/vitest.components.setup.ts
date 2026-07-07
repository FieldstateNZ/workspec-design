import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// jsdom implements neither ResizeObserver nor IntersectionObserver. Several
// migrated components instantiate one unconditionally on mount even when
// collapsed/closed: cmdk (Command), Radix Select/ScrollArea, and recharts'
// ResponsiveContainer (chart.tsx). Stub no-op implementations rather than
// exclude those components (house testing rule) — the smoke bar is "mounts
// and produces DOM", not real layout observation.
class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ObserverStub);
vi.stubGlobal('IntersectionObserver', ObserverStub);

// jsdom has no window.matchMedia — hooks/use-mobile.tsx (Sidebar) calls it
// unconditionally on mount, and next-themes (ui/sonner.tsx) reads it for
// system-theme detection.
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

// Radix Select/Slider/ToggleGroup call the Pointer Capture API on
// pointerdown; jsdom implements the properties as no-ops that throw
// "not implemented" rather than omitting them outright.
Element.prototype.hasPointerCapture = () => false;
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};

// Radix Select and cmdk (Command) call scrollIntoView when an item mounts
// as selected/highlighted; jsdom has no layout engine so it isn't implemented.
Element.prototype.scrollIntoView = () => {};

// recharts' <ResponsiveContainer> (ui/chart.tsx) measures its own element via
// ResizeObserver + offsetWidth/offsetHeight/getBoundingClientRect and renders
// nothing until it sees a non-zero size — jsdom's layout engine always
// reports 0. Without this, ChartContainer's children (and thus
// ChartTooltip/ChartLegend, which only render when there's a chart to attach
// to) never mount.
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
