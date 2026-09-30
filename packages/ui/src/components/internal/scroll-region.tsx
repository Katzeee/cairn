import { CSPProvider } from "@base-ui/react/csp-provider";
import { ScrollArea } from "@base-ui/react/scroll-area";
import type { ReactElement, ReactNode, Ref } from "react";

import { cn } from "./cn.js";

// A region whose size the layout imposes scrolls under an overlay scrollbar, so the width its content
// gets never depends on whether it overflows. The document keeps the platform's scrollbar instead.
// The viewport is what scrolls, so it takes focus: from script, or from a click on content that
// holds none of its own. Like a native scroller, it adds no stop to the tab order.
export type ScrollRegionProps = Readonly<{
  // The region's own element; it keeps its layout and receives the scrollbars. Defaults to a div.
  render?: ReactElement;
  viewportId?: string;
  viewportRef?: Ref<HTMLDivElement>;
  // Lays out the scrolled content, which fills at least the viewport.
  contentClassName?: string;
  children: ReactNode;
}>;

export function ScrollRegion({ render, viewportId, viewportRef, contentClassName, children }: ScrollRegionProps) {
  return (
    // base.css hides the native scrollbars, so Base UI injects no style element.
    <CSPProvider disableStyleElements>
      <ScrollArea.Root className="cairn-ScrollRegion" render={render}>
        <ScrollArea.Viewport className="cairn-ScrollRegionViewport" id={viewportId} ref={viewportRef} tabIndex={-1}>
          <ScrollArea.Content className={cn("cairn-ScrollRegionContent", contentClassName)}>{children}</ScrollArea.Content>
        </ScrollArea.Viewport>
        <Scrollbar orientation="vertical" />
        <Scrollbar orientation="horizontal" />
      </ScrollArea.Root>
    </CSPProvider>
  );
}

function Scrollbar({ orientation }: Readonly<{ orientation: "vertical" | "horizontal" }>) {
  return (
    <ScrollArea.Scrollbar className="cairn-Scrollbar" orientation={orientation}>
      <ScrollArea.Thumb className="cairn-ScrollbarThumb" />
    </ScrollArea.Scrollbar>
  );
}
