import { Menu } from "@base-ui/react/menu";
import type { ReactElement, ReactNode } from "react";

import { usePortalContainer } from "./internal/portal-container.js";
import { CheckboxItem, Group, Item, Label, RadioGroup, RadioItem, Separator, Sub, SubTrigger } from "./internal/menu-parts.js";

export type { MenuCheckboxItemProps, MenuItemProps, MenuRadioGroupProps, MenuRadioItemProps } from "./internal/menu-parts.js";

export type DropdownMenuRootProps = Readonly<{
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

export type DropdownMenuContentProps = Readonly<{
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}>;

function Root({ children, ...props }: DropdownMenuRootProps) {
  return <Menu.Root {...props}>{children}</Menu.Root>;
}

function Trigger({ children }: Readonly<{ children: ReactElement }>) {
  return <Menu.Trigger render={children} />;
}

function Popup({ children, side, align, sideOffset }: DropdownMenuContentProps & Readonly<{ sideOffset: number }>) {
  const { anchorRef, container } = usePortalContainer();
  return (
    <>
      <span hidden ref={anchorRef} />
      <Menu.Portal container={container}>
        <Menu.Positioner align={align} className="cairn-Positioner" side={side} sideOffset={sideOffset}>
          <Menu.Popup className="cairn-Popup">{children}</Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </>
  );
}

function Content({ align = "start", ...props }: DropdownMenuContentProps) {
  return <Popup {...props} align={align} sideOffset={8} />;
}

function SubContent({ children }: Readonly<{ children: ReactNode }>) {
  return <Popup sideOffset={4}>{children}</Popup>;
}

export const DropdownMenu = {
  Root,
  Trigger,
  Content,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Label,
  Group,
  Separator,
  Sub,
  SubTrigger,
  SubContent,
};
