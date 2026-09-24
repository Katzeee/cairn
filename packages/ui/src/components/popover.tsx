import { Popover as BasePopover } from "@base-ui/react/popover";
import type { ReactElement, ReactNode } from "react";
import { CairnPortalTheme } from "../cairn-theme.js";

export function Popover({
  children,
  title,
  trigger,
}: Readonly<{
  children: ReactNode;
  title?: string;
  trigger: ReactElement;
}>) {
  return (
    <BasePopover.Root>
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <CairnPortalTheme>
          <BasePopover.Positioner className="z-50 outline-none" sideOffset={8}>
            <BasePopover.Popup className="cairn-overlay-popup w-72 max-w-full rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none">
              {title === undefined ? null : (
                <BasePopover.Title className="mb-2 text-label font-semibold">{title}</BasePopover.Title>
              )}
              {children}
            </BasePopover.Popup>
          </BasePopover.Positioner>
        </CairnPortalTheme>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
