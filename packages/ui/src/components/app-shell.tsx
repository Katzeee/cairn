import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { Menu, PanelLeft } from "lucide-react";

import { IconButton } from "./button.js";
import { BannerPlacement } from "./callout.js";
import { Icon, type IconGlyph } from "./icon.js";
import type { ElementProps } from "./internal/element-props.js";
import { ScrollRegion } from "./internal/scroll-region.js";
import { useWindowActive } from "./internal/window-active.js";
import type { ControlSize } from "./internal/variants.js";
import { widthTierFor, type WidthTier as Tier } from "./internal/width-tier.js";
import { Tooltip } from "./tooltip.js";

// The vertical tier follows the shell's shape, height over width: short below 0.8 (a phone on its
// side, a half-open foldable), square up to 1.2 (a wide foldable's cover screen), tall beyond.
type HeightTier = "compact" | "medium" | "expanded";
const heightTierFor = (width: number, height: number): HeightTier => {
  const ratio = height / width;
  return ratio < 0.8 ? "compact" : ratio < 1.2 ? "medium" : "expanded";
};

type NavigationState = Readonly<{
  id: string;
  collapsible: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  // A few destinations, each with an icon, fit a bar; more take a drawer.
  fitsBar: boolean;
}>;

// How the navigation appears: a docked sidebar, or a drawer shown above the content on request,
// where the shell is expanded; a bar of destinations or a drawer where it is narrower.
type Presentation = "docked" | "overlay" | "hidden" | "bar";

// Material's navigation bar holds three to five destinations.
const barCapacity = 5;

type ShellAction = "toggleNavigation";

// Default key table: Control-Command-S, the macOS Show/Hide Sidebar command.
function navigationShortcut(event: globalThis.KeyboardEvent): ShellAction | undefined {
  const chord = event.ctrlKey && event.metaKey && !event.altKey && !event.shiftKey;
  return chord && event.key.toLowerCase() === "s" ? "toggleNavigation" : undefined;
}

function presentationFor(tier: Tier, navigation: NavigationState, requested: boolean): Presentation {
  if (tier === "expanded") return !navigation.collapsible || navigation.open || requested ? "docked" : "hidden";
  if (navigation.fitsBar) return "bar";
  return requested ? "overlay" : "hidden";
}

