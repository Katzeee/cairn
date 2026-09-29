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

import breakpoints from "./breakpoints.json" with { type: "json" };
import { IconButton } from "./button.js";
import { Icon, type IconName } from "./icon.js";
import type { ElementProps } from "./internal/element-props.js";
import { useWindowActive } from "./internal/window-active.js";
import type { ControlSize } from "./internal/variants.js";
import { Tooltip } from "./tooltip.js";

type Tier = "compact" | "medium" | "expanded";

// Tiers follow the shell's own width on the shared breakpoint scale, so a shell inside a resizable
// preview adapts the way a window does.
const tierFor = (width: number): Tier => (width < breakpoints.sm ? "compact" : width < breakpoints.md ? "medium" : "expanded");

// The vertical tier follows the shell's shape, height over width: short below 0.8 (a phone on its
// side, a half-open foldable), square up to 1.2 (a wide foldable's cover screen), tall beyond.
type HeightTier = "compact" | "medium" | "expanded";
const heightTierFor = (width: number, height: number): HeightTier => {
  const ratio = height / width;
  return ratio < 0.8 ? "compact" : ratio < 1.2 ? "medium" : "expanded";
};

type SidebarState = Readonly<{
  id: string;
  collapsible: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}>;

type Presentation = "docked" | "overlay" | "hidden";

type ShellAction = "toggleSidebar";

// Default key table: Control-Command-S, the macOS Show/Hide Sidebar command.
function sidebarShortcut(event: globalThis.KeyboardEvent): ShellAction | undefined {
  const chord = event.ctrlKey && event.metaKey && !event.altKey && !event.shiftKey;
  return chord && event.key.toLowerCase() === "s" ? "toggleSidebar" : undefined;
}

function presentationFor(tier: Tier, sidebar: SidebarState, requested: boolean): Presentation {
  if (tier === "expanded") return !sidebar.collapsible || sidebar.open || requested ? "docked" : "hidden";
  return requested ? "overlay" : "hidden";
}

type ShellState = Readonly<{
  tier: Tier;
  sidebar: SidebarState | undefined;
  registerSidebar: (sidebar: SidebarState | undefined) => void;
  registerTabBar: (present: boolean) => void;
  presentation: Presentation;
  overlayOpen: boolean;
  toggleSidebar: () => void;
  closeOverlay: () => void;
  toggle: RefObject<HTMLButtonElement | null>;
  mainId: string;
}>;

const ShellContext = createContext<ShellState | null>(null);

function useShell(part: string): ShellState {
  const shell = useContext(ShellContext);
  if (shell === null) throw new Error(`AppShell.${part} must be placed inside AppShell.Root.`);
  return shell;
}

// Attributes a host adapter puts on elements that move the window, such as Tauri's drag region.
export type AppShellDragRegion = Readonly<Record<`data-${string}`, string>>;

// Given to the page bars when they form the window's top row.
export const WindowChrome = createContext<AppShellDragRegion | null>(null);

export type AppShellRootProps = Readonly<{
  children: ReactNode;
  // A page scrolls the document under a sticky header; panes fill the viewport and scroll themselves.
  scroll?: "page" | "panes";
  // The window's top row is the shell's own: the sidebar toggle over the sidebar and each page bar
  // over its pane, clear of the system window controls. Every page then starts with a PageBar. Pass
  // the host adapter's drag region, or {} where the host moves windows through CSS app-region.
  windowChrome?: AppShellDragRegion;
  // A separate title bar row above the shell, for apps that keep window chrome apart from pages.
  titleBar?: ReactNode;
}>;

