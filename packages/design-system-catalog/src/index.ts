export const buttonVariants = ["primary", "secondary", "outline", "ghost", "destructive"] as const;
export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonSizes = ["sm", "md", "lg"] as const;
export type ButtonSize = (typeof buttonSizes)[number];

export const badgeTones = ["neutral", "accent", "success", "warning", "destructive"] as const;
export type BadgeTone = (typeof badgeTones)[number];

export const alertTones = ["neutral", "success", "warning", "destructive"] as const;
export type AlertTone = (typeof alertTones)[number];

export const iconNames = [
  "app-window",
  "arrow-left",
  "check",
  "chevron-down",
  "chevron-right",
  "circle-alert",
  "compass",
  "copy",
  "ellipsis",
  "house",
  "layers",
  "layout-template",
  "list-tree",
  "indent-increase",
  "menu",
  "messages-square",
  "moon",
  "mouse-pointer-click",
  "palette",
  "panel-left-close",
  "panel-left-open",
  "pencil",
  "shapes",
  "sun",
  "sun-moon",
  "text-cursor-input",
  "trash",
  "type",
  "x",
] as const;
export type IconName = (typeof iconNames)[number];

export {
  componentDocs,
  componentPath,
  type CatalogComponentId,
  type ComponentDocumentation,
} from "./component-docs.js";
import { componentDocs, componentPath, type CatalogComponentId } from "./component-docs.js";

export type CatalogPageId =
  | CatalogComponentId
  | "overview"
  | "color"
  | "theming"
  | "typography"
  | "content"
  | "geometry"
  | "forms"
  | "navigation"
  | "overlays"
  | "status"
  | "surfaces"
  | "layouts"
  | "product";

export type CatalogPage = Readonly<{
  description: string;
  id: CatalogPageId;
  path: string;
  title: string;
}>;

export type CatalogSectionId =
  "foundations" | "layout" | "typography" | "components" | "editor" | "utilities" | "patterns" | "templates";

export type CatalogSection = Readonly<{
  id: CatalogSectionId;
  pages: readonly CatalogPage[];
  title: string;
}>;

const page = (id: CatalogPageId, path: string, title: string, description: string): CatalogPage => ({
  description,
  id,
  path,
  title,
});

export const overviewPage = page(
  "overview",
  "",
  "Overview",
  "One token source, one component layer, and the rules that keep every Cairn surface consistent.",
);

const componentGroups = [
  { id: "layout", title: "Layout" },
  { id: "typography", title: "Typography" },
  { id: "components", title: "Components" },
  { id: "editor", title: "Editor" },
  { id: "utilities", title: "Utilities" },
] as const;
const componentIds = Object.keys(componentDocs) as CatalogComponentId[];

export const catalogSections: readonly CatalogSection[] = [
  {
    id: "foundations",
    title: "Theme & foundations",
    pages: [
      page(
        "color",
        "foundations/color",
        "Color",
        "Semantic roles resolved per theme; components never touch raw values.",
      ),
      page(
        "theming",
        "foundations/theming",
        "Theming",
        "Application-wide forest and slate themes in light and dark modes.",
      ),
      page("typography", "foundations/typography", "Typography", "HarmonyOS Sans SC and the eight-step type scale."),
      page("content", "foundations/content", "Content", "Sentence patterns and naming rules for clear interface copy."),
      page(
        "geometry",
        "foundations/geometry",
        "Geometry & motion",
        "Spacing rhythm, radii, elevation, and motion timing.",
      ),
    ],
  },
  ...componentGroups.map((group) => ({
    ...group,
    pages: componentIds
      .filter((id) => componentDocs[id].group === group.id)
      .map((id) => page(id, componentPath(id), id, componentDocs[id].description)),
  })),
  {
    id: "patterns",
    title: "Compositions",
    pages: [
      page(
        "forms",
        "patterns/forms",
        "Form composition",
        "Fields, inputs, selection controls, and validation used together.",
      ),
      page(
        "navigation",
        "patterns/navigation",
        "Navigation composition",
        "Tabs, breadcrumbs, and the patterns that move between views.",
      ),
      page(
        "overlays",
        "patterns/overlays",
        "Overlay interactions",
        "Dialogs, menus, popovers, tooltips, and transient notifications.",
      ),
      page(
        "status",
        "patterns/status",
        "Feedback composition",
        "Badges, alerts, and progress indication used together.",
      ),
      page("surfaces", "patterns/surfaces", "Surface composition", "Cards and the panels that structure a page."),
    ],
  },
  {
    id: "templates",
    title: "Templates",
    pages: [
      page(
        "layouts",
        "templates/layouts",
        "Responsive layouts",
        "App shell, page scaffold, and the list-detail navigation pattern.",
      ),
      page(
        "product",
        "templates/product",
        "Product preview",
        "The live product shell rendered from system components.",
      ),
    ],
  },
];

export const catalogPages: readonly CatalogPage[] = [overviewPage, ...catalogSections.flatMap(({ pages }) => pages)];

const componentIcons = Object.fromEntries(
  componentIds.map((id) => [
    id,
    componentDocs[id].group === "editor"
      ? "list-tree"
      : componentDocs[id].group === "layout"
        ? "layout-template"
        : "layers",
  ]),
) as Record<CatalogComponentId, IconName>;

export const catalogPageIcons: Readonly<Record<CatalogPageId, IconName>> = {
  overview: "house",
  color: "palette",
  theming: "sun-moon",
  typography: "type",
  content: "messages-square",
  geometry: "shapes",
  forms: "text-cursor-input",
  navigation: "compass",
  overlays: "ellipsis",
  status: "circle-alert",
  surfaces: "layers",
  layouts: "layout-template",
  product: "app-window",
  ...componentIcons,
};

export function findCatalogPage(path: string): CatalogPage | undefined {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  return catalogPages.find((candidate) => candidate.path === normalized);
}