type ShellState = Readonly<{
  tier: Tier;
  navigation: NavigationState | undefined;
  registerNavigation: (navigation: NavigationState | undefined) => void;
  presentation: Presentation;
  overlayOpen: boolean;
  toggleNavigation: () => void;
  closeOverlay: () => void;
  toggle: RefObject<HTMLButtonElement | null>;
  mainId: string;
  scroll: "page" | "panes";
  setBannerHeight: (height: number) => void;
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
  // The window's top row is the shell's own: the navigation toggle over the sidebar and each page bar
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
  const [navigation, registerNavigation] = useState<NavigationState>();
  const [overlayRequested, setOverlayRequested] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);

  useLayoutEffect(() => {
    const element = root.current;
    if (element === null) return;
    // A page-scrolling shell grows with its content, so its visible height is the viewport's.
    const update = () => {
      const { width, height } = element.getBoundingClientRect();
      setTier(widthTierFor(width));
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

  const presentation = navigation === undefined ? "hidden" : presentationFor(tier, navigation, overlayRequested);
  const drawer = navigation !== undefined && tier !== "expanded" && !navigation.fitsBar;

  // An overlay the user opened stays shown, docked, once the shell is wide enough.
  useLayoutEffect(() => {
    if (!overlayRequested || drawer) return;
    // Clear the request only once the navigation reports open, so no render in between hides it.
    if (tier === "expanded" && navigation?.collapsible && !navigation.open) navigation.setOpen(true);
    else setOverlayRequested(false);
  }, [overlayRequested, drawer, navigation, tier]);

  const overlayOpen = presentation === "overlay";
  // A bar leaves the bottom edge for a rail beside the content where the shell is not compact, or is
  // too short to spare a row for it.
  const bar = presentation !== "bar" ? undefined : tier !== "compact" || heightTier === "compact" ? "rail" : "bottom";
  const column = presentation === "docked" ? "sidebar" : bar === "rail" ? "rail" : "none";

  const toggleNavigation = useCallback(() => {
    if (navigation === undefined) return;
    if (drawer) setOverlayRequested((open) => !open);
    else if (tier === "expanded" && navigation.collapsible) navigation.setOpen(!navigation.open);
  }, [navigation, drawer, tier]);
  const closeOverlay = useCallback(() => setOverlayRequested(false), []);
  // A bar always shows its destinations, so only a sidebar or a drawer has a toggle.
  const toggleAvailable = navigation !== undefined && (drawer || (tier === "expanded" && navigation.collapsible));

  // Show or hide the navigation from anywhere in the window. Keys the table does not name propagate.
  useEffect(() => {
    if (!toggleAvailable) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) return;
      if (navigationShortcut(event) !== "toggleNavigation") return;
      event.preventDefault();
      toggleNavigation();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleAvailable, toggleNavigation]);

  return (
    <ShellContext.Provider
      value={{
        tier,
        navigation,
        registerNavigation,
        presentation,
        overlayOpen,
        toggleNavigation,
        closeOverlay,
        toggle,
        mainId,
        scroll,
        setBannerHeight,
      }}
    >
      <div
        className="cairn-AppShell"
        data-bar={bar}
        data-chrome-toggle={windowChrome !== undefined && toggleAvailable ? "" : undefined}
        data-height-tier={heightTier}
        data-scroll={scroll}
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
        style={bannerHeight === 0 ? undefined : ({ "--cairn-app-shell-banner-height": `${bannerHeight}px` } as CSSProperties)}
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
        {windowChrome === undefined ? null : <ChromeStrip dragRegion={windowChrome} toggle={toggleAvailable} />}
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
          <NavigationToggle size="sm" />
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
  if (shell.scroll === "page") {
    return <main {...props} className="cairn-AppShellMain" id={shell.mainId} inert={shell.overlayOpen} tabIndex={-1} />;
  }
  const { children, ...rest } = props;
  return (
    <ScrollRegion render={<main {...rest} className="cairn-AppShellMain" inert={shell.overlayOpen} />} viewportId={shell.mainId}>
      {children}
    </ScrollRegion>
  );
}

export type AppShellBannerProps = Readonly<{ children: ReactNode }>;

// The region for conditions of the whole application, such as a lost connection: it stays above every
// page while the application renders something in it. A Callout here takes the banner's presentation;
// several stack. A condition of one page or pane is a Callout in that page's content.
function Banner({ children }: AppShellBannerProps) {
  const { overlayOpen, setBannerHeight } = useShell("Banner");
  const element = useRef<HTMLDivElement>(null);
  // Under window chrome the banner sits below the page bars, which keep its height clear.
  useLayoutEffect(() => {
    const banner = element.current;
    if (banner === null) return;
    const observer = new ResizeObserver(() => setBannerHeight(banner.offsetHeight));
    observer.observe(banner);
    return () => {
      observer.disconnect();
      setBannerHeight(0);
    };
  }, [setBannerHeight]);
  return (
    <div className="cairn-AppShellBanner" inert={overlayOpen} ref={element}>
      <BannerPlacement.Provider value={true}>{children}</BannerPlacement.Provider>
    </div>
  );
}

export type AppShellNavigationProps = Readonly<{
  children: ReactNode;
  label?: string;
  // Where it has room, the navigation docks as a sidebar; a collapsible one can be hidden there too.
  // Narrower shells show a few destinations as a bar and more as a drawer opened on request.
  collapsible?: boolean;
  // Whether a collapsible sidebar is shown where it has room to dock.
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

type Destination = Readonly<{ icon: boolean }>;

// Given to the navigation's parts: how it appears, and where destinations register.
const NavigationContext = createContext<Readonly<{
  presentation: Presentation;
  register: (key: string, destination: Destination) => () => void;
}> | null>(null);

function useNavigation(part: string) {
  const navigation = useContext(NavigationContext);
  if (navigation === null) throw new Error(`AppShell.${part} must be placed inside AppShell.Navigation.`);
  return navigation;
}

function Navigation({
  children,
  label = "Primary",
  collapsible = false,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
}: AppShellNavigationProps) {
  const { registerNavigation, presentation, toggle } = useShell("Navigation");
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

  const [destinations, setDestinations] = useState<ReadonlyMap<string, Destination>>(new Map());
  const register = useCallback((key: string, destination: Destination) => {
    setDestinations((current) => new Map(current).set(key, destination));
    return () =>
      setDestinations((current) => {
        const next = new Map(current);
        next.delete(key);
        return next;
      });
  }, []);
  const fitsBar =
    destinations.size > 0 && destinations.size <= barCapacity && [...destinations.values()].every(({ icon }) => icon);

  useLayoutEffect(() => {
    registerNavigation({ id, collapsible, open, setOpen, fitsBar });
  }, [registerNavigation, id, collapsible, open, setOpen, fitsBar]);
  useLayoutEffect(() => () => registerNavigation(undefined), [registerNavigation]);

  const element = useRef<HTMLElement>(null);
  // Whether the user's focus is in the navigation. A destination that unmounts while focused leaves
  // no blur behind, so this still holds when the focus has fallen to the body.
  const focused = useRef(false);
  const previous = useRef(presentation);
  useEffect(() => {
    const navigation = element.current;
    const from = previous.current;
    previous.current = presentation;
    if (navigation === null || from === presentation) return;
    if (presentation === "overlay") {
      const current = navigation.querySelector<HTMLElement>("[aria-current='page']");
      (current ?? navigation.querySelector<HTMLElement>("a[href], button:not(:disabled)"))?.focus();
      return;
    }
    // Focus stays where the navigation stays; a drawer or sidebar that leaves with the user's focus
    // hands it to the toggle. Resizing the window never moves focus that was elsewhere.
    if (presentation === "hidden" && focused.current && toggle.current?.checkVisibility()) toggle.current.focus();
  }, [presentation, toggle]);

  const context = useMemo(() => ({ presentation, register }), [presentation, register]);
  return (
    <nav
      aria-label={label}
      className="cairn-AppShellNavigation"
      data-presentation={presentation}
      id={id}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) focused.current = false;
      }}
      onFocus={() => {
        focused.current = true;
      }}
      ref={element}
    >
      <NavigationContext.Provider value={context}>
        {/* A bar never scrolls, so only a sidebar or a drawer is a scroll region. */}
        {presentation === "bar" ? (
          <div className="cairn-AppShellNavigationContent">{children}</div>
        ) : (
          <ScrollRegion contentClassName="cairn-AppShellNavigationContent">{children}</ScrollRegion>
        )}
      </NavigationContext.Provider>
    </nav>
  );
}

