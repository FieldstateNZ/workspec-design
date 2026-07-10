/**
 * Preview's own component registry — independent of the package-side smoke
 * registry (packages/design/src/components/smoke-registry.tsx) by design
 * (DELIVERY_PLAN.md / workspec-design#5 S4 brief: "do NOT create a shared
 * test/preview coupling across packages"). Both happen to use similar
 * minimal compositions because both are answering the same question ("what
 * does a minimal instance of this component need"), not because one imports
 * the other.
 *
 * One entry per migrated component FILE (57 `ui/` + 13 `design/` = 70,
 * grouped by directory for the Components section), matching
 * docs/inventory.md's own file-based component count. Each entry's composed
 * tree renders that file's primary component(s) (compound Radix primitives
 * render as one assembled, force-opened instance rather than each sub-part
 * in isolation — most Radix sub-parts cannot mount at all outside their
 * family's Root context). Some subcomponents render only transitively, as
 * children of the primary component; a handful of value exports (variant-
 * class functions, hooks, type-only exports) are never rendered at all.
 */
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import * as Recharts from 'recharts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  ArtifactCard,
  ArtifactCardBody,
  ArtifactCardFooter,
  ArtifactCardHeader,
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeaderStrip,
  CardTitle,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Checkbox,
  Chip,
  ClientPickerTile,
  CodeBlock,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
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
  DesignFrame,
  DetailPanel,
  DetailPanelCloseButton,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DisplayTitle,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  InfoBar,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
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
  Kbd,
  KbdGroup,
  Kicker,
  Label,
  Lbl,
  Lead,
  LensToggle,
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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  PageHeader,
  PageShell,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  SegChoice,
  SegmentedToggle,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
  SimpleArtifactCard,
  Skeleton,
  Slider,
  SonnerToaster,
  Spinner,
  Status,
  StepsBar,
  Surf,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  Toaster,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TwoLetterAvatar,
  WorkspecMark,
  type ChartConfig,
} from '@workspec/design/components';

const CHART_CONFIG = { desktop: { label: 'Desktop', color: '#2563eb' } } satisfies ChartConfig;

