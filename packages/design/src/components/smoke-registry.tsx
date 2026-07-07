/**
 * Smoke-render registry — one entry per migrated component FILE (57 `ui/` +
 * 13 `design/` = 70), each mounting a minimal but realistic composition of
 * that file's primary component(s) (compound Radix primitives render as one
 * assembled tree rather than one row per sub-part; see smoke.test.tsx). Some
 * subcomponents render only transitively, as children of the primary
 * component being exercised, not because every named export is deliberately
 * invoked — a handful of value exports (variant-class functions, hooks,
 * type-only exports) are never rendered at all, since there is nothing to
 * mount. Portal/positioned content (Dialog, Popover, Select, ...) is forced
 * into the DOM with `defaultOpen`/`forceMount` so its sub-components
 * actually mount instead of only proving the closed Root + Trigger render —
 * see vitest.components.setup.ts for the jsdom stubs that makes that safe
 * (ResizeObserver, matchMedia, pointer capture, scrollIntoView, recharts'
 * layout measurement).
 *
 * Imports go straight to each file (not through ./index.js) so `ui/toaster`
 * and `ui/sonner` — the one name collision in the whole export surface (both
 * export `Toaster`; see components/index.ts) — can be aliased locally
 * without touching either source file.
 */
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import * as Recharts from 'recharts';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion.js';
import { Alert, AlertDescription, AlertTitle } from './ui/alert.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog.js';
import { AspectRatio } from './ui/aspect-ratio.js';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.js';
import { Badge } from './ui/badge.js';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb.js';
import { Button } from './ui/button.js';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './ui/button-group.js';
import { Calendar } from './ui/calendar.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card.js';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel.js';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from './ui/chart.js';
import { Checkbox } from './ui/checkbox.js';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible.js';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './ui/command.js';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './ui/context-menu.js';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.js';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer.js';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu.js';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty.js';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from './ui/field.js';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form.js';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card.js';
import { Input } from './ui/input.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './ui/input-group.js';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './ui/input-otp.js';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './ui/item.js';
import { Kbd, KbdGroup } from './ui/kbd.js';
import { Label } from './ui/label.js';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './ui/menubar.js';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu.js';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination.js';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from './ui/popover.js';
import { Progress } from './ui/progress.js';
import { RadioGroup, RadioGroupItem } from './ui/radio-group.js';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable.js';
import { ScrollArea } from './ui/scroll-area.js';
import { SegmentedToggle } from './ui/segmented-toggle.js';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './ui/select.js';
import { Separator } from './ui/separator.js';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet.js';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from './ui/sidebar.js';
import { Skeleton } from './ui/skeleton.js';
import { Slider } from './ui/slider.js';
import { Toaster as SonnerToaster } from './ui/sonner.js';
import { Spinner } from './ui/spinner.js';
import { Switch } from './ui/switch.js';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.js';
import { Textarea } from './ui/textarea.js';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './ui/toast.js';
import { Toaster } from './ui/toaster.js';
import { Toggle } from './ui/toggle.js';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group.js';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip.js';
import { WorkspecMark } from './ui/workspec-mark.js';

import {
  ArtifactCard,
  ArtifactCardBody,
  ArtifactCardFooter,
  ArtifactCardHeader,
  SimpleArtifactCard,
} from './design/artifact-card.js';
import { TwoLetterAvatar } from './design/avatar-2.js';
import { Chip } from './design/chip.js';
import { ClientPickerTile } from './design/client-picker-tile.js';
import { CodeBlock, mcpConfigTokens } from './design/code-block.js';
import { DetailPanel, DetailPanelCloseButton } from './design/detail-panel.js';
import { CardHeaderStrip, DesignFrame } from './design/frame.js';
import { LensToggle } from './design/lens-toggle.js';
import { PageHeader, PageShell } from './design/page-shell.js';
import { SegChoice } from './design/seg-choice.js';
import { StepsBar } from './design/steps-bar.js';
import { InfoBar, Surf } from './design/surf.js';
import { DisplayTitle, Kicker, Lbl, Lead } from './design/typography.js';

const CHART_CONFIG = { desktop: { label: 'Desktop', color: '#2563eb' } } satisfies ChartConfig;

