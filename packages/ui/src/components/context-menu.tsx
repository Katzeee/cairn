import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import type { ReactElement, ReactNode } from "react";

import { usePortalContainer } from "./internal/portal-container.js";
import { CheckboxItem, Group, Item, Label, RadioGroup, RadioItem, Separator, Sub, SubTrigger } from "./internal/menu-parts.js";

function Root({ children }: Readonly<{ children: ReactNode }>) {
  return <BaseContextMenu.Root>{children}</BaseContextMenu.Root>;
}

function Trigger({ children }: Readonly<{ children: ReactElement }>) {
  return <BaseContextMenu.Trigger render={children} />;
}

function Content({ children }: Readonly<{ children: ReactNode }>) {
  const { anchorRef, container } = usePortalContainer();
  return (
    <>
      <span hidden ref={anchorRef} />
      <BaseContextMenu.Portal container={container}>
        <BaseContextMenu.Positioner className="cairn-Positioner">
          <BaseContextMenu.Popup className="cairn-Popup">{children}</BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    </>
  );
}

export const ContextMenu = {
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
  SubContent: Content,
};