// Content that is not a destination, such as a brand or a status. A sidebar or a drawer shows it; a
// bar holds destinations only, so nothing here may be the only place the user can reach it.
function NavHeader(props: ElementProps<"div">) {
  useNavigation("NavHeader");
  return <div {...props} className="cairn-AppShellNavHeader" />;
}

function NavFooter(props: ElementProps<"div">) {
  useNavigation("NavFooter");
  return <div {...props} className="cairn-AppShellNavFooter" />;
}

// Place it in the header on the web or in a separate title bar; a shell with window chrome places
// its own. A collapsible sidebar's toggle shows or hides it at every width; otherwise it is a menu
// button that appears only where the destinations take a drawer.
function NavigationToggle({ size = "md" }: Readonly<{ size?: ControlSize }>) {
  const { navigation, presentation, tier, toggleNavigation, toggle } = useShell("NavigationToggle");
  if (navigation === undefined || presentation === "bar") return null;
  if (presentation === "docked" && !navigation.collapsible) return null;
  const sidebar = tier === "expanded" && navigation.collapsible;
  const shown = presentation === "docked" || presentation === "overlay";
  const label = sidebar ? (shown ? "Hide sidebar" : "Show sidebar") : shown ? "Close navigation" : "Open navigation";
  return (
    <Tooltip content={label}>
      <IconButton
        aria-controls={navigation.id}
        aria-expanded={shown}
        aria-label={label}
        onClick={toggleNavigation}
        ref={toggle}
        size={size}
        variant="ghost"
      >
        <Icon glyph={sidebar ? PanelLeft : Menu} size={size === "sm" ? "sm" : "md"} />
      </IconButton>
    </Tooltip>
  );
}

