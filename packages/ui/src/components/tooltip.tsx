import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";
import { CairnPortalTheme } from "../cairn-theme.js";

export const tooltipPopupClassName =
  "cairn-overlay-popup max-w-64 rounded-sm bg-foreground px-2 py-1 text-caption text-background shadow-sm";

export function TooltipProvider({ children }: Readonly<{ children: ReactNode }>) {
  return <BaseTooltip.Provider delay={500}>{children}</BaseTooltip.Provider>;
}

export function Tooltip({ children, content }: Readonly<{ children: ReactElement; content: ReactNode }>) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <CairnPortalTheme>
          <BaseTooltip.Positioner className="z-50" sideOffset={8}>
            <BaseTooltip.Popup className={`${tooltipPopupClassName} cairn-tooltip-popup`}>{content}</BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </CairnPortalTheme>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
