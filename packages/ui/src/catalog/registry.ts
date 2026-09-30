import { House, Layers, LayoutTemplate, ListTree, Palette, Settings, Shapes, SunMoon, Type } from "lucide-react";

import type { IconGlyph } from "../components/icon.js";
import type { DeviceSet } from "./docs/devices.js";

// Every public component has one entry. `examples` name files under ./examples; each file is
// both the rendered preview and the code shown beside it.
type ComponentEntry = Readonly<{
  group: "layout" | "typography" | "components" | "editor" | "utilities";
  description: string;
  exports: readonly string[];
  examples: readonly ExampleEntry[];
}>;

// A viewport example renders in its own resizable document, so media queries, viewport units,
// and fixed layers respond to the preview. Content examples size the viewport to their height;
// screen examples fill a viewport whose height the reader sets.
export type ExampleViewport = "content" | "screen";
export type ExampleEntry = Readonly<{ id: string; viewport?: ExampleViewport; devices?: DeviceSet }>;

const responsive = (id: string): ExampleEntry => ({ id, viewport: "content", devices: "any" });
const screen = (id: string, devices: DeviceSet = "any"): ExampleEntry => ({ id, viewport: "screen", devices });

const entry = (
  group: ComponentEntry["group"],
  description: string,
  exports: readonly string[],
  examples: readonly (string | ExampleEntry)[],
): ComponentEntry => ({
  group,
  description,
  exports,
  examples: examples.map((example) => (typeof example === "string" ? { id: example } : example)),
});

