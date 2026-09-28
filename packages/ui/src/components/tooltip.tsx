import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";

import { usePortalContainer } from "./internal/portal-container.js";

export function TooltipProvider({ children }: Readonly<{ children: ReactNode }>) {
  return <BaseTooltip.Provider delay={500}>{children}</BaseTooltip.Provider>;
}

export type TooltipProps = Readonly<{
  children: ReactElement;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

export function Tooltip({ children, content, side, ...props }: TooltipProps) {
  const { anchorRef, container } = usePortalContainer();
  return (
    <BaseTooltip.Root {...props}>
      <BaseTooltip.Trigger render={children} />
      <span hidden ref={anchorRef} />
      <BaseTooltip.Portal container={container}>
        <BaseTooltip.Positioner className="cairn-Positioner" side={side} sideOffset={8}>
          <BaseTooltip.Popup className="cairn-Tooltip">{content}</BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
