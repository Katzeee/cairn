import { Popover as BasePopover } from "@base-ui/react/popover";
import type { ReactElement, ReactNode } from "react";

import { usePortalContainer } from "./internal/portal-container.js";
import type { ControlSize } from "./internal/variants.js";

export type PopoverRootProps = Readonly<{
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

export type PopoverContentProps = Readonly<{
  children: ReactNode;
  size?: ControlSize;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}>;

function Root({ children, ...props }: PopoverRootProps) {
  return <BasePopover.Root {...props}>{children}</BasePopover.Root>;
}

function Trigger({ children }: Readonly<{ children: ReactElement }>) {
  return <BasePopover.Trigger render={children} />;
}

function Content({ children, size = "md", side, align }: PopoverContentProps) {
  const { anchorRef, container } = usePortalContainer();
  return (
    <>
      <span hidden ref={anchorRef} />
      <BasePopover.Portal container={container}>
        <BasePopover.Positioner align={align} className="cairn-Positioner" side={side} sideOffset={8}>
          <BasePopover.Popup className="cairn-Popup cairn-PopoverContent" data-size={size}>
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </>
  );
}

function Title({ children }: Readonly<{ children: ReactNode }>) {
  return <BasePopover.Title className="cairn-PopoverTitle">{children}</BasePopover.Title>;
}

function Close({ children }: Readonly<{ children: ReactElement }>) {
  return <BasePopover.Close render={children} />;
}

export const Popover = { Root, Trigger, Content, Title, Close };