function FormPreview(): ReactElement {
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

export interface ComponentRegistryEntry {
  readonly name: string;
  readonly group: 'ui' | 'design';
  readonly render: () => ReactElement;
}

/** Grouped by directory, in inventory order — see this file's own header for what "one entry" means. */
export const COMPONENT_REGISTRY: readonly ComponentRegistryEntry[] = [
  {
    name: 'accordion',
    group: 'ui',
    render: () => (
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Section</AccordionTrigger>
          <AccordionContent forceMount>Accordion content.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    name: 'alert',
    group: 'ui',
    render: () => (
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Alert description.</AlertDescription>
      </Alert>
    ),
  },
  {
    name: 'alert-dialog',
    group: 'ui',
    render: () => (
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
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
  },
  {
    name: 'aspect-ratio',
    group: 'ui',
    render: () => (
      <AspectRatio ratio={16 / 9}>
        <div>16:9</div>
      </AspectRatio>
    ),
  },
  {
    name: 'avatar',
    group: 'ui',
    render: () => (
      <Avatar>
        <AvatarImage src="https://example.test/avatar.png" alt="Avatar" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    ),
  },
  { name: 'badge', group: 'ui', render: () => <Badge>Badge</Badge> },
  {
    name: 'breadcrumb',
    group: 'ui',
    render: () => (
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
  },
  { name: 'button', group: 'ui', render: () => <Button>Click</Button> },
  {
    name: 'button-group',
    group: 'ui',
    render: () => (
      <ButtonGroup>
        <Button>Left</Button>
        <ButtonGroupSeparator />
        <ButtonGroupText>Text</ButtonGroupText>
      </ButtonGroup>
    ),
  },
  { name: 'calendar', group: 'ui', render: () => <Calendar mode="single" /> },
  {
    name: 'card',
    group: 'ui',
    render: () => (
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    ),
  },
  {
    name: 'carousel',
    group: 'ui',
    render: () => (
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    ),
  },
  {
    name: 'chart',
    group: 'ui',
    render: () => (
      <ChartContainer config={CHART_CONFIG}>
        <Recharts.BarChart data={[{ month: 'Jan', desktop: 10 }]}>
          <Recharts.Bar dataKey="desktop" fill="var(--color-desktop)" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
        </Recharts.BarChart>
      </ChartContainer>
    ),
  },
  { name: 'checkbox', group: 'ui', render: () => <Checkbox defaultChecked /> },
  {
    name: 'collapsible',
    group: 'ui',
    render: () => (
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsibleContent forceMount>Content</CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    name: 'command',
    group: 'ui',
    render: () => (
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
        <CommandDialog>
          <CommandInput placeholder="Search" />
          <CommandList>
            <CommandItem>Dialog item</CommandItem>
          </CommandList>
        </CommandDialog>
      </>
    ),
  },
  {
    name: 'context-menu',
    group: 'ui',
    render: () => (
      <ContextMenu>
        <ContextMenuTrigger>Right click</ContextMenuTrigger>
        <ContextMenuContent>
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
            <ContextMenuSubContent>
              <ContextMenuItem>
                Sub item <ContextMenuShortcut>⌘S</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    ),
  },
  {
    name: 'dialog',
    group: 'ui',
    render: () => (
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
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
  },
  {
    name: 'drawer',
    group: 'ui',
    render: () => (
      <Drawer>
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
  },
  {
    name: 'dropdown-menu',
    group: 'ui',
    render: () => (
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
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
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                Sub item <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    name: 'empty',
    group: 'ui',
    render: () => (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">Icon</EmptyMedia>
          <EmptyTitle>Nothing here</EmptyTitle>
          <EmptyDescription>Description</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>Content</EmptyContent>
      </Empty>
    ),
  },
  {
    name: 'field',
    group: 'ui',
    render: () => (
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
  },
  { name: 'form', group: 'ui', render: () => <FormPreview /> },
  {
    name: 'hover-card',
    group: 'ui',
    render: () => (
      <HoverCard defaultOpen>
        <HoverCardTrigger>Hover</HoverCardTrigger>
        <HoverCardContent forceMount>Content</HoverCardContent>
      </HoverCard>
    ),
  },
  { name: 'input', group: 'ui', render: () => <Input placeholder="Text" /> },
  {
    name: 'input-group',
    group: 'ui',
    render: () => (
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
  },
  {
    name: 'input-otp',
    group: 'ui',
    render: () => (
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
  },
  {
    name: 'item',
    group: 'ui',
    render: () => (
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
  },
  {
    name: 'kbd',
    group: 'ui',
    render: () => (
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    ),
  },
  { name: 'label', group: 'ui', render: () => <Label htmlFor="x">Label</Label> },
  {
    name: 'menubar',
    group: 'ui',
    render: () => (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
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
              <MenubarSubContent>
                <MenubarItem>Sub item</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
  },
  {
    name: 'navigation-menu',
    group: 'ui',
    render: () => (
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
  },
  {
    name: 'pagination',
    group: 'ui',
    render: () => (
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
  },
  {
    name: 'popover',
    group: 'ui',
    render: () => (
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent forceMount>Popover content</PopoverContent>
        <PopoverAnchor />
      </Popover>
    ),
  },
  { name: 'progress', group: 'ui', render: () => <Progress value={40} /> },
  {
    name: 'radio-group',
    group: 'ui',
    render: () => (
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>
    ),
  },
  {
    name: 'resizable',
    group: 'ui',
    render: () => (
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>Left</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>Right</ResizablePanel>
      </ResizablePanelGroup>
    ),
  },
  {
    name: 'scroll-area',
    group: 'ui',
    render: () => (
      <ScrollArea className="h-20 w-20">
        <div>Content</div>
      </ScrollArea>
    ),
  },
  {
    name: 'segmented-toggle',
    group: 'ui',
    render: () => (
      <SegmentedToggle
        value="a"
        onChange={() => {}}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
      />
    ),
  },
  {
    name: 'select',
    group: 'ui',
    render: () => (
      <Select defaultValue="a">
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Group</SelectLabel>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectSeparator />
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
  },
  { name: 'separator', group: 'ui', render: () => <Separator /> },
  {
    name: 'sheet',
    group: 'ui',
    render: () => (
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
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
  },
  {
    name: 'sidebar',
    group: 'ui',
    render: () => (
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
  },
  { name: 'skeleton', group: 'ui', render: () => <Skeleton className="h-4 w-20" /> },
  { name: 'slider', group: 'ui', render: () => <Slider defaultValue={[50]} max={100} step={1} /> },
  { name: 'sonner', group: 'ui', render: () => <SonnerToaster /> },
  { name: 'spinner', group: 'ui', render: () => <Spinner /> },
  { name: 'switch', group: 'ui', render: () => <Switch defaultChecked /> },
  {
    name: 'table',
    group: 'ui',
    render: () => (
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
  },
  {
    name: 'tabs',
    group: 'ui',
    render: () => (
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
  },
  { name: 'textarea', group: 'ui', render: () => <Textarea placeholder="Notes" /> },
  {
    name: 'toast',
    group: 'ui',
    render: () => (
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
  },
  { name: 'toaster', group: 'ui', render: () => <Toaster /> },
  { name: 'toggle', group: 'ui', render: () => <Toggle>Toggle</Toggle> },
  {
    name: 'toggle-group',
    group: 'ui',
    render: () => (
      <ToggleGroup type="single" defaultValue="a">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    ),
  },
  {
    name: 'tooltip',
    group: 'ui',
    render: () => (
      <TooltipProvider>
        <Tooltip defaultOpen>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent forceMount>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  { name: 'workspec-mark', group: 'ui', render: () => <WorkspecMark /> },

  {
    name: 'artifact-card',
    group: 'design',
    render: () => (
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
  },
  { name: 'avatar-2', group: 'design', render: () => <TwoLetterAvatar id="cc" /> },
  { name: 'chip', group: 'design', render: () => <Chip variant="active">Chip</Chip> },
  {
    name: 'client-picker-tile',
    group: 'design',
    render: () => (
      <ClientPickerTile
        client={{ id: 'cc', label: 'Claude Code', tag: 'Recommended' }}
        active
        onClick={() => {}}
      />
    ),
  },
  {
    name: 'code-block',
    group: 'design',
    render: () => (
      <CodeBlock
        tokens={[
          '{\n  ',
          { k: '"mcpServers"' },
          ': {\n    ',
          { k: '"workspec"' },
          ': {\n      ',
          { k: '"url"' },
          ': ',
          { s: '"https://example.test"' },
          '\n    }\n  }\n}',
        ]}
      />
    ),
  },
  {
    name: 'detail-panel',
    group: 'design',
    render: () => (
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
  },
  {
    name: 'frame',
    group: 'design',
    render: () => (
      <DesignFrame kicker="STEP 1" context="pukekos">
        Content
        <CardHeaderStrip kicker="Standalone strip" />
      </DesignFrame>
    ),
  },
  {
    name: 'lens-toggle',
    group: 'design',
    render: () => (
      <LensToggle
        value="logical"
        onChange={() => {}}
        options={[
          { value: 'logical', label: 'Logical' },
          { value: 'deployment', label: 'Deployment' },
        ]}
      />
    ),
  },
  {
    name: 'page-shell',
    group: 'design',
    render: () => (
      <PageShell>
        <PageHeader
          back={{ href: '/', label: 'Back' }}
          title="Title"
          lead="Lead text"
          kicker="Kicker"
        />
      </PageShell>
    ),
  },
  {
    name: 'seg-choice',
    group: 'design',
    render: () => (
      <SegChoice active onClick={() => {}} title="Single" desc="One seat" features={['Fast']} />
    ),
  },
  {
    name: 'status',
    group: 'design',
    render: () => <Status tone="accent">Decided</Status>,
  },
  {
    name: 'steps-bar',
    group: 'design',
    render: () => <StepsBar step={1} labels={['One', 'Two', 'Three']} />,
  },
  {
    name: 'surf',
    group: 'design',
    render: () => (
      <>
        <Surf>Surface</Surf>
        <InfoBar cols={2}>Info</InfoBar>
      </>
    ),
  },
  {
    name: 'typography',
    group: 'design',
    render: () => (
      <>
        <Lbl>Label</Lbl>
        <DisplayTitle>Title</DisplayTitle>
        <Lead>Lead</Lead>
        <Kicker>Kicker</Kicker>
      </>
    ),
  },
];
