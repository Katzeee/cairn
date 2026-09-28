import { createContext, Fragment, useContext, type MouseEvent, type PointerEvent, type ReactNode } from "react";

import { OutlineEmptyChild } from "./outline-empty-child.js";
import type { ResolvedOutlineRowPresentation } from "./outline-presentation.js";
import type { OutlineEditorBinding, OutlineTreeEditing } from "./outline-tree-edit-contract.js";
import { OutlineTreeRow } from "./outline-tree-row.js";
import type { OutlineItemViewModel, OutlineMoveDestination, OutlineRowViewModel } from "./outline-tree-view-model.js";

/** Per-tree state and intents shared by every node; nodes only add their own row identity. */
export type OutlineNodeEnvironment = Readonly<{
  childrenViews?: ReadonlyMap<string, ReactNode>;
  consumeDragClick: () => boolean;
  createChild: (parent: OutlineRowViewModel) => void;
  draggable: boolean;
  draggedKeys: readonly string[];
  dropTarget: OutlineMoveDestination | null;
  editActiveKey: string | null;
  editBinding: OutlineEditorBinding | null;
  editing?: OutlineTreeEditing;
  focusKey: string | null;
  onCommitAndExit: () => void;
  onExpandedChange: (key: string, expanded: boolean) => void;
  onPointerDown: (key: string) => (event: PointerEvent) => void;
  onRowMouseDown: (row: OutlineRowViewModel) => (event: MouseEvent<HTMLDivElement>) => void;
  rowDomId: (key: string) => string;
  present: (row: OutlineRowViewModel, selected: boolean) => ResolvedOutlineRowPresentation;
  rowsByKey: ReadonlyMap<string, OutlineRowViewModel>;
  selectedKeys: ReadonlySet<string>;
  selectionRootKeys: ReadonlySet<string>;
  showGuides: boolean;
  supportsEmptyChildren: boolean;
}>;

const OutlineNodeContext = createContext<OutlineNodeEnvironment | null>(null);

export const OutlineNodeEnvironmentProvider = OutlineNodeContext.Provider;

function useOutlineNodeEnvironment(): OutlineNodeEnvironment {
  const environment = useContext(OutlineNodeContext);
  if (environment === null) {
    throw new Error("Outline nodes must render inside OutlineTree");
  }
  return environment;
}

export function OutlineChildren({
  items,
  parent,
  parentPresentation,
}: Readonly<{
  items: readonly OutlineItemViewModel[];
  parent: OutlineRowViewModel | null;
  parentPresentation?: ResolvedOutlineRowPresentation;
}>) {
  const environment = useOutlineNodeEnvironment();
  const parentKey = parent?.key ?? null;
  const beside = parentPresentation?.childrenLayout === "beside";
  const visible = parent === null || parent.expanded ? items : [];
  const dropIndex =
    environment.dropTarget?.targetParentKey === parentKey
      ? Math.min(environment.dropTarget.index, visible.length)
      : null;
  const placeholder =
    parent !== null &&
    parent.item.capabilities?.insertChildren !== false &&
    environment.supportsEmptyChildren &&
    !parent.hasChildren &&
    (parent.expanded || beside);
  if (visible.length === 0 && dropIndex === null && !placeholder) {
    return null;
  }
  return (
    <div
      className="cairn-OutlineChildren"
      data-indented={parent !== null && !beside ? "true" : undefined}
      data-parent-key={parentKey ?? undefined}
      data-ui="outline-children"
      role={parent === null ? undefined : "group"}
    >
      {environment.showGuides && parent !== null && !beside ? (
        <span aria-hidden className="cairn-OutlineGuide" />
      ) : null}
      {visible.map((item, index) => (
        <Fragment key={item.key}>
          {dropIndex === index ? <OutlineDropIndicator /> : null}
          <OutlineNode item={item} />
        </Fragment>
      ))}
      {dropIndex === visible.length ? <OutlineDropIndicator /> : null}
      {placeholder ? (
        <OutlineEmptyChild
          onActivate={() => environment.createChild(parent)}
          parentKey={parent.key}
          parentLabel={parent.item.accessibilityLabel}
        />
      ) : null}
    </div>
  );
}

function OutlineNode({ item }: Readonly<{ item: OutlineItemViewModel }>) {
  const environment = useOutlineNodeEnvironment();
  const row = environment.rowsByKey.get(item.key);
  if (row === undefined) {
    return null;
  }
  const selected = environment.selectedKeys.has(row.key);
  const presentation = environment.present(row, selected);
  const beside = presentation.childrenLayout === "beside";
  return (
    <div
      className="cairn-OutlineNode"
      data-selection-root={environment.selectionRootKeys.has(row.key) ? "true" : undefined}
      data-children-layout={beside ? "beside" : "indented"}
      data-ui="outline-node"
    >
      <div
        className={
          beside
            ? "cairn-outline-layout cairn-OutlineLayoutBeside"
            : "cairn-outline-layout"
        }
      >
        <OutlineTreeRow
          consumeDragClick={environment.consumeDragClick}
          cursor={row.key === environment.focusKey}
          draggable={environment.draggable && row.item.capabilities?.move !== false}
          dragged={environment.draggedKeys.includes(row.key)}
          editActiveKey={environment.editActiveKey}
          editBinding={environment.editBinding}
          editing={environment.editing}
          onCommitAndExit={environment.onCommitAndExit}
          onExpandedChange={environment.onExpandedChange}
          onPointerDown={environment.onPointerDown(row.key)}
          onRowMouseDown={environment.onRowMouseDown(row)}
          row={row}
          rowDomId={environment.rowDomId(row.key)}
          presentation={presentation}
          selected={selected}
          selectionRoot={environment.selectionRootKeys.has(row.key)}
        />
        {environment.childrenViews?.has(row.key) ? (
          row.expanded ? (
            <div role="group" className="cairn-OutlineBesideChildren" data-parent-key={row.key}>
              {environment.childrenViews.get(row.key)}
            </div>
          ) : null
        ) : (
          <OutlineChildren items={item.children ?? []} parent={row} parentPresentation={presentation} />
        )}
      </div>
    </div>
  );
}

// Zero-height in flow so the line sits exactly in the gap without shifting rows while dragging.
function OutlineDropIndicator() {
  return (
    <div aria-hidden className="cairn-OutlineDropIndicator" data-ui="outline-drop-indicator">
      <div className="cairn-OutlineDropLine">
        <span className="cairn-OutlineDropDot" />
        <span className="cairn-OutlineDropBar" />
      </div>
    </div>
  );
}
