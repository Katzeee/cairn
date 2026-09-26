import type { IconName } from "@cairn/design-system-catalog";
import {
  AppWindow,
  ArrowLeft,
  Check,
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

import { cn } from "./cn.js";

const icons: Readonly<Record<IconName, LucideIcon>> = {
  "app-window": AppWindow,
  "arrow-left": ArrowLeft,
  check: Check,
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
};

const sizes = { xs: "size-3.5", sm: "size-4", md: "size-5", lg: "size-6" } as const;

export function Icon({
  label,
  name,
  size = "md",
}: Readonly<{ label?: string; name: IconName; size?: keyof typeof sizes }>) {
  const Component = icons[name];
  return (
    <Component
      aria-hidden={label === undefined ? "true" : undefined}
      aria-label={label}
      className={cn("shrink-0", sizes[size])}
      role={label === undefined ? undefined : "img"}
    />
  );
}
