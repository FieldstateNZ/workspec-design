/**
 * Public component barrel — the source behind the package's `./components`
 * export. Re-exports every migrated `ui/` primitive and every `design/`
 * primitive (via its own curated barrel, `./design/index.js`) under the
 * names the source files themselves export, so `import { Button, Chip }
 * from '@workspec/design/components'` is the only way consumers reach any
 * component — there is no per-file subpath export.
 *
 * `ui/toaster.tsx` and `ui/sonner.tsx` both export a component named
 * `Toaster` (two competing shadcn toast systems that travel together in the
 * enterprise app's `ui/` directory — see docs/inventory.md). That is the one
 * name collision across the whole set (330 exported identifiers, verified at
 * migration time); it can only be resolved here, at the aggregating barrel,
 * without renaming either source file. `ui/toaster.tsx`'s `Toaster` (the
 * older Radix-toast trio: toast.tsx + toaster.tsx + hooks/use-toast.ts) keeps
 * the bare name; `ui/sonner.tsx`'s is aliased to `SonnerToaster`.
 */
export * from './ui/accordion.js';
export * from './ui/alert.js';
export * from './ui/alert-dialog.js';
export * from './ui/aspect-ratio.js';
export * from './ui/avatar.js';
export * from './ui/badge.js';
export * from './ui/breadcrumb.js';
export * from './ui/button.js';
export * from './ui/button-group.js';
export * from './ui/calendar.js';
export * from './ui/card.js';
export * from './ui/carousel.js';
export * from './ui/chart.js';
export * from './ui/checkbox.js';
export * from './ui/collapsible.js';
export * from './ui/command.js';
export * from './ui/context-menu.js';
export * from './ui/dialog.js';
export * from './ui/drawer.js';
export * from './ui/dropdown-menu.js';
export * from './ui/empty.js';
export * from './ui/field.js';
export * from './ui/form.js';
export * from './ui/hover-card.js';
export * from './ui/input.js';
export * from './ui/input-group.js';
export * from './ui/input-otp.js';
export * from './ui/item.js';
export * from './ui/kbd.js';
export * from './ui/label.js';
export * from './ui/menubar.js';
export * from './ui/navigation-menu.js';
export * from './ui/pagination.js';
export * from './ui/popover.js';
export * from './ui/progress.js';
export * from './ui/radio-group.js';
export * from './ui/resizable.js';
export * from './ui/scroll-area.js';
export * from './ui/segmented-toggle.js';
export * from './ui/select.js';
export * from './ui/separator.js';
export * from './ui/sheet.js';
export * from './ui/sidebar.js';
export * from './ui/skeleton.js';
export * from './ui/slider.js';
export * from './ui/spinner.js';
export * from './ui/switch.js';
export * from './ui/table.js';
export * from './ui/tabs.js';
export * from './ui/textarea.js';
export * from './ui/toast.js';
export * from './ui/toggle.js';
export * from './ui/toggle-group.js';
export * from './ui/tooltip.js';
export * from './ui/workspec-mark.js';
export { Toaster } from './ui/toaster.js';
export { Toaster as SonnerToaster } from './ui/sonner.js';

export * from './design/index.js';
