import { OutlineBulletStateProvider } from "./outline-bullet.js";
import { useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

import { Menu } from "@base-ui/react/menu";
import { ChevronRight, Ellipsis, IndentIncrease } from "lucide-react";
import { Icon } from "./foundation.js";
import type { OutlineHostCommand } from "./outline-commands.js";
import type { ResolvedOutlineBulletPresentation } from "./outline-presentation.js";
import type { OutlineRowViewModel } from "./outline-tree-view-model.js";

export function OutlineSelectionToolbar({
  containerRef,
  anchorKey,
  count,
  commands,
  canExecuteCommand,
  executeCommand,
  onDelete,
  onMove,
}: Readonly<{
  containerRef: RefObject<HTMLDivElement | null>;
  anchorKey: string | null;
  count: number;
  commands?: readonly OutlineHostCommand[];
  canExecuteCommand: (id: string) => boolean;
  executeCommand: (id: string) => boolean;
  onDelete?: () => void;
  onMove?: (operation: "indent" | "outdent" | "reorder-down" | "reorder-up") => void;
}>) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const container = containerRef.current;
    const toolbar = toolbarRef.current;
    if (container === null || toolbar === null) {
      return;
    }
    const update = () => {
      const anchor = Array.from(container.querySelectorAll<HTMLElement>('[data-ui="outline-row"]')).find(
        (row) => row.dataset.itemKey === anchorKey,
      );
      if (anchor === undefined) {
        return;
      }
      const tree = container.getBoundingClientRect();
      const row = anchor.getBoundingClientRect();
      const height = toolbar.offsetHeight;
      const width = toolbar.offsetWidth;
      const left = Math.max(8, Math.min(row.left - 1.5, globalThis.innerWidth - width - 8));
      const top = Math.max(8, Math.min(row.top - height - 6, globalThis.innerHeight - height - 8));
      toolbar.style.left = `${String(left - tree.left)}px`;
      toolbar.style.top = `${String(top - tree.top)}px`;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(toolbar);
    globalThis.addEventListener("scroll", update, true);
    globalThis.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      globalThis.removeEventListener("scroll", update, true);
      globalThis.removeEventListener("resize", update);
    };
  }, [containerRef, anchorKey, count]);
  const actionClass = "cairn-OutlineToolbarAction";
  return (
    <div
      aria-label={`${String(count)} items selected`}
      className="cairn-OutlineToolbar"
      data-ui="outline-selection-toolbar"
      onClick={(event) => event.stopPropagation()}
      role="toolbar"
      ref={toolbarRef}
    >
      {onMove === undefined ? null : (
        <button
          type="button"
          aria-label="Indent selected nodes"
          className={actionClass}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onMove("indent")}
        >
          <Icon glyph={IndentIncrease} size="sm" />
        </button>
      )}
      {commands?.map((command) => (
        <button
          key={command.id}
          type="button"
          className="cairn-OutlineToolbarAction cairn-OutlineToolbarTextAction"
          disabled={!canExecuteCommand(command.id)}
          onClick={() => executeCommand(command.id)}
        >
          {command.label}
        </button>
      ))}
      {onMove === undefined && onDelete === undefined ? null : (
        <Menu.Root>
          <Menu.Trigger className={actionClass} aria-label="More commands">
            <Icon glyph={Ellipsis} size="sm" />
          </Menu.Trigger>
          <Menu.Portal>
            <>
              <Menu.Positioner sideOffset={4} className="cairn-Positioner">
                <Menu.Popup
                  data-outline-owner={containerRef.current?.id}
                  className="cairn-Popup"
                  finalFocus={containerRef}
                >
                  {onMove === undefined
                    ? null
                    : (
                        [
                          ["indent", "Indent"],
                          ["outdent", "Outdent"],
                          ["reorder-up", "Move up"],
                          ["reorder-down", "Move down"],
                        ] as const
                      ).map(([operation, label]) => (
                        <Menu.Item key={operation} className="cairn-PopupItem" onClick={() => onMove(operation)}>
                          {label}
                        </Menu.Item>
                      ))}
                  {onDelete === undefined ? null : (
                    <Menu.Item className="cairn-PopupItem" data-variant="destructive" onClick={onDelete}>
                      Delete
                    </Menu.Item>
                  )}
                </Menu.Popup>
              </Menu.Positioner>
            </>
          </Menu.Portal>
        </Menu.Root>
      )}
    </div>
  );
}

export function OutlineRowControls({
  beforeIntent,
  bullet,
  consumeDragClick,
  draggable,
  onDragHandleDown,
  onExpandedChange,
  row,
}: Readonly<{
  beforeIntent: () => void;
  bullet: ResolvedOutlineBulletPresentation;
  consumeDragClick: () => boolean;
  draggable: boolean;
  onDragHandleDown: (event: ReactPointerEvent) => void;
  onExpandedChange: (key: string, expanded: boolean) => void;
  row: OutlineRowViewModel;
}>) {
  return (
    <OutlineBulletStateProvider value={{ hasChildren: row.hasChildren, expanded: row.expanded }}>
      <span className="cairn-OutlineControl">
        <button
          aria-label={
            row.expanded ? `Collapse ${row.item.accessibilityLabel}` : `Expand ${row.item.accessibilityLabel}`
          }
          className="cairn-OutlineDisclosure"
          data-expanded={row.expanded ? "true" : undefined}
          data-hidden={!row.expandable ? "true" : undefined}
          onClick={(event) => {
            event.stopPropagation();
            onExpandedChange(row.key, !row.expanded);
          }}
          onMouseDown={(event) => event.preventDefault()}
          tabIndex={-1}
          type="button"
        >
          <span
            className="cairn-OutlineDisclosureIcon"
          >
            <Icon glyph={ChevronRight} size="xs" />
          </span>
        </button>
        {bullet.onActivate === undefined ? (
          <span
            aria-hidden
            className="cairn-OutlineBulletControl"
            data-draggable={draggable ? "true" : undefined}
            data-ui="outline-bullet"
            onPointerDown={draggable ? onDragHandleDown : undefined}
          >
            {bullet.content}
          </span>
        ) : (
          <button
            aria-label={bullet.accessibilityLabel ?? `Activate ${row.item.accessibilityLabel}`}
            className="cairn-OutlineBulletControl cairn-OutlineBulletButton"
            data-draggable={draggable ? "true" : undefined}
            data-ui="outline-bullet"
            onClick={(event) => {
              event.stopPropagation();
              if (!consumeDragClick()) {
                beforeIntent();
                bullet.onActivate?.();
              }
            }}
            onMouseDown={(event) => event.preventDefault()}
            onPointerDown={draggable ? onDragHandleDown : undefined}
            tabIndex={-1}
            type="button"
          >
            {bullet.content}
          </button>
        )}
      </span>
    </OutlineBulletStateProvider>
  );
}
