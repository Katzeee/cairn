import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import type { ElementProps } from "./internal/element-props.js";

export type TabsRootProps = ElementProps<"div", "defaultValue" | "onChange"> &
  Readonly<{
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    orientation?: "horizontal" | "vertical";
  }>;

function Root({ onValueChange, ...props }: TabsRootProps) {
  return (
    <BaseTabs.Root
      {...props}
      className="cairn-TabsRoot"
      onValueChange={onValueChange === undefined ? undefined : (value) => onValueChange(String(value))}
    />
  );
}

export type TabsListProps = ElementProps<"div">;

function List({ children, ...props }: TabsListProps) {
  return (
    <BaseTabs.List {...props} className="cairn-TabsList">
      {children}
      <BaseTabs.Indicator className="cairn-TabsIndicator" />
    </BaseTabs.List>
  );
}

export type TabsTriggerProps = ElementProps<"button", "value"> & Readonly<{ value: string }>;

function Trigger(props: TabsTriggerProps) {
  return <BaseTabs.Tab {...props} className="cairn-TabsTrigger" />;
}

export type TabsContentProps = ElementProps<"div"> & Readonly<{ value: string; keepMounted?: boolean }>;

function Content(props: TabsContentProps) {
  return <BaseTabs.Panel {...props} className="cairn-TabsContent" />;
}

export const Tabs = { Root, List, Trigger, Content };