export type AppShellNavGroupProps = Readonly<{
  // Names the group where the navigation has room for it.
  label?: string;
  // Groups at the end sit at the bottom of a sidebar, as settings do, and last in a bar.
  placement?: "start" | "end";
  children: ReactNode;
}>;

function NavGroup({ label, placement = "start", children }: AppShellNavGroupProps) {
  useNavigation("NavGroup");
  const id = useId();
  return (
    <div
      aria-labelledby={label === undefined ? undefined : id}
      className="cairn-AppShellNavGroup"
      data-placement={placement}
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

type NavEntry = Readonly<{
  icon?: IconGlyph;
  // Takes the icon's place, such as a Status dot.
  decoration?: ReactNode;
  // A count at the destination, such as unread messages or connected devices; zero shows nothing.
  // A sidebar shows it after the label, a bar on the icon.
  badge?: number;
  children: ReactNode;
}>;

function NavEntryContent({ icon, decoration, badge, children }: NavEntry) {
  const { presentation } = useNavigation("NavItem");
  const glyph =
    decoration != null ? (
      <span className="cairn-AppShellNavGlyph">{decoration}</span>
    ) : icon === undefined ? null : (
      <Icon glyph={icon} size={presentation === "bar" ? "md" : "sm"} />
    );
  return (
    <>
      {glyph}
      <span className="cairn-AppShellNavLabel">{children}</span>
      {badge === undefined || badge <= 0 ? null : (
        <span className="cairn-AppShellNavBadge">{badge > 99 ? "99+" : badge}</span>
      )}
    </>
  );
}

function useDestination(entry: NavEntry) {
  const { register } = useNavigation("NavItem");
  const key = useId();
  const icon = entry.icon !== undefined || entry.decoration != null;
  useLayoutEffect(() => register(key, { icon }), [register, key, icon]);
}

export type AppShellNavItemProps = ElementProps<"a"> & NavEntry & Readonly<{ active?: boolean }>;

function NavItem({ active = false, icon, decoration, badge, children, onClick, ...props }: AppShellNavItemProps) {
  const { overlayOpen, closeOverlay } = useShell("NavItem");
  useDestination({ icon, decoration, children });
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
      <NavEntryContent badge={badge} decoration={decoration} icon={icon}>
        {children}
      </NavEntryContent>
    </a>
  );
}

export type AppShellNavActionProps = ElementProps<"button", "type"> & NavEntry;

function NavAction({ icon, decoration, badge, children, onClick, ...props }: AppShellNavActionProps) {
  const { overlayOpen, closeOverlay } = useShell("NavAction");
  useDestination({ icon, decoration, children });
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
      <NavEntryContent badge={badge} decoration={decoration} icon={icon}>
        {children}
      </NavEntryContent>
    </button>
  );
}

export const AppShell = {
  Root,
  Header,
  Banner,
  Main,
  Navigation,
  NavHeader,
  NavFooter,
  NavigationToggle,
  NavGroup,
  NavItem,
  NavAction,
};
