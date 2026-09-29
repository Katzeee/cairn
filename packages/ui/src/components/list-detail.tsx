import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { widthTierFor } from "./internal/width-tier.js";

export type ListDetailPane = "list" | "detail";

// Both panes side by side where the region is expanded; one at a time, as a stack, where it is not.
type Layout = "split" | "stack";

type ListDetailState = Readonly<{
  layout: Layout;
  pane: ListDetailPane;
  showPane: (pane: ListDetailPane) => void;
  listLabel: string | undefined;
  registerListLabel: (label: string | undefined) => void;
  list: RefObject<HTMLElement | null>;
  detail: RefObject<HTMLElement | null>;
  focusedPane: RefObject<ListDetailPane | null>;
}>;

const ListDetailContext = createContext<ListDetailState | null>(null);

function useListDetail(part: string): ListDetailState {
  const state = useContext(ListDetailContext);
  if (state === null) throw new Error(`ListDetail.${part} must be placed inside ListDetail.Root.`);
  return state;
}

// Given to a page bar inside a pane: the back step a stacked detail offers. PageBar shows it itself.
export const PaneBack = createContext<Readonly<{ label: string; onSelect: () => void }> | null>(null);

// Given to list rows inside the list pane: whether the detail they open shows beside them, and how to
// open it.
export const ListPane = createContext<Readonly<{ layout: Layout; showDetail: () => void }> | null>(null);

export type ListDetailRootProps = Readonly<{
  children: ReactNode;
  // The pane the user is working in. Where both panes fit it changes nothing on screen; where only
  // one fits, it is the one shown. Rows of a List inside ListDetail.List open the detail themselves.
  pane?: ListDetailPane;
  defaultPane?: ListDetailPane;
  onPaneChange?: (pane: ListDetailPane) => void;
}>;

// The panes scroll themselves, so the root fills a region of known height, such as AppShell.Main
// with scroll="panes".
function Root({ children, pane: controlledPane, defaultPane = "list", onPaneChange }: ListDetailRootProps) {
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLElement>(null);
  const detail = useRef<HTMLElement>(null);
  const focusedPane = useRef<ListDetailPane>(null);
  const opener = useRef<HTMLElement>(null);
  const [layout, setLayout] = useState<Layout>("split");
  const [uncontrolledPane, setUncontrolledPane] = useState(defaultPane);
  const [listLabel, registerListLabel] = useState<string>();
  const pane = controlledPane ?? uncontrolledPane;
  // Pane navigation animates; measuring or resizing the region settles immediately.
  const [motion, setMotion] = useState({ layout, pane, enabled: false });
  if (motion.layout !== layout || motion.pane !== pane) {
    setMotion({ layout, pane, enabled: motion.layout === layout && layout === "stack" && motion.pane !== pane });
  }

  const latest = useRef({ pane, controlledPane, onPaneChange });
  useLayoutEffect(() => {
    latest.current = { pane, controlledPane, onPaneChange };
  });
  const showPane = useCallback((next: ListDetailPane) => {
    if (latest.current.pane === next) return;
    // Remember the row that opened the detail while it can still hold focus.
    if (next === "detail") {
      const active = document.activeElement;
      opener.current = active instanceof HTMLElement && list.current?.contains(active) ? active : null;
    }
    if (latest.current.controlledPane === undefined) setUncontrolledPane(next);
    latest.current.onPaneChange?.(next);
  }, []);

  useLayoutEffect(() => {
    const element = root.current;
    if (element === null) return;
    const update = () => setLayout(widthTierFor(element.getBoundingClientRect().width) === "expanded" ? "split" : "stack");
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // In a stack, focus follows the pane shown: into the detail it opens, back to the row it came from.
  // A pane that leaves the screen as the region narrows hands focus to the one that stays.
  const previous = useRef({ layout, pane });
  useEffect(() => {
    const from = previous.current;
    previous.current = { layout, pane };
    if (layout !== "stack") return;
    if (from.layout === "stack" && from.pane !== pane) {
      if (pane === "detail") detail.current?.focus({ preventScroll: true });
      else if (opener.current?.isConnected) opener.current.focus();
      else list.current?.focus({ preventScroll: true });
    } else if (from.layout === "split" && focusedPane.current !== null && focusedPane.current !== pane) {
      const active = document.activeElement;
      if (active === null || active === document.body) (pane === "list" ? list : detail).current?.focus({ preventScroll: true });
    }
  }, [layout, pane]);

  return (
    <ListDetailContext.Provider
      value={{ layout, pane, showPane, listLabel, registerListLabel, list, detail, focusedPane }}
    >
      <div
        className="cairn-ListDetail"
        data-animate={motion.enabled ? "" : undefined}
        data-layout={layout}
        data-ui="list-detail"
        onBlur={(event) => {
          if (event.relatedTarget !== null && !root.current?.contains(event.relatedTarget)) focusedPane.current = null;
        }}
        ref={root}
      >
        {children}
      </div>
    </ListDetailContext.Provider>
  );
}

export type ListDetailListProps = Readonly<{
  // Names the list region, and the back step from a stacked detail.
  label: string;
  children: ReactNode;
}>;

function List({ label, children }: ListDetailListProps) {
  const { layout, pane, showPane, registerListLabel, list, focusedPane } = useListDetail("List");
  useLayoutEffect(() => {
    registerListLabel(label);
    return () => registerListLabel(undefined);
  }, [registerListLabel, label]);
  const rows = useMemo(() => ({ layout, showDetail: () => showPane("detail") }), [layout, showPane]);
  const shown = layout === "split" || pane === "list";
  return (
    <section
      aria-label={label}
      className="cairn-ListDetailList"
      data-shown={shown}
      inert={!shown}
      onFocus={() => {
        focusedPane.current = "list";
      }}
      ref={list}
      tabIndex={-1}
    >
      <PaneBack.Provider value={null}>
        <ListPane.Provider value={rows}>{children}</ListPane.Provider>
      </PaneBack.Provider>
    </section>
  );
}

export type ListDetailDetailProps = Readonly<{
  // Names the detail region, which takes focus when it replaces the list.
  label?: string;
  children: ReactNode;
}>;

function Detail({ label = "Details", children }: ListDetailDetailProps) {
  const { layout, pane, showPane, listLabel, detail, focusedPane } = useListDetail("Detail");
  const back = useMemo(
    () => (layout === "stack" ? { label: listLabel === undefined ? "Back" : `Back to ${listLabel}`, onSelect: () => showPane("list") } : null),
    [layout, listLabel, showPane],
  );
  const shown = layout === "split" || pane === "detail";
  return (
    <section
      aria-label={label}
      className="cairn-ListDetailDetail"
      data-shown={shown}
      inert={!shown}
      onFocus={() => {
        focusedPane.current = "detail";
      }}
      ref={detail}
      tabIndex={-1}
    >
      <ListPane.Provider value={null}>
        <PaneBack.Provider value={back}>{children}</PaneBack.Provider>
      </ListPane.Provider>
    </section>
  );
}

export const ListDetail = { Root, List, Detail };