export const components = {
  Box: entry("layout", "A block container for padding, size, and display rules.", ["Box"], ["box/size", "box/padding"]),
  Flex: entry("layout", "Arrange children in a row or column with alignment and gaps.", ["Flex"], ["flex/alignment", responsive("flex/responsive")]),
  Grid: entry("layout", "Arrange children in rows and columns that respond to width.", ["Grid"], ["grid/columns", responsive("grid/responsive"), responsive("grid/aspect-ratio")]),
  Container: entry("layout", "Constrain content to one of four shared measures.", ["Container"], ["container/sizes", "container/alignment"]),
  Section: entry("layout", "Set vertical rhythm between page regions.", ["Section"], ["section/rhythm"]),
  AppShell: entry(
    "layout",
    "Header, navigation, and main regions. The navigation docks as a sidebar where it fits; narrower, a few destinations form a bar and more open as a drawer.",
    ["AppShell"],
    [screen("app-shell/web"), screen("app-shell/mobile", "mobile"), screen("app-shell/desktop", "desktop"), screen("app-shell/banner", "desktop")],
  ),
  PageBar: entry(
    "layout",
    "The bar at the top of each page: back, title, and the page's actions; actions that do not fit move into More.",
    ["PageBar"],
    [responsive("page-bar/actions")],
  ),
  ListDetail: entry(
    "layout",
    "A list beside the detail of its selected item where the region is expanded; one at a time, with a way back, where it is not.",
    ["ListDetail"],
    [screen("list-detail/inbox"), screen("list-detail/desktop", "desktop")],
  ),
  TitleBar: entry("layout", "Window title bar content for desktop hosts, kept clear of the system window controls.", ["TitleBar"], [screen("title-bar/desktop", "desktop")]),

  Text: entry("typography", "Body text in the shared type roles, weights, and tones.", ["Text"], ["text/roles", "text/tones"]),
  Heading: entry("typography", "Semantic headings in the title roles.", ["Heading"], ["heading/roles"]),
  Link: entry("typography", "Navigation within prose and supporting copy.", ["Link"], ["link/prose"]),
  Code: entry("typography", "Inline code within prose.", ["Code"], ["code/inline"]),
  Kbd: entry("typography", "Keyboard input and shortcuts.", ["Kbd"], ["kbd/shortcut"]),

  Button: entry("components", "Actions ranked by emphasis, in three sizes.", ["Button"], ["button/variants", "button/sizes", "button/states"]),
  IconButton: entry("components", "An icon-only action with an accessible name.", ["IconButton"], ["icon-button/variants"]),
  Badge: entry("components", "Compact labels and tags on content, such as a record's review state.", ["Badge"], ["badge/tones", "badge/sizes"]),
  Status: entry("components", "The ongoing state of a process or service, such as a connection.", ["Status"], ["status/tones"]),
  Callout: entry("components", "Feedback composed from an icon, title, text, and actions; in AppShell.Banner it spans the content's top edge.", ["Callout"], ["callout/tones", responsive("callout/actions")]),
  List: entry("components", "Rows of items to choose from; beside a detail the chosen one is marked.", ["List"], ["list/rows"]),
  Card: entry(
    "components",
    "A surface for grouped content. A card with a link opens it from anywhere on the card; media meets its edges.",
    ["Card"],
    ["card/variants", "card/composition", "card/media", responsive("card/link")],
  ),
  Image: entry("components", "A picture at a held aspect ratio, cropped or whole, with placeholders while it loads, fails, or is missing.", ["Image"], ["image/states", "image/fit", "image/refresh"]),
  Separator: entry("components", "A quiet boundary between content.", ["Separator"], ["separator/orientation"]),
  Icon: entry("components", "Any SVG icon component at four sizes, decorative or labelled.", ["Icon"], ["icon/sources"]),
  EmptyState: entry("components", "Stand in for a region's missing content, explain why, and offer the next action.", ["EmptyState"], ["empty-state/first-run"]),
  Progress: entry("components", "Progress of measurable and ongoing work.", ["Progress"], ["progress/states"]),
  Spinner: entry("components", "Feedback for short, unmeasurable waits.", ["Spinner"], ["spinner/sizes", "spinner/loading"]),
  Skeleton: entry("components", "Hold the geometry of known content while it loads.", ["Skeleton"], ["skeleton/card", "skeleton/list"]),
  Field: entry("components", "Connect a label, description, and validation message to a control.", ["Field", "FieldLabel", "FieldDescription", "FieldError"], ["field/validation"]),
  TextField: entry("components", "Single-line text input with optional slots.", ["TextField"], ["text-field/sizes", "text-field/slots", "text-field/states"]),
  TextArea: entry("components", "Multiline text input.", ["TextArea"], ["text-area/comment", "text-area/sizes", "text-area/variants", "text-area/resize", "text-area/states"]),
  Checkbox: entry("components", "Independent choices, with optional labels and descriptions.", ["Checkbox"], ["checkbox/states"]),
  RadioGroup: entry("components", "Choose exactly one option from a visible set.", ["RadioGroup"], ["radio-group/plans"]),
  Switch: entry("components", "A setting that applies immediately.", ["Switch"], ["switch/settings"]),
  Select: entry("components", "Choose from a fixed set of options.", ["Select"], ["select/groups"]),
  Combobox: entry("components", "Filter a set of options by typing.", ["Combobox"], ["combobox/filter"]),
  Tabs: entry("components", "Peer views within one subject.", ["Tabs"], ["tabs/views"]),
  SegmentedControl: entry("components", "Choose one of a few options that stay visible side by side.", ["SegmentedControl"], ["segmented-control/views"]),
  Breadcrumbs: entry("components", "The ancestors of the current location.", ["Breadcrumbs"], ["breadcrumbs/trail"]),
  DropdownMenu: entry("components", "Actions and choices behind a trigger.", ["DropdownMenu"], ["dropdown-menu/actions"]),
  ContextMenu: entry("components", "Actions anchored to a pointer or long press.", ["ContextMenu"], ["context-menu/canvas"]),
  Popover: entry("components", "Non-modal content anchored to a trigger.", ["Popover"], ["popover/details"]),
  Tooltip: entry("components", "Short hints on hover and keyboard focus.", ["TooltipProvider", "Tooltip"], ["tooltip/toolbar"]),
  Dialog: entry("components", "A modal task with its own actions.", ["Dialog"], ["dialog/form"]),
  AlertDialog: entry("components", "A modal confirmation of a consequential action.", ["AlertDialog"], ["alert-dialog/confirm"]),
  Toast: entry("components", "Transient notifications with optional actions.", ["ToastProvider", "toast"], ["toast/tones"]),
  SuggestionList: entry("components", "Keyboard-driven completion for host-owned search.", ["SuggestionList", "useSuggestionList"], ["suggestion-list/picker"]),

  OutlineTree: entry("editor", "Hierarchical content with selection, inline editing, and host-owned commands.", ["OutlineTree", "OutlineBullet", "OutlineBulletDot", "OutlineRowProgress"], ["outline-tree/node-outline"]),
  NodeEditor: entry("editor", "Coordinate editable regions around host-owned data.", ["NodeEditor"], ["node-heading/document", "node-table/rows"]),
  NodeHeading: entry("editor", "An editable document heading within a NodeEditor.", ["NodeHeading"], ["node-heading/document"]),
  NodeTable: entry("editor", "Host-owned columns and rows with a composable footer.", ["NodeTable", "OutlineEmptyChild"], ["node-table/rows"]),
  OutlineInlineContent: entry("editor", "Structured inline content outside an editable region.", ["OutlineInlineContent"], ["outline-inline-content/static"]),

  CairnTheme: entry("utilities", "Choose system, light, or dark appearance for the application.", ["CairnTheme"], ["cairn-theme/appearance"]),
  LegalPage: entry("utilities", "Bundled font attribution and license text.", ["LegalPage"], ["legal-page/embedded"]),
} as const satisfies Readonly<Record<string, ComponentEntry>>;

