import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { WindowChrome } from "./app-shell.js";
import { Button, IconButton } from "./button.js";
import { DropdownMenu } from "./dropdown-menu.js";
import { Icon, type IconName } from "./icon.js";
import { useWindowActive } from "./internal/window-active.js";
import { PaneBack } from "./list-detail.js";
import { Tooltip } from "./tooltip.js";

// Primary actions keep their label and the trailing edge, and give up the label first; default
// actions move into More, last declared first, when space runs out; secondary actions always live in
// More. Every action has the same quiet style: emphasis in a bar comes from position, not fill.
export type PageBarActionPlacement = "primary" | "default" | "secondary";

type ActionEntry = Readonly<{
  id: string;
  label: string;
  icon: IconName;
  placement: PageBarActionPlacement;
  disabled: boolean;
  marker: HTMLElement;
  select: RefObject<() => void>;
}>;

type Arrangement = Readonly<{ compact: boolean; shown: readonly string[] }>;

type PageBarState = Readonly<{
  register: (entry: ActionEntry) => void;
  unregister: (id: string) => void;
  claimBack: () => () => void;
}>;

const PageBarContext = createContext<PageBarState | null>(null);

function usePageBar(part: string): PageBarState {
  const bar = useContext(PageBarContext);
  if (bar === null) throw new Error(`PageBar.${part} must be placed inside PageBar.Root.`);
  return bar;
}

function scrollParent(element: HTMLElement): HTMLElement | Window {
  for (let node = element.parentElement; node !== null; node = node.parentElement) {
    if (/auto|scroll/.test(getComputedStyle(node).overflowY)) return node;
  }
  return window;
}

// The bar rests flush with the page and gains its divider once content scrolls beneath it.
function useScrolledUnder(bar: RefObject<HTMLElement | null>) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const element = bar.current;
    if (element === null) return;
    const scroller = scrollParent(element);
    const update = () => setScrolled((scroller instanceof Window ? scroller.scrollY : scroller.scrollTop) > 0);
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    return () => scroller.removeEventListener("scroll", update);
  }, [bar]);
  return scrolled;
}

type Widths = ReadonlyMap<string, Readonly<{ full: number; compact: number }>>;

// Space runs out in three steps: primary actions drop their labels, default actions move into More,
// and only then does the title truncate.
function arrange(actions: readonly ActionEntry[], widths: Widths, more: number, gap: number, room: number): Arrangement {
  const inBar = actions.filter((action) => action.placement !== "secondary");
  const needed = (shown: readonly ActionEntry[], compact: boolean) => {
    const items = shown.map((action) => {
      const width = widths.get(action.id);
      return action.placement === "primary" && !compact ? (width?.full ?? 0) : (width?.compact ?? 0);
    });
    if (shown.length < actions.length) items.push(more);
    return items.reduce((sum, width) => sum + width, 0) + gap * Math.max(0, items.length - 1);
  };
  const ids = (shown: readonly ActionEntry[]) => shown.map((action) => action.id);
  if (needed(inBar, false) <= room) return { compact: false, shown: ids(inBar) };
  const shown = [...inBar];
  const collapsible = shown.filter((action) => action.placement === "default");
  while (collapsible.length > 0 && needed(shown, true) > room) shown.splice(shown.indexOf(collapsible.pop()!), 1);
  return { compact: true, shown: ids(shown) };
}

const moreButton = (
  <IconButton aria-label="More actions" size="sm" variant="ghost">
    <Icon name="ellipsis" size="sm" />
  </IconButton>
);

function ActionButton({ action, compact, measuring = false }: Readonly<{ action: ActionEntry; compact: boolean; measuring?: boolean }>) {
  const { label, icon, placement, disabled, select } = action;
  const onClick = () => select.current();
  if (placement === "primary" && !compact) {
    return (
      <Button disabled={disabled} onClick={onClick} size="sm" variant="ghost">
        <Icon name={icon} size="sm" />
        {label}
      </Button>
    );
  }
  const button = (
    <IconButton
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      size="sm"
      variant="ghost"
    >
      <Icon name={icon} size="sm" />
    </IconButton>
  );
  return measuring ? button : <Tooltip content={label}>{button}</Tooltip>;
}

const byDeclaration = (a: ActionEntry, b: ActionEntry) =>
  a.marker.compareDocumentPosition(b.marker) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

