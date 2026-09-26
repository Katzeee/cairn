import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ReactNode } from "react";

import type { ElementProps } from "./element-props.js";

export type TabsProps = ElementProps<"div", "defaultValue" | "onChange"> &
  Readonly<{
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    orientation?: "horizontal" | "vertical";
    value?: string;
  }>;

export function Tabs({ onValueChange, ...properties }: TabsProps) {
  return (
    <BaseTabs.Root
      {...properties}
      className="flex flex-col"
      onValueChange={onValueChange === undefined ? undefined : (value) => onValueChange(String(value))}
    />
  );
}

export type TabsListProps = ElementProps<"div"> & Readonly<{ children?: ReactNode }>;

export function TabsList({ children, ...properties }: TabsListProps) {
  return (
    <BaseTabs.List {...properties} className="relative flex gap-1 border-b border-border">
      {children}
      <BaseTabs.Indicator
        className="absolute bottom-0 h-0.5 rounded-full bg-primary transition-[left,width] duration-(--cairn-duration-fast) ease-(--cairn-ease-standard)"
        style={{ left: "var(--active-tab-left)", width: "var(--active-tab-width)" }}
      />
    </BaseTabs.List>
  );
}

export type TabProps = ElementProps<"button", "value"> & Readonly<{ value: string }>;

export function Tab(properties: TabProps) {
  return (
    <BaseTabs.Tab
      {...properties}
      className="rounded-t-sm px-3 py-2 text-label font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/45 data-disabled:opacity-50 data-selected:text-foreground"
    />
  );
}

export type TabPanelProps = ElementProps<"div"> & Readonly<{ keepMounted?: boolean; value: string }>;

export function TabPanel(properties: TabPanelProps) {
  return (
    <BaseTabs.Panel
      {...properties}
      className="pt-4 text-body outline-none focus-visible:ring-2 focus-visible:ring-ring/45"
    />
  );
}