export type ComponentId = keyof typeof components;
export const componentIds = Object.keys(components) as ComponentId[];

export type FoundationId = "themes" | "color" | "typography" | "space-and-shape" | "elevation-and-motion";
export type PageId = "overview" | FoundationId | ComponentId;

export type CatalogPage = Readonly<{ id: PageId; path: string; title: string; description: string; icon: IconGlyph }>;
export type CatalogSection = Readonly<{ id: string; title: string; pages: readonly CatalogPage[] }>;

const kebab = (id: string) => id.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

export function componentPath(id: ComponentId): string {
  return `${components[id].group}/${kebab(id)}`;
}

export const overviewPage: CatalogPage = {
  id: "overview",
  path: "",
  title: "Overview",
  description: "Themes, foundations, and components with live examples.",
  icon: House,
};

const foundation = (id: FoundationId, title: string, description: string, icon: IconGlyph): CatalogPage => ({
  id,
  path: `foundations/${id}`,
  title,
  description,
  icon,
});

const groups = [
  { id: "layout", title: "Layout", icon: LayoutTemplate },
  { id: "typography", title: "Typography", icon: Type },
  { id: "components", title: "Components", icon: Layers },
  { id: "editor", title: "Editor", icon: ListTree },
  { id: "utilities", title: "Utilities", icon: Settings },
] as const;

export const catalogSections: readonly CatalogSection[] = [
  {
    id: "foundations",
    title: "Foundations",
    pages: [
      foundation("themes", "Themes", "What a theme defines, and how forest and slate differ.", SunMoon),
      foundation("color", "Color", "Color roles, tone roles, and the scales behind them.", Palette),
      foundation("typography", "Typography", "Font families and semantic text roles.", Type),
      foundation("space-and-shape", "Space & shape", "Spacing, radii, borders, and control sizes.", Shapes),
      foundation("elevation-and-motion", "Elevation & motion", "Shadows by layer and transition timing.", Layers),
    ],
  },
  ...groups.map((group) => ({
    id: group.id,
    title: group.title,
    pages: componentIds
      .filter((id) => components[id].group === group.id)
      .map((id) => ({ id, path: componentPath(id), title: id, description: components[id].description, icon: group.icon })),
  })),
];

export const catalogPages: readonly CatalogPage[] = [overviewPage, ...catalogSections.flatMap(({ pages }) => pages)];

export function findCatalogPage(path: string): CatalogPage | undefined {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  return catalogPages.find((page) => page.path === normalized);
}

export function exampleViewport(example: string): ExampleViewport | undefined {
  for (const { examples } of Object.values(components)) {
    const found = examples.find(({ id }) => id === example);
    if (found !== undefined) return found.viewport;
  }
  return undefined;
}

export function exampleTitle(example: string): string {
  const name = example.slice(example.indexOf("/") + 1).replaceAll("-", " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}