function Root({ children }: Readonly<{ children: ReactNode }>) {
  const bar = useRef<HTMLElement>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const scrolled = useScrolledUnder(bar);
  const [entries, setEntries] = useState<ReadonlyMap<string, ActionEntry>>(new Map());
  const [arrangement, setArrangement] = useState<Arrangement>();
  // A stacked detail pane offers its way back unless the page declares its own.
  const paneBack = useContext(PaneBack);
  const [declaredBacks, setDeclaredBacks] = useState(0);
  const claimBack = useCallback(() => {
    setDeclaredBacks((count) => count + 1);
    return () => setDeclaredBacks((count) => count - 1);
  }, []);

  const register = useCallback((entry: ActionEntry) => setEntries((current) => new Map(current).set(entry.id, entry)), []);
  const unregister = useCallback(
    (id: string) =>
      setEntries((current) => {
        const next = new Map(current);
        next.delete(id);
        return next;
      }),
    [],
  );

  const declared = [...entries.values()].sort(byDeclaration);
  const actions = [
    ...declared.filter((action) => action.placement !== "primary"),
    ...declared.filter((action) => action.placement === "primary"),
  ];
  const dragRegion = useContext(WindowChrome);
  const windowActive = useWindowActive();
  const latest = useRef(actions);
  latest.current = actions;

  // Actions get the room the back button and the title's full width leave them.
  const update = useCallback(() => {
    const element = bar.current;
    const measure = ruler.current;
    if (element === null || measure === null) return;
    const style = getComputedStyle(element);
    const gap = parseFloat(style.columnGap) || 0;
    const box = element.getBoundingClientRect();
    const start = box.left + (parseFloat(style.paddingLeft) || 0);
    const end = box.right - (parseFloat(style.paddingRight) || 0);
    const back = element.querySelector<HTMLElement>(":scope > .cairn-PageBarBack");
    const leading = back === null ? 0 : back.getBoundingClientRect().right - start + gap;
    const texts = element.querySelectorAll<HTMLElement>(":scope > :is(.cairn-PageBarTitle, .cairn-PageBarSubtitle)");
    // The title stretches across its column, so measure the text it holds rather than the element.
    const range = document.createRange();
    const heading = Math.max(
      0,
      ...[...texts].map((text) => {
        range.selectNodeContents(text);
        return Math.ceil(range.getBoundingClientRect().width);
      }),
    );
    const widths: Widths = new Map(
      [...measure.querySelectorAll<HTMLElement>("[data-action]")].map((item) => {
        const [full, compact] = [...item.children].map((child) => child.getBoundingClientRect().width);
        return [item.dataset.action!, { full: full ?? 0, compact: compact ?? 0 }] as const;
      }),
    );
    const more = measure.querySelector<HTMLElement>("[data-more]")?.getBoundingClientRect().width ?? 0;
    const next = arrange(latest.current, widths, more, parseFloat(getComputedStyle(measure).columnGap) || 0, end - start - leading - heading - gap);
    setArrangement((current) =>
      current?.compact === next.compact && current.shown.join() === next.shown.join() ? current : next,
    );
  }, []);

  useLayoutEffect(update);
  useLayoutEffect(() => {
    const element = bar.current;
    if (element === null) return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [update]);

  const inBar = actions.filter((action) => action.placement !== "secondary");
  const shown = arrangement === undefined ? inBar : inBar.filter((action) => arrangement.shown.includes(action.id));
  const overflow = actions.filter((action) => !shown.includes(action));

  return (
    <PageBarContext.Provider value={{ register, unregister, claimBack }}>
      <header
        {...dragRegion}
        className="cairn-PageBar"
        data-scrolled={scrolled}
        data-window-active={dragRegion === null ? undefined : windowActive}
        data-window-drag-region={dragRegion === null ? undefined : ""}
        ref={bar}
      >
        {paneBack === null || declaredBacks > 0 ? null : <BackButton label={paneBack.label} onSelect={paneBack.onSelect} />}
        {children}
        {actions.length === 0 ? null : (
          <div className="cairn-PageBarActions">
            {shown.map((action) => (
              <ActionButton action={action} compact={arrangement?.compact ?? false} key={action.id} />
            ))}
            {overflow.length === 0 ? null : (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>{moreButton}</DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  {overflow.map((action) => (
                    <DropdownMenu.Item disabled={action.disabled} key={action.id} onSelect={() => action.select.current()}>
                      {action.label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
          </div>
        )}
        <div aria-hidden className="cairn-PageBarMeasure" inert ref={ruler}>
          {actions.map((action) => (
            <span data-action={action.id} key={action.id}>
              <ActionButton action={action} compact={false} measuring />
              <ActionButton action={action} compact measuring />
            </span>
          ))}
          <span data-more="">{moreButton}</span>
        </div>
      </header>
    </PageBarContext.Provider>
  );
}

// Inside a list-detail's detail pane the bar adds this itself where the panes stack.
function Back({ label, onSelect }: Readonly<{ label: string; onSelect: () => void }>) {
  const { claimBack } = usePageBar("Back");
  useLayoutEffect(claimBack, [claimBack]);
  return <BackButton label={label} onSelect={onSelect} />;
}

function BackButton({ label, onSelect }: Readonly<{ label: string; onSelect: () => void }>) {
  return (
    <span className="cairn-PageBarBack">
      <Tooltip content={label}>
        <IconButton aria-label={label} onClick={onSelect} size="sm" variant="ghost">
          <Icon name="arrow-left" size="sm" />
        </IconButton>
      </Tooltip>
    </span>
  );
}

function Title({ children }: Readonly<{ children: ReactNode }>) {
  usePageBar("Title");
  return <h1 className="cairn-PageBarTitle">{children}</h1>;
}

function Subtitle({ children }: Readonly<{ children: ReactNode }>) {
  usePageBar("Subtitle");
  return <p className="cairn-PageBarSubtitle">{children}</p>;
}

export type PageBarActionProps = Readonly<{
  label: string;
  // The icon shows in the bar and the label in More, so every action carries both.
  icon: IconName;
  onSelect: () => void;
  placement?: PageBarActionPlacement;
  disabled?: boolean;
}>;

// The bar renders actions itself so it can move them into More; the marker keeps their declared order.
function Action({ label, icon, onSelect, placement = "default", disabled = false }: PageBarActionProps) {
  const { register, unregister } = usePageBar("Action");
  const id = useId();
  const marker = useRef<HTMLSpanElement>(null);
  const select = useRef(onSelect);
  useLayoutEffect(() => {
    select.current = onSelect;
  });
  useLayoutEffect(() => {
    register({ id, label, icon, placement, disabled, marker: marker.current!, select });
  }, [register, id, label, icon, placement, disabled]);
  useLayoutEffect(() => () => unregister(id), [unregister, id]);
  return <span hidden ref={marker} />;
}

export const PageBar = { Root, Back, Title, Subtitle, Action };
