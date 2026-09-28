import {
  AppWindow,
  ArrowLeft,
  Check,
  CircleCheck,
  Info,
  Minus,
  Plus,
  Search,
  Settings,
  TriangleAlert,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Compass,
  Copy,
  Ellipsis,
  House,
  Layers,
  LayoutTemplate,
  ListTree,
  IndentIncrease,
  Menu,
  MessagesSquare,
  Moon,
  MousePointerClick,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Shapes,
  Sun,
  SunMoon,
  TextCursorInput,
  Trash2,
  Type,
  X,
  type LucideIcon,
} from "lucide-react";

const icons = {
  "app-window": AppWindow,
  "arrow-left": ArrowLeft,
  check: Check,
  "circle-check": CircleCheck,
  info: Info,
  minus: Minus,
  plus: Plus,
  search: Search,
  settings: Settings,
  "triangle-alert": TriangleAlert,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  "circle-alert": CircleAlert,
  compass: Compass,
  copy: Copy,
  ellipsis: Ellipsis,
  house: House,
  layers: Layers,
  "layout-template": LayoutTemplate,
  "list-tree": ListTree,
  "indent-increase": IndentIncrease,
  menu: Menu,
  "messages-square": MessagesSquare,
  moon: Moon,
  "mouse-pointer-click": MousePointerClick,
  palette: Palette,
  "panel-left-close": PanelLeftClose,
  "panel-left-open": PanelLeftOpen,
  pencil: Pencil,
  shapes: Shapes,
  sun: Sun,
  "sun-moon": SunMoon,
  "text-cursor-input": TextCursorInput,
  trash: Trash2,
  type: Type,
  x: X,
} as const satisfies Readonly<Record<string, LucideIcon>>;

export type IconName = keyof typeof icons;
export const iconNames = Object.keys(icons) as readonly IconName[];

export type IconProps = Readonly<{
  name: IconName;
  size?: "xs" | "sm" | "md" | "lg";
  label?: string;
}>;

export function Icon({ name, size = "md", label }: IconProps) {
  const Component = icons[name];
  return (
    <Component
      aria-hidden={label === undefined ? "true" : undefined}
      aria-label={label}
      className="cairn-Icon"
      data-size={size}
      role={label === undefined ? undefined : "img"}
    />
  );
}