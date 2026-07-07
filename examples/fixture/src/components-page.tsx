import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Chip,
  DesignFrame,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  SegChoice,
} from '@workspec/design/components';

/**
 * S4 visual spot-check (workspec-design#5): one live instance of every
 * primitive the brief names — ui/ Button variants, Input, Card, Badge, a
 * Dialog trigger; design/ Frame, Chip, SegChoice — plus a plain `.chip`
 * element that consumes `design-shell.css` directly.
 *
 * That last one is deliberate, not an oversight: none of the migrated
 * `design/*` React components (Frame/Chip/SegChoice included) actually
 * render design-shell.css's classnames (`.frame`, `.chip`, `.segchoice`,
 * ...) — they're implemented on Tailwind utilities + shadcn primitives
 * instead (see each file's source). `design-shell.css` ships as its own
 * published, token-consuming stylesheet for non-React/plain-markup
 * consumers of the design handoff, independent of the component library.
 * tests/smoke.spec.ts's design-shell assertion targets this plain element
 * for exactly that reason — it is what actually depends on the stylesheet.
 */
export function ComponentsPage() {
  return (
    <section data-testid="components-page" className="mt-10 space-y-6 border-t border-border pt-8">
      <h2 className="text-xl font-semibold">Components</h2>

      <div className="flex flex-wrap items-center gap-3">
        <Button data-testid="btn-primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      <Input placeholder="Input" className="max-w-xs" />

      <Card data-testid="card" className="max-w-sm">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>Card content.</CardContent>
      </Card>

      <Badge>Badge</Badge>

      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogDescription>Dialog description.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <DesignFrame kicker="STEP 1" context="fixture">
        <Chip variant="active">Chip</Chip>
        <SegChoice
          active
          onClick={() => {}}
          title="Single seat"
          desc="One seat, full access."
          features={['Fast setup']}
        />
      </DesignFrame>

      <span className="chip" data-testid="shell-chip">
        Shell chip
      </span>
    </section>
  );
}