function FormSmoke(): ReactElement {
  const form = useForm({ defaultValues: { example: '' } });
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="example"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <input {...field} />
            </FormControl>
            <FormDescription>Description</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  );
}

/** name -> factory. Iterated by smoke.test.tsx; see file header. */
export const SMOKE_REGISTRY: Record<string, () => ReactElement> = {
  'ui/accordion': () => (
    <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>Section</AccordionTrigger>
        <AccordionContent forceMount>Accordion content.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  'ui/alert': () => (
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>Alert description.</AlertDescription>
    </Alert>
  ),
  'ui/alert-dialog': () => (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent forceMount>
        <AlertDialogHeader>
          <AlertDialogTitle>Title</AlertDialogTitle>
          <AlertDialogDescription>Description</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  'ui/aspect-ratio': () => (
    <AspectRatio ratio={16 / 9}>
      <div>16:9</div>
    </AspectRatio>
  ),
  'ui/avatar': () => (
    <Avatar>
      <AvatarImage src="https://example.test/avatar.png" alt="Avatar" />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
  'ui/badge': () => <Badge>Badge</Badge>,
  'ui/breadcrumb': () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  'ui/button': () => <Button>Click</Button>,
  'ui/button-group': () => (
    <ButtonGroup>
      <Button>Left</Button>
      <ButtonGroupSeparator />
      <ButtonGroupText>Text</ButtonGroupText>
    </ButtonGroup>
  ),
  'ui/calendar': () => <Calendar mode="single" />,
  'ui/card': () => (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>Content</CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  ),
  'ui/carousel': () => (
    <Carousel>
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  'ui/chart': () => (
    <ChartContainer config={CHART_CONFIG}>
      <Recharts.BarChart data={[{ month: 'Jan', desktop: 10 }]}>
        <Recharts.Bar dataKey="desktop" fill="var(--color-desktop)" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </Recharts.BarChart>
    </ChartContainer>
  ),
  'ui/checkbox': () => <Checkbox defaultChecked />,
  'ui/collapsible': () => (
    <Collapsible defaultOpen>
      <CollapsibleTrigger>Toggle</CollapsibleTrigger>
      <CollapsibleContent forceMount>Content</CollapsibleContent>
    </Collapsible>
  ),
  'ui/command': () => (
    <>
      <Command>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup heading="Group">
            <CommandItem>
              Item <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </Command>
      <CommandDialog defaultOpen>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandItem>Dialog item</CommandItem>
        </CommandList>
      </CommandDialog>
    </>
  ),
  'ui/context-menu': () => (
    <ContextMenu>
      <ContextMenuTrigger>Right click</ContextMenuTrigger>
      <ContextMenuContent forceMount>
        <ContextMenuLabel>Label</ContextMenuLabel>
        <ContextMenuGroup>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuCheckboxItem checked>Checkbox</ContextMenuCheckboxItem>
        <ContextMenuRadioGroup value="a">
          <ContextMenuRadioItem value="a">Radio</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More</ContextMenuSubTrigger>
          <ContextMenuSubContent forceMount>
            <ContextMenuItem>
              Sub item <ContextMenuShortcut>⌘S</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  ),
  'ui/dialog': () => (
    <Dialog defaultOpen>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent forceMount>
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  'ui/drawer': () => (
    <Drawer defaultOpen>
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Title</DrawerTitle>
          <DrawerDescription>Description</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
  'ui/dropdown-menu': () => (
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent forceMount>
        <DropdownMenuLabel>Label</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuCheckboxItem checked>Checkbox</DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup value="a">
          <DropdownMenuRadioItem value="a">Radio</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
          <DropdownMenuSubContent forceMount>
            <DropdownMenuItem>
              Sub item <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  'ui/empty': () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">Icon</EmptyMedia>
        <EmptyTitle>Nothing here</EmptyTitle>
        <EmptyDescription>Description</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>Content</EmptyContent>
    </Empty>
  ),
  'ui/field': () => (
    <FieldSet>
      <FieldLegend>Legend</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel>Label</FieldLabel>
          <FieldContent>
            <FieldTitle>Title</FieldTitle>
            <FieldDescription>Description</FieldDescription>
          </FieldContent>
          <FieldError errors={[{ message: 'Required' }]} />
          <FieldSeparator>OR</FieldSeparator>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
  'ui/form': () => <FormSmoke />,
  'ui/hover-card': () => (
    <HoverCard defaultOpen>
      <HoverCardTrigger>Hover</HoverCardTrigger>
      <HoverCardContent forceMount>Content</HoverCardContent>
    </HoverCard>
  ),
  'ui/input': () => <Input placeholder="Text" />,
  'ui/input-group': () => (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="Amount" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Go</InputGroupButton>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="Notes" />
    </InputGroup>
  ),
  'ui/input-otp': () => (
    <InputOTP maxLength={4}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  ),
  'ui/item': () => (
    <ItemGroup>
      <Item>
        <ItemMedia variant="icon">Icon</ItemMedia>
        <ItemContent>
          <ItemHeader>
            <ItemTitle>Title</ItemTitle>
          </ItemHeader>
          <ItemDescription>Description</ItemDescription>
          <ItemFooter>Footer</ItemFooter>
        </ItemContent>
        <ItemActions>Actions</ItemActions>
      </Item>
      <ItemSeparator />
    </ItemGroup>
  ),
  'ui/kbd': () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
  'ui/label': () => <Label htmlFor="x">Label</Label>,
  'ui/menubar': () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarLabel>Label</MenubarLabel>
          <MenubarGroup>
            <MenubarItem>
              New <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarCheckboxItem checked>Checked</MenubarCheckboxItem>
          <MenubarRadioGroup value="a">
            <MenubarRadioItem value="a">Radio</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>More</MenubarSubTrigger>
            <MenubarSubContent forceMount>
              <MenubarItem>Sub item</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
  'ui/navigation-menu': () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          <NavigationMenuContent forceMount>
            <NavigationMenuLink href="#">Link</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuIndicator forceMount />
      </NavigationMenuList>
    </NavigationMenu>
  ),
  'ui/pagination': () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  'ui/popover': () => (
    <Popover defaultOpen>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent forceMount>Popover content</PopoverContent>
      <PopoverAnchor />
    </Popover>
  ),
  'ui/progress': () => <Progress value={40} />,
  'ui/radio-group': () => (
    <RadioGroup defaultValue="a">
      <RadioGroupItem value="a" />
      <RadioGroupItem value="b" />
    </RadioGroup>
  ),
  'ui/resizable': () => (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={50}>Left</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>Right</ResizablePanel>
    </ResizablePanelGroup>
  ),
  'ui/scroll-area': () => (
    <ScrollArea className="h-20 w-20">
      <div>Content</div>
    </ScrollArea>
  ),
  'ui/segmented-toggle': () => (
    <SegmentedToggle
      value="a"
      onChange={() => {}}
      options={[
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ]}
    />
  ),
  'ui/select': () => (
    <Select defaultValue="a" open>
      <SelectTrigger>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent forceMount>
        <SelectGroup>
          <SelectLabel>Group</SelectLabel>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
          <SelectSeparator />
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  'ui/separator': () => <Separator />,
  'ui/sheet': () => (
    <Sheet defaultOpen>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent forceMount>
        <SheetHeader>
          <SheetTitle>Title</SheetTitle>
          <SheetDescription>Description</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  'ui/sidebar': () => (
    <SidebarProvider>
      <Sidebar collapsible="none">
        <SidebarHeader>Header</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Group</SidebarGroupLabel>
            <SidebarGroupAction>Action</SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Tooltip">Item</SidebarMenuButton>
                  <SidebarMenuAction>Action</SidebarMenuAction>
                  <SidebarMenuBadge>3</SidebarMenuBadge>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#">Sub</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarInput placeholder="Search" />
        </SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
      </SidebarInset>
    </SidebarProvider>
  ),
  'ui/skeleton': () => <Skeleton className="h-4 w-20" />,
  'ui/slider': () => <Slider defaultValue={[50]} max={100} step={1} />,
  'ui/sonner': () => <SonnerToaster />,
  'ui/spinner': () => <Spinner />,
  'ui/switch': () => <Switch defaultChecked />,
  'ui/table': () => (
    <Table>
      <TableCaption>Caption</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Value</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  'ui/tabs': () => (
    <Tabs defaultValue="a">
      <TabsList>
        <TabsTrigger value="a">A</TabsTrigger>
        <TabsTrigger value="b">B</TabsTrigger>
      </TabsList>
      <TabsContent value="a">Content A</TabsContent>
      <TabsContent value="b" forceMount>
        Content B
      </TabsContent>
    </Tabs>
  ),
  'ui/textarea': () => <Textarea placeholder="Notes" />,
  'ui/toast': () => (
    <ToastProvider>
      <Toast open>
        <ToastTitle>Title</ToastTitle>
        <ToastDescription>Description</ToastDescription>
        <ToastAction altText="Undo">Undo</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
  'ui/toaster': () => <Toaster />,
  'ui/toggle': () => <Toggle>Toggle</Toggle>,
  'ui/toggle-group': () => (
    <ToggleGroup type="single" defaultValue="a">
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b">B</ToggleGroupItem>
    </ToggleGroup>
  ),
  'ui/tooltip': () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent forceMount>Tooltip content</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  'ui/workspec-mark': () => <WorkspecMark />,

  'design/artifact-card': () => (
    <>
      <ArtifactCard type="feature">
        <ArtifactCardHeader title="Pluggable auth" type="feature">
          <Chip>WSR-12</Chip>
        </ArtifactCardHeader>
        <ArtifactCardBody>Allow third-party identity providers.</ArtifactCardBody>
        <ArtifactCardFooter>
          <Chip>PRI 2</Chip>
        </ArtifactCardFooter>
      </ArtifactCard>
      <SimpleArtifactCard type="goal" title="Simple" body="Body text" meta={['WSR-1']} />
    </>
  ),
  'design/avatar-2': () => <TwoLetterAvatar id="cc" />,
  'design/chip': () => <Chip variant="active">Chip</Chip>,
  'design/client-picker-tile': () => (
    <ClientPickerTile
      client={{ id: 'cc', label: 'Claude Code', tag: 'Recommended' }}
      active
      onClick={() => {}}
    />
  ),
  'design/code-block': () => (
    <CodeBlock tokens={mcpConfigTokens('mcpServers', 'workspec', 'https://example.test')} />
  ),
  'design/detail-panel': () => (
    <DetailPanel onClose={() => {}}>
      <DetailPanel.Header kicker="ARTIFACT" title="Pluggable auth" subtitle="WSR-12">
        <DetailPanelCloseButton onClose={() => {}} />
      </DetailPanel.Header>
      <DetailPanel.Section label="Description">
        Allow third-party identity providers.
      </DetailPanel.Section>
      <DetailPanel.Footer>Footer</DetailPanel.Footer>
    </DetailPanel>
  ),
  'design/frame': () => (
    <DesignFrame kicker="STEP 1" context="pukekos">
      Content
      <CardHeaderStrip kicker="Standalone strip" />
    </DesignFrame>
  ),
  'design/lens-toggle': () => (
    <LensToggle
      value="logical"
      onChange={() => {}}
      options={[
        { value: 'logical', label: 'Logical' },
        { value: 'deployment', label: 'Deployment' },
      ]}
    />
  ),
  'design/page-shell': () => (
    <PageShell>
      <PageHeader
        back={{ href: '/', label: 'Back' }}
        title="Title"
        lead="Lead text"
        kicker="Kicker"
      />
    </PageShell>
  ),
  'design/seg-choice': () => (
    <SegChoice active onClick={() => {}} title="Single" desc="One seat" features={['Fast']} />
  ),
  'design/steps-bar': () => <StepsBar step={1} labels={['One', 'Two', 'Three']} />,
  'design/surf': () => (
    <>
      <Surf>Surface</Surf>
      <InfoBar cols={2}>Info</InfoBar>
    </>
  ),
  'design/typography': () => (
    <>
      <Lbl>Label</Lbl>
      <DisplayTitle>Title</DisplayTitle>
      <Lead>Lead</Lead>
      <Kicker>Kicker</Kicker>
    </>
  ),
};