function Root({ children, scroll = "page", windowChrome, titleBar }: AppShellRootProps) {
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const mainId = useId();
  const [tier, setTier] = useState<Tier>("expanded");
  const [heightTier, setHeightTier] = useState<HeightTier>("expanded");
  const [sidebar, registerSidebar] = useState<SidebarState>();
  const [tabBar, registerTabBar] = useState(false);
  const [overlayRequested, setOverlayRequested] = useState(false);
  if (sidebar !== undefined && tabBar) throw new Error("AppShell.Root takes either a Sidebar or a TabBar, not both.");

  useLayoutEffect(() => {
    const element = root.current;
    if (element === null) return;
    // A page-scrolling shell grows with its content, so its visible height is the viewport's.
    const update = () => {
      const { width, height } = element.getBoundingClientRect();
      setTier(tierFor(width));
      setHeightTier(heightTierFor(width, Math.min(height, window.innerHeight)));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // An overlay the user opened stays shown, docked, once the shell is wide enough.
  useLayoutEffect(() => {
    if (!overlayRequested || (sidebar !== undefined && tier !== "expanded")) return;
    // Clear the request only once the sidebar reports open, so no render in between hides it.
    if (sidebar?.collapsible && !sidebar.open) sidebar.setOpen(true);
    else setOverlayRequested(false);
  }, [overlayRequested, sidebar, tier]);

  const overlayOpen = overlayRequested && sidebar !== undefined && tier !== "expanded";
  const presentation = sidebar === undefined ? "hidden" : presentationFor(tier, sidebar, overlayRequested);
  // Tabs leave the bottom edge where the shell is wide, or too short to spare a row for them.
  const tabsBeside = tier === "expanded" || heightTier === "compact";
  const column = presentation === "docked" ? "sidebar" : tabBar && tabsBeside ? "tabs" : "none";

  const toggleSidebar = useCallback(() => {
    if (sidebar === undefined) return;
    if (tier !== "expanded") setOverlayRequested((open) => !open);
    else if (sidebar.collapsible) sidebar.setOpen(!sidebar.open);
  }, [sidebar, tier]);
  const closeOverlay = useCallback(() => setOverlayRequested(false), []);
  const chromeToggle = sidebar !== undefined && (sidebar.collapsible || presentation !== "docked");

  // Show or hide the sidebar from anywhere in the window. Keys the table does not name propagate.
  const toggleAvailable = sidebar !== undefined && (sidebar.collapsible || tier !== "expanded");
  useEffect(() => {
    if (!toggleAvailable) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (sidebarShortcut(event) !== "toggleSidebar") return;
      event.preventDefault();
      toggleSidebar();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleAvailable, toggleSidebar]);

  return (
    <ShellContext.Provider
      value={{
        tier,
        sidebar,
        registerSidebar,
        registerTabBar,
        presentation,
        overlayOpen,
        toggleSidebar,
        closeOverlay,
        toggle,
        mainId,
      }}
    >
      <div
        className="cairn-AppShell"
        data-chrome-toggle={windowChrome !== undefined && chromeToggle ? "" : undefined}
        data-height-tier={heightTier}
        data-scroll={scroll}
        data-tabs={tabBar ? (tabsBeside ? "beside" : "bottom") : undefined}
        data-tier={tier}
        data-ui="app-shell"
        data-window-chrome={windowChrome === undefined ? undefined : ""}
        onKeyDown={(event) => {
          if (overlayOpen && event.key === "Escape") {
            event.stopPropagation();
            closeOverlay();
          }
        }}
        ref={root}
      >
        {/* Focus moves by script, so hash routers never read the link as navigation. */}
        <a
          className="cairn-AppShellSkipLink cairn-Focusable"
          href={`#${mainId}`}
          onClick={(event) => {
            event.preventDefault();
            document.getElementById(mainId)?.focus();
          }}
        >
          Skip to content
        </a>
        <div className="cairn-AppShellFrame" data-column={column}>
          {titleBar === undefined ? null : <div className="cairn-AppShellTitleBar">{titleBar}</div>}
          <WindowChrome.Provider value={windowChrome ?? null}>{children}</WindowChrome.Provider>
        </div>
        {windowChrome === undefined ? null : <ChromeStrip dragRegion={windowChrome} toggle={chromeToggle} />}
        <div aria-hidden className="cairn-AppShellBackdrop" data-open={overlayOpen} onClick={closeOverlay} />
      </div>
    </ShellContext.Provider>
  );
}

// Above the sidebar the top row is the window's own: a drag region holding the sidebar toggle, which
// keeps its place while the sidebar docks or hides.
function ChromeStrip({ dragRegion, toggle }: Readonly<{ dragRegion: AppShellDragRegion; toggle: boolean }>) {
  const active = useWindowActive();
  const chrome = { ...dragRegion, "data-window-active": active, "data-window-drag-region": "" };
  return (
    <>
      <div {...chrome} className="cairn-AppShellChrome" />
      {toggle ? (
        <div {...chrome} className="cairn-AppShellChromeToggle">
          <SidebarToggle size="sm" />
        </div>
      ) : null}
    </>
  );
}

// The header and title bar stay usable above an open overlay, so the toggle that opened it closes it.
function Header(props: ElementProps<"header">) {
  useShell("Header");
  return <header {...props} className="cairn-AppShellHeader" />;
}

function Main(props: ElementProps<"main", "id">) {
  const shell = useShell("Main");
  return <main {...props} className="cairn-AppShellMain" id={shell.mainId} inert={shell.overlayOpen} tabIndex={-1} />;
}

export type AppShellSidebarProps = Readonly<{
  children: ReactNode;
  label?: string;
  // Where it has room, a sidebar stays docked; a collapsible one can be hidden there too. Narrower
  // shells show either on request, above the content.
  collapsible?: boolean;
  // Whether a collapsible sidebar is shown where it has room to dock.
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

function Sidebar({
  children,
  label = "Primary",
  collapsible = false,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
}: AppShellSidebarProps) {
  const { registerSidebar, presentation, toggle } = useShell("Sidebar");
  const id = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const latest = useRef({ controlledOpen, onOpenChange });
  useLayoutEffect(() => {
    latest.current = { controlledOpen, onOpenChange };
  });
  const setOpen = useCallback((next: boolean) => {
    if (latest.current.controlledOpen === undefined) setUncontrolledOpen(next);
    latest.current.onOpenChange?.(next);
  }, []);
  useLayoutEffect(() => {
    registerSidebar({ id, collapsible, open, setOpen });
  }, [registerSidebar, id, collapsible, open, setOpen]);
  useLayoutEffect(() => () => registerSidebar(undefined), [registerSidebar]);

  const element = useRef<HTMLElement>(null);
  const previous = useRef(presentation);
  useEffect(() => {
    const sidebar = element.current;
    const from = previous.current;
    previous.current = presentation;
    if (sidebar === null || from === presentation) return;
    if (presentation === "overlay") {
      const current = sidebar.querySelector<HTMLElement>("[aria-current='page']");
      (current ?? sidebar.querySelector<HTMLElement>("a[href], button:not(:disabled)"))?.focus();
      return;
    }
    // Focus stays where the sidebar stays; a sidebar that leaves hands focus back to its toggle.
    const inside = sidebar.contains(document.activeElement) || document.activeElement === document.body;
    if (presentation === "hidden" && inside && toggle.current?.checkVisibility()) toggle.current.focus();
  }, [presentation, toggle]);

  return (
    <nav aria-label={label} className="cairn-AppShellSidebar" data-presentation={presentation} id={id} ref={element}>
      {children}
    </nav>
  );
}

function SidebarHeader(props: ElementProps<"div">) {
  return <div {...props} className="cairn-AppShellSidebarHeader" />;
}

function SidebarFooter(props: ElementProps<"div">) {
  return <div {...props} className="cairn-AppShellSidebarFooter" />;
}

// Place it in the header on the web or in a separate title bar; a shell with window chrome places
// its own. A collapsible sidebar's toggle shows or hides it at every width; a fixed sidebar's is a menu button that appears only
// where the sidebar cannot dock.
function SidebarToggle({ size = "md" }: Readonly<{ size?: ControlSize }>) {
  const { sidebar, presentation, toggleSidebar, toggle } = useShell("SidebarToggle");
  if (sidebar === undefined) return null;
  if (!sidebar.collapsible && presentation === "docked") return null;
  const shown = presentation === "docked" || presentation === "overlay";
  const label = sidebar.collapsible
    ? shown ? "Hide sidebar" : "Show sidebar"
    : shown ? "Close navigation" : "Open navigation";
  return (
    <Tooltip content={label}>
      <IconButton
        aria-controls={sidebar.id}
        aria-expanded={shown}
        aria-label={label}
        onClick={toggleSidebar}
        ref={toggle}
        size={size}
        variant="ghost"
      >
        <Icon name={sidebar.collapsible ? "panel-left" : "menu"} size={size === "sm" ? "sm" : "md"} />
      </IconButton>
    </Tooltip>
  );
}

function NavGroup({ label, children }: Readonly<{ label?: string; children: ReactNode }>) {
  const id = useId();
  return (
    <div
      aria-labelledby={label === undefined ? undefined : id}
      className="cairn-AppShellNavGroup"
      role={label === undefined ? undefined : "group"}
    >
      {label === undefined ? null : (
        <div className="cairn-NavSectionLabel cairn-AppShellNavGroupLabel" id={id}>
          {label}
        </div>
      )}
      <div className="cairn-AppShellNavItems">{children}</div>
    </div>
  );
}

type NavEntry = Readonly<{ icon?: IconName; decoration?: ReactNode; children: ReactNode }>;

function NavGlyph({ icon, decoration }: Omit<NavEntry, "children">) {
  if (decoration != null) return <span className="cairn-AppShellNavGlyph">{decoration}</span>;
  return icon === undefined ? null : <Icon name={icon} size="sm" />;
}

export type AppShellNavItemProps = ElementProps<"a"> & NavEntry & Readonly<{ active?: boolean }>;

function NavItem({ active = false, icon, decoration, children, onClick, ...props }: AppShellNavItemProps) {
  const { overlayOpen, closeOverlay } = useShell("NavItem");
  return (
    <a
      {...props}
      aria-current={active ? "page" : undefined}
      className="cairn-NavItem cairn-AppShellNavItem cairn-Focusable"
      onClick={(event) => {
        onClick?.(event);
        if (overlayOpen) closeOverlay();
      }}
    >
      <NavGlyph decoration={decoration} icon={icon} />
      <span className="cairn-AppShellNavLabel">{children}</span>
    </a>
  );
}

export type AppShellNavActionProps = ElementProps<"button", "type"> & NavEntry;

function NavAction({ icon, decoration, children, onClick, ...props }: AppShellNavActionProps) {
  const { overlayOpen, closeOverlay } = useShell("NavAction");
  return (
    <button
      {...props}
      className="cairn-NavItem cairn-AppShellNavItem cairn-AppShellNavAction cairn-Focusable"
      onClick={(event) => {
        onClick?.(event);
        if (overlayOpen) closeOverlay();
      }}
      type="button"
    >
      <NavGlyph decoration={decoration} icon={icon} />
      <span className="cairn-AppShellNavLabel">{children}</span>
    </button>
  );
}

// A few peer destinations, declared once: a bottom bar in narrow, upright shells, a labelled column
// beside the content in wide or short ones.
function TabBar({ label = "Primary", children }: Readonly<{ label?: string; children: ReactNode }>) {
  const { registerTabBar } = useShell("TabBar");
  useLayoutEffect(() => {
    registerTabBar(true);
    return () => registerTabBar(false);
  }, [registerTabBar]);
  return (
    <nav aria-label={label} className="cairn-AppShellTabBar">
      {children}
    </nav>
  );
}

export type AppShellTabBarItemProps = ElementProps<"a"> & Readonly<{ active?: boolean; icon: IconName; children: ReactNode }>;

function TabBarItem({ active = false, icon, children, ...props }: AppShellTabBarItemProps) {
  useShell("TabBarItem");
  return (
    <a {...props} aria-current={active ? "page" : undefined} className="cairn-AppShellTabBarItem cairn-Focusable">
      <Icon name={icon} />
      <span className="cairn-AppShellTabBarLabel">{children}</span>
    </a>
  );
}

export const AppShell = {
  Root,
  Header,
  Main,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarToggle,
  NavGroup,
  NavItem,
  NavAction,
  TabBar,
  TabBarItem,
};
